import app from "./firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { FIREBASE_ERRORS } from "./firebaseErrors";

export const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();


// Funciones para el manejo de la autenticación

// logica de autenticación
export async function singInWithEmailAndPassword(email, password) {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("isLoggedIn", "true");
    return response;
  } catch (error) {
    const errorMessage =
      FIREBASE_ERRORS[error.code] || FIREBASE_ERRORS["default"];
    return errorMessage;
  }
}

// logica de registro
export async function registerUserWithEmailAndPassword(email, password) {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return response;
  } catch (error) {
    const errorMessage =
      FIREBASE_ERRORS[error.code] || FIREBASE_ERRORS["default"];
    return errorMessage;
  }
}

// inicio de sesión con google
export async function signInWithGoogle() {
  try {
    const response = await signInWithPopup(auth, googleAuthProvider);
    return response;
  } catch (error) {
    const errorMessage =
      FIREBASE_ERRORS[error.code] || FIREBASE_ERRORS["default"];
    return errorMessage;
  }
}

// logica de logout
export async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error) {
    console.error("Logout failed");
  }
}