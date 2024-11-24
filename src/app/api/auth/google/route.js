import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { token, email, name, photo } = await req.json();
    // Crear respuesta
    const response = NextResponse.json(
      { message: "Inicio de sesión con Google exitoso" },
      { status: 200 }
    );

    // Establecer cookie para el token
    response.cookies.set({
      name: "firebaseToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    // Establecer cookie para el email
    response.cookies.set({
      name: "userEmail",
      value: email,
      httpOnly: false, // Permitir acceso desde JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    // Establecer cookie para el nombre
    response.cookies.set({
      name: "userName",
      value: name,
      httpOnly: false, // Permitir acceso desde JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    // Establecer cookie para la foto
    response.cookies.set({
      name: "userPhoto",
      value: photo,
      httpOnly: false, // Permitir acceso desde JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Error al iniciar sesión con Google" },
      { status: 500 }
    );
  }
}
