'use client';
// Página propia de una película o serie: misma ficha que el panel, a pantalla completa.
import { useRouter } from 'next/navigation';
import TitleDetails from '@/components/title/TitleDetails/TitleDetails';
import { ROUTES } from '@/config/app.config';

export default function TitlePage({ id }) {
  const router = useRouter();
  const back = () => (window.history.length > 1 ? router.back() : router.push(ROUTES.home));
  return <TitleDetails key={id} item={{ id }} variant="page" onBack={back} />;
}
