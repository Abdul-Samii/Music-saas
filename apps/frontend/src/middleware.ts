import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth middleware disabled until backend login is wired up
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
