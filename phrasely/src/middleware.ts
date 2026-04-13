import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Block requests with no User-Agent (basic bot filter)
  const userAgent = request.headers.get("user-agent");
  if (!userAgent) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
