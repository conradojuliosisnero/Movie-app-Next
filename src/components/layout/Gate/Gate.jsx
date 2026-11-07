'use client';
// Pantallas públicas (portada, fichas, personas): sin sesión se ve la versión pública, que llega
// armada desde el servidor (es la que lee Google). Con sesión, la app de siempre.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/store/SessionContext';
import { useLibrary } from '@/store/LibraryContext';
import AppLayout from '../AppLayout/AppLayout';
import Splash from '@/components/ui/Splash/Splash';
import { ROUTES } from '@/config/app.config';

export default function Gate({ app, pub }) {
  const session = useSession();
  const lib = useLibrary();
  const router = useRouter();
  const signedIn = !session.loading && session.isAuthenticated;
  // ¿Entró antes en este navegador? Mientras Firebase confirma, se muestra la pantalla de carga
  // en vez de la versión pública (que además queda oculta por CSS desde el primer pintado).
  const [hinted, setHinted] = useState(false);
  useEffect(() => { setHinted('session' in document.documentElement.dataset); }, []);

  let redirect = null;
  if (signedIn && !session.onboarded) redirect = ROUTES.onboarding;
  else if (signedIn && !session.profile) redirect = ROUTES.profiles;
  useEffect(() => { if (redirect) router.replace(redirect); }, [redirect, router]);

  useEffect(() => {
    if (!session.loading && !session.isAuthenticated) { delete document.documentElement.dataset.session; setHinted(false); }
  }, [session.loading, session.isAuthenticated]);

  if (signedIn) return redirect || !lib.ready ? <Splash /> : <AppLayout>{app}</AppLayout>;
  if (session.loading && hinted) return <Splash />;
  return pub;
}
