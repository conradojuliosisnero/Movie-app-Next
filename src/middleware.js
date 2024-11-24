import { NextResponse } from "next/server";

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  "/",
  "/verify-email",
  "/forgot-password",
  "/api/auth/login",
  "/api/auth/google",
  "/api/auth/logout",
  "/api/auth/register",
];

export function middleware(req) {
  const token = req.cookies.get("firebaseToken")?.value;
  const { pathname } = req.nextUrl;
  const isApiRequest = req.headers.get("accept")?.includes("application/json");

  // Verificar si es una ruta pública
  const isPublicRoute = publicRoutes.includes(pathname);

  // Manejar rutas API
  if (pathname.startsWith("/api")) {
    // Permitir rutas API públicas o solicitudes autenticadas
    if (isPublicRoute || isApiRequest) {
      return NextResponse.next();
    }
    // Redirigir a home si no está autenticado
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Manejar rutas de páginas
  if (!token && !isPublicRoute) {
    // Usuario no autenticado intentando acceder a ruta protegida
    return NextResponse.redirect(new URL("/", req.url));
  }

  switch (pathname) {
    case "/":
      if (token) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
      break;
    case "/verify-email":
      if (token) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
      break;
    case "/forgot-password":
      if (token) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
      break;
    default:
      break;
  }

  // Permitir acceso
  return NextResponse.next();
}

// Configurar las rutas que deben ser manejadas por el middleware
export const config = {
  matcher: [
    "/",
    "/home",
    "/verify-email",
    "/forgot-password",
    "/api/:path*",
    "/search",
    "/movie-details/:id*",
    "/serie-details/:id*",
    "/about",
    "/en-cines",
    "/movies",
    "/series",
    "/novedades",
    "/person/:id*",
    "/profile",
    "/season/:id*",
  ],
};
