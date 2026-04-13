import { createHash } from "crypto";
import { getSupabase } from "./supabase";
import { LIMITS } from "./config";

export function hashIP(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

export function getClientIP(request: Request): string {
  const forwarded = (request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "").split(",")[0].trim();
  return forwarded || "unknown";
}

export interface RateLimitResult {
  allowed: boolean;
  reason?: "burst" | "daily_limit";
  dailyUsed: number;
  dailyLimit: number;
  remaining: number;
  retryAfter?: number;
}

export async function checkRateLimit(ipHash: string): Promise<RateLimitResult> {
  const supabase = getSupabase();
  const now = Date.now();

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  // Run burst check and daily check in parallel
  const [minuteResult, dailyResult] = await Promise.all([
    supabase
      .from("api_usage")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", new Date(now - 60_000).toISOString()),
    supabase
      .from("api_usage")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", todayStart.toISOString()),
  ]);

  const minuteCount = minuteResult.count ?? 0;
  const dailyCount = dailyResult.count ?? 0;

  if (minuteCount >= LIMITS.RATE_LIMIT_PER_MINUTE) {
    return {
      allowed: false,
      reason: "burst",
      dailyUsed: dailyCount,
      dailyLimit: LIMITS.FREE_DAILY_REWRITES,
      remaining: Math.max(0, LIMITS.FREE_DAILY_REWRITES - dailyCount),
      retryAfter: 60,
    };
  }

  if (dailyCount >= LIMITS.FREE_DAILY_REWRITES) {
    return {
      allowed: false,
      reason: "daily_limit",
      dailyUsed: dailyCount,
      dailyLimit: LIMITS.FREE_DAILY_REWRITES,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    dailyUsed: dailyCount,
    dailyLimit: LIMITS.FREE_DAILY_REWRITES,
    remaining: LIMITS.FREE_DAILY_REWRITES - dailyCount,
  };
}

export async function recordUsage(
  ipHash: string,
  style: string,
  inputLength: number,
  responseMs: number
) {
  const supabase = getSupabase();
  await supabase.from("api_usage").insert({
    ip_hash: ipHash,
    style,
    input_length: inputLength,
    response_ms: responseMs,
  });
}

export async function getDailyUsage(ipHash: string) {
  const supabase = getSupabase();
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("api_usage")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", todayStart.toISOString());

  const used = count ?? 0;
  return {
    used,
    limit: LIMITS.FREE_DAILY_REWRITES,
    remaining: Math.max(0, LIMITS.FREE_DAILY_REWRITES - used),
  };
}
