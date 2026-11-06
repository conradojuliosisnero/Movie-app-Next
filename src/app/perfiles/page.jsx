import Guard from '@/components/layout/Guard/Guard';
import ProfilesPage from '@/screens/Profiles/ProfilesPage';

export const metadata = { title: '¿Quién ve hoy?' };

export default function Page() {
  return <Guard need="auth"><ProfilesPage /></Guard>;
}
