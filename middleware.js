import { NextResponse } from "next/server";
export async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  if (path === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }
}
