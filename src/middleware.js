import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("firebaseToken")?.value;
  const { pathname } = req.nextUrl;
  const isApiRequest = req.headers.get("accept")?.includes("application/json");

  // Permitir solo solicitudes fetch a la API si tiene token
  if (pathname.startsWith("/api")) {
    if (isApiRequest && token) {
      return NextResponse.next();
    }
    // Bloquear acceso directo a rutas API
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // si no esta autenticado y va a una ruta protegida, redirigir a "/"
  if (!token && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Si está autenticado y va al alguna de estas rutas, redirigir a /home
  switch (pathname) {
    case "/":
      if (token) return NextResponse.redirect(new URL("/home", req.url));
      break;
    case "/forgot-password":
      if (token) return NextResponse.redirect(new URL("/home", req.url));
      break;
    case "/verify-email":
      if (token) return NextResponse.redirect(new URL("/home", req.url));
      break;
    default:
      break;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/forgot-password",
    "/verify-email",
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
