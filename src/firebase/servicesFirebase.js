import app from "./firebase";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { FIREBASE_ERRORS } from "./firebaseErrors";

export const auth = getAuth(app);

export async function singInWithEmailAndPassword(email, password) {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("isLoggedIn", "true");
    return response
  } catch (error) {    
    const errorMessage =
      FIREBASE_ERRORS[error.code] || FIREBASE_ERRORS["default"];
    return errorMessage;
  }
}

export async function registerUserWithEmailAndPassword(email, password) {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    return response
  } catch (error) {
    const errorMessage = FIREBASE_ERRORS[error.code] || FIREBASE_ERRORS['default']
    return errorMessage
  }
}

export async function logout() {
  try {
   const response = await signOut(auth);
   return response
  } catch (error) {
    console.error("Logout failed");
  }
}

