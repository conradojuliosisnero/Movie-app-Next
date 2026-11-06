import Link from 'next/link';
import Logo from '@/components/ui/Logo/Logo';
import { copy } from '@/i18n';
import { ROUTES } from '@/config/app.config';

export const metadata = { title: copy.notFound.title };

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)', padding: 'var(--space-6)', textAlign: 'center' }}>
      <Logo size="lg" />
      <h1 style={{ fontSize: 'var(--fs-4xl)' }}>{copy.notFound.title}</h1>
      <p className="u-muted">{copy.notFound.body}</p>
      <Link href={ROUTES.home}>{copy.notFound.home} ›</Link>
    </main>
  );
}
