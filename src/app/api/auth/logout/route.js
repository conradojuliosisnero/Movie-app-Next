import { logout } from "@/firebase/servicesFirebase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Verificar si existe la cookie
    const token = req.cookies.get("firebaseToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    // Logout de Firebase
    await logout();

    // Crear respuesta
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Eliminar cookie
    response.cookies.set({
      name: "firebaseToken",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0
    });

    // Eliminar cookie del email
    response.cookies.set({
      name: "userEmail",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });


    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Error during logout" },
      { status: 500 }
    );
  }
}