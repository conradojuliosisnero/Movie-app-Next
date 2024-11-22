import { signInWithEmailAndPassword } from "@/firebase/servicesFirebase";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const userCredential = await signInWithEmailAndPassword(email, password);
    const token = await userCredential.user.getIdToken();

    // Crear respuesta
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    // Establecer cookie para el token de Firebase
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

    return response;
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
