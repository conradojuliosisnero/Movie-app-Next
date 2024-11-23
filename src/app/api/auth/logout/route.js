import { logout } from "@/firebase/servicesFirebase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Verificar si existe la cookie
    const token = req.cookies.get("firebaseToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // Logout de Firebase
    await logout();

    // Crear respuesta
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Eliminar cookies en el backend
    response.cookies.set("firebaseToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("userEmail", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });


    return response;
  } catch (error) {
    return NextResponse.json({ error: "Error during logout" }, { status: 500 });
  }
}
