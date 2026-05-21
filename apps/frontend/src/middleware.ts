import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  // mysong.to: rewrite /{artist}/{song} → /p/{artist}/{song} (served by the existing route handler)
  if (host === "mysong.to" || host === "www.mysong.to") {
    const url = request.nextUrl.clone();
    url.pathname = `/p${pathname}`;
    return NextResponse.rewrite(url);
  }

  // 1️⃣ Root redirect (must run globally)
	if (pathname === "/") {
		return NextResponse.redirect(new URL("/landing", request.url));
	}

	// 2️⃣ Auth check only for dashboard
	if (pathname.startsWith("/dashboard")) {
		const token = await getToken({
			req: request,
			secret: process.env.NEXTAUTH_SECRET,
		});

		if (!token) {
			return NextResponse.redirect(new URL("/landing", request.url));
		}
	}

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/dashboard/:path*", "/:artist/:song"],
// };

export const config = {
	matcher: ["/:path*"],
};
