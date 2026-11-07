'use client';
// Sesión: quién entró (Firebase Auth o modo explorar), su cuenta y el perfil activo.
// Cuenta en Firestore: users/{uid} = { onboarded, profiles: [{ id, name, kids, hues, last }] }
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  GoogleAuthProvider, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail,
  signInWithEmailLink, signInWithPopup, signOut,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { storage } from '@/services/storage';
import { APP } from '@/config/app.config';
import { resetIntros } from '@/components/ui/BrandIntro/BrandIntro';

const SessionContext = createContext(null);

const GUEST_ACCOUNT = { onboarded: true, profiles: [{ id: 'invitado', name: 'Invitado', kids: false, hues: [35, 300] }] };
const EMAIL_KEY = 'emailForSignIn';
const AUTH_TIMEOUT_MS = 4000;
const randomHues = () => { const h = Math.floor(Math.random() * 360); return [h, (h + 40) % 360]; };
const newId = () => Math.random().toString(36).slice(2, 10);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = aún no sabemos
  const [guest, setGuest] = useState(false);
  const [account, setAccount] = useState(null);
  const [profileId, setProfileId] = useState(null);

  // Modo explorar guardado en este navegador.
  useEffect(() => { setGuest(!!storage.get('guest', false)); }, []);

  useEffect(() => {
    // Si Firebase tarda en arrancar (a veces se traba abriendo su base local del navegador),
    // no dejamos la app esperando: se sigue como “sin sesión” y, si luego responde, se actualiza.
    const fallback = setTimeout(() => setUser((u) => (u === undefined ? null : u)), AUTH_TIMEOUT_MS);
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      clearTimeout(fallback);
      setUser(u);
      if (u) { setGuest(false); storage.remove('guest'); }
    });
    return () => { clearTimeout(fallback); unsubscribe(); };
  }, []);

  // Cuenta del usuario: se crea la primera vez que entra.
  useEffect(() => {
    if (!user) { setAccount(guest ? storage.get('guestAccount', GUEST_ACCOUNT) : null); return undefined; }
    const ref = doc(db, 'users', user.uid);
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) { setAccount(snap.data()); return; }
      if (snap.metadata.fromCache) return; // esperar la respuesta del servidor antes de crear la cuenta
      const first = { id: newId(), name: user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'Yo', kids: false, hues: randomHues() };
      setDoc(ref, { onboarded: false, profiles: [first], email: user.email ?? null });
      storage.set(`profile:${user.uid}`, first.id);
      setProfileId(first.id);
    });
  }, [user, guest]);

  // Pista para la próxima carga: “ya entró en este navegador” (ver Gate y el script del layout).
  useEffect(() => {
    if (user || guest) storage.set('session', true);
    else if (user === null) storage.remove('session');
  }, [user, guest]);

  const accountKey = user?.uid ?? (guest ? 'invitado' : null);
  useEffect(() => { setProfileId(accountKey ? storage.get(`profile:${accountKey}`, null) : null); }, [accountKey]);

  const saveAccount = useCallback((patch) => {
    if (!user) {
      setAccount((a) => { const next = { ...a, ...patch }; storage.set('guestAccount', next); return next; });
      return Promise.resolve();
    }
    return setDoc(doc(db, 'users', user.uid), patch, { merge: true });
  }, [user]);

  const selectProfile = useCallback((id) => {
    if (accountKey) storage.set(`profile:${accountKey}`, id);
    setProfileId(id);
  }, [accountKey]);

  const value = useMemo(() => {
    const profiles = account?.profiles ?? [];
    // En modo explorar no hace falta esperar a Firebase.
    const loading = guest && !user ? !account : user === undefined || (!!user && !account);
    return {
      loading,
      user,
      isGuest: guest && !user,
      isAuthenticated: !!user || guest,
      onboarded: !!account?.onboarded,
      profiles,
      profile: profiles.find((p) => p.id === profileId) ?? null,
      accountKey,

      sendEmailLink: async (email) => {
        await sendSignInLinkToEmail(auth, email, { url: `${window.location.origin}/login`, handleCodeInApp: true });
        storage.set(EMAIL_KEY, email);
      },
      isEmailLink: (href) => isSignInWithEmailLink(auth, href),
      storedEmail: () => storage.get(EMAIL_KEY, ''),
      completeEmailLink: async (email, href) => {
        await signInWithEmailLink(auth, email, href);
        storage.remove(EMAIL_KEY);
        resetIntros();
      },
      signInWithGoogle: async () => { await signInWithPopup(auth, new GoogleAuthProvider()); resetIntros(); },
      explore: () => {
        resetIntros();
        storage.set('guest', true);
        storage.set('profile:invitado', GUEST_ACCOUNT.profiles[0].id);
        setGuest(true);
        setProfileId(GUEST_ACCOUNT.profiles[0].id);
      },
      completeOnboarding: () => saveAccount({ onboarded: true }),
      selectProfile,
      clearProfile: () => selectProfile(null),
      createProfile: async ({ name, kids }) => {
        if (profiles.length >= APP.maxProfiles) return null;
        const p = { id: newId(), name, kids, hues: randomHues() };
        await saveAccount({ profiles: [...profiles, p] });
        return p;
      },
      /** Cambia datos de un perfil (por ejemplo, su avatar). */
      updateProfile: (id, patch) => saveAccount({ profiles: profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)) }),
      /** Guarda el último título que vio el perfil (se muestra en “¿Quién ve hoy?”). */
      touchProfile: (title) => {
        if (!user || !profileId) return;
        saveAccount({ profiles: profiles.map((p) => (p.id === profileId ? { ...p, last: title } : p)) });
      },
      logout: async () => {
        resetIntros();
        storage.remove('guest');
        if (accountKey) storage.remove(`profile:${accountKey}`);
        setGuest(false);
        setProfileId(null);
        if (user) await signOut(auth);
      },
    };
  }, [user, guest, account, profileId, accountKey, saveAccount, selectProfile]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
