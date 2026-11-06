import Guard from '@/components/layout/Guard/Guard';
import AppLayout from '@/components/layout/AppLayout/AppLayout';

// Todas las pantallas de este grupo exigen sesión, bienvenida hecha y perfil elegido.
export default function Layout({ children }) {
  return (
    <Guard need="profile">
      <AppLayout>{children}</AppLayout>
    </Guard>
  );
}
