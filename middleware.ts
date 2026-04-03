import { NextRequest, NextResponse } from "next/server";

import { roleRoutes } from "@/lib/data";
import { AppRole } from "@/lib/types";

const protectedPrefixes = Object.values(roleRoutes);

function getRoleFromPath(pathname: string): AppRole | null {
  const match = Object.entries(roleRoutes).find(([, route]) => pathname.startsWith(route));

  if (!match) {
    return null;
  }

  return match[0] as AppRole;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  const expectedRole = getRoleFromPath(pathname);
  const sessionRole = request.cookies.get("labmedix-role")?.value as AppRole | undefined;

  if (!sessionRole) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (expectedRole && sessionRole !== expectedRole) {
    const redirectUrl = new URL(roleRoutes[sessionRole], request.url);
    redirectUrl.searchParams.set("notice", "You were redirected to your assigned panel.");
    return NextResponse.redirect(redirectUrl);
  }

  if (searchParams.get("logout") === "true") {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("labmedix-role");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/patient/:path*", "/doctor/:path*", "/lab/:path*", "/operations/:path*"]
};
