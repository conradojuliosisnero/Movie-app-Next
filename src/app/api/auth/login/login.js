import { auth } from "@/firebase/servicesFirebase";
import { singInWithEmailAndPassword } from "@/firebase/servicesFirebase";
import Cookies from "cookies";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const userCredential = await singInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      const cookies = new Cookies(req, res);
      cookies.set("firebaseToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      });

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
