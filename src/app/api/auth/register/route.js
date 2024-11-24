import { NextResponse } from "next/server";
import { registerUserWithEmailAndPassword } from "@/firebase/servicesFirebase";

export async function POST(req) {
  const { email, password } = await req.json();
  console.log("Email:", email);
  console.log("Password:",password);
  try {
    const userCredential = await registerUserWithEmailAndPassword(
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    const response = NextResponse.json(
      { message: "User registered successfully" },
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
      httpOnly: false, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Error al registrarte" },
      { status: 500 }
    );
  }
}
