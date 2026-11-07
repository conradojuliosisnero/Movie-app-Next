import { notFound } from 'next/navigation';
import Gate from '@/components/layout/Gate/Gate';
import TitlePage from '@/screens/Title/TitlePage';
import { PublicShell, PublicTitle } from '@/screens/Public/Public';
import { getPublicTitle, titlePath } from '@/services/tmdbServer';
import { copy } from '@/i18n';

export const revalidate = 86400;

// Acepta /titulo/movie-550 y /titulo/movie-550-el-club-de-la-pelea (el nombre es para Google).
const parseId = (param) => decodeURIComponent(param).match(/^((?:movie|tv)-\d+)(?:-[a-z0-9-]*)?$/)?.[1] ?? null;

// TMDB caído no es “no existe”: se muestra la página sin datos públicos en vez de un 404.
const load = (id) => getPublicTitle(id).catch(() => undefined);

export async function generateMetadata({ params }) {
  const id = parseId((await params).id);
  const t = id ? await load(id) : null;
  if (!t) return { title: copy.seo.titleFallback };
  const name = t.year ? `${t.title} (${t.year})` : t.title;
  const kind = t.type === 'series' ? copy.seo.series : copy.seo.movie;
  const description = (t.synopsis || copy.seo.metaFallback(t.title)).slice(0, 158);
  return {
    title: copy.seo.metaTitle(name, kind.toLowerCase()),
    description,
    alternates: { canonical: titlePath(t) },
    robots: t.adult ? { index: false, follow: false } : undefined,
    openGraph: {
      type: t.type === 'series' ? 'video.tv_show' : 'video.movie',
      title: name,
      description,
      url: titlePath(t),
      images: !t.adult && t.backdropLarge ? [{ url: t.backdropLarge, width: 1280, height: 720, alt: t.title }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: name, description },
  };
}

export default async function Page({ params }) {
  const id = parseId((await params).id);
  if (!id) notFound();
  const t = await load(id);
  if (t === null) notFound();
  return <Gate app={<TitlePage id={id} />} pub={<PublicShell><PublicTitle t={t} /></PublicShell>} />;
}
