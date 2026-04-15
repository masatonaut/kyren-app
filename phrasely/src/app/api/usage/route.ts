import { NextResponse } from "next/server";
import { getClientIP, hashIP, getDailyUsage, isProUser } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const proEmail = url.searchParams.get("email");

    // Check Pro status if email provided
    if (proEmail) {
      const isPro = await isProUser(proEmail);
      if (isPro) {
        return NextResponse.json({
          used: 0,
          limit: -1,
          remaining: -1,
          isPro: true,
        });
      }
    }

    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);
    const usage = await getDailyUsage(ipHash);

    return NextResponse.json({ ...usage, isPro: false });
  } catch (error) {
    console.error("Usage check error:", error);
    return NextResponse.json(
      { used: 0, limit: 3, remaining: 3, isPro: false },
      { status: 200 }
    );
  }
}
