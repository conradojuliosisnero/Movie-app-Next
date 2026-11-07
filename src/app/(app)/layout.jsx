import Guard from '@/components/layout/Guard/Guard';
import AppLayout from '@/components/layout/AppLayout/AppLayout';

// Pantallas privadas: Google no las indexa.
export const metadata = { robots: { index: false, follow: true } };

// Todas las pantallas de este grupo exigen sesión, bienvenida hecha y perfil elegido.
export default function Layout({ children }) {
  return (
    <Guard need="profile">
      <AppLayout>{children}</AppLayout>
    </Guard>
  );
}
