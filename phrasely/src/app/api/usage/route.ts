import { NextResponse } from "next/server";
import { getClientIP, hashIP, getDailyUsage } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);
    const usage = await getDailyUsage(ipHash);

    return NextResponse.json(usage);
  } catch (error) {
    console.error("Usage check error:", error);
    return NextResponse.json(
      { used: 0, limit: 3, remaining: 3 },
      { status: 200 }
    );
  }
}
