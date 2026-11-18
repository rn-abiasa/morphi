import { NextResponse } from "next/server";

export function proxy(req) {
  const isLoggedIn = req.cookies.get("isLoggedIn");

  if (!isLoggedIn && req.nextUrl.pathname === "/home") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isLoggedIn && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
}

export const config = {
  matcher: ["/", "/home"],
};
