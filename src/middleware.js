import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("firebaseToken")?.value;
  const { pathname } = req.nextUrl;
  const isApiRequest = req.headers.get("accept")?.includes("application/json");
  
  // Permitir solo solicitudes fetch a la API si tiene token
  if (pathname.startsWith("/api")) {
    if (isApiRequest && (token || pathname === "/api/auth/login" || pathname === "/api/auth/logout")) {
      return NextResponse.next();
    }
    // Bloquear acceso directo a rutas API
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Si no está autenticado y va a una ruta protegida, redirigir a "/login"
  if (!token && pathname !== "/" && pathname !== "/api/auth/login" && pathname !== "/api/auth/logout") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Si está autenticado y va a alguna de estas rutas, redirigir a /home
  if (token && (pathname === "/" || pathname === "/forgot-password" || pathname === "/verify-email")) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/login",
    "/api/:path*",
    "/search",
    "/movie-details",
    "/serie-details",
    "/about",
    "/en-cines",
    "/movies",
    "/series",
    "/novedades",
    "/person",
    "/profile",
    "/season/:id*",
  ],
};
