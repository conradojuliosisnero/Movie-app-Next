'use client';
// Protege pantallas: espera a saber quién entró y lo manda al paso que le falta.
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/store/SessionContext';
import { useLibrary } from '@/store/LibraryContext';
import { ROUTES } from '@/config/app.config';
import Splash from '@/components/ui/Splash/Splash';

/** need: 'auth' (solo sesión) | 'profile' (sesión + bienvenida hecha + perfil elegido + lista cargada) */
export default function Guard({ need = 'profile', children }) {
  const session = useSession();
  const lib = useLibrary();
  const router = useRouter();
  const pathname = usePathname();

  let redirect = null;
  if (!session.loading) {
    // Al login, recordando dónde estaba para volver ahí al entrar.
    if (!session.isAuthenticated) redirect = `${ROUTES.login}?next=${encodeURIComponent(pathname)}`;
    else if (need === 'profile' && !session.onboarded) redirect = ROUTES.onboarding;
    else if (need === 'profile' && !session.profile) redirect = ROUTES.profiles;
  }

  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);

  const waitingLibrary = need === 'profile' && !lib.ready;
  if (session.loading || redirect || waitingLibrary) return <Splash />;
  return children;
}
