// Firebase solo corre en el navegador: cada persona tiene su propia sesión.
// La seguridad de los datos la ponen las reglas de Firestore (firestore.rules), no el servidor.
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(config);

export const auth = getAuth(app);
export const db = getFirestore(app);

const ERRORS = {
  'auth/invalid-email': 'Ese correo no parece válido.',
  'auth/invalid-action-code': 'El enlace ya se usó o expiró. Pide uno nuevo.',
  'auth/expired-action-code': 'El enlace expiró. Pide uno nuevo.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/cancelled-popup-request': 'Cerraste la ventana de Google antes de terminar.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite ventanas emergentes.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
  'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase.',
  'auth/operation-not-allowed': 'Este método de acceso no está activado en Firebase.',
};

export const authErrorMessage = (error) => ERRORS[error?.code] ?? 'No pudimos iniciar sesión. Inténtalo de nuevo.';
