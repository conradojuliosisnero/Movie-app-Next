import { notFound } from 'next/navigation';
import Gate from '@/components/layout/Gate/Gate';
import PersonPage from '@/screens/Person/PersonPage';
import { PublicPerson, PublicShell } from '@/screens/Public/Public';
import { getPublicPerson, personPath } from '@/services/tmdbServer';
import { copy } from '@/i18n';

export const revalidate = 86400;

// Acepta /persona/287 y /persona/287-brad-pitt.
const parseId = (param) => decodeURIComponent(param).match(/^(\d+)(?:-[a-z0-9-]*)?$/)?.[1] ?? null;
const load = (id) => getPublicPerson(id).catch(() => undefined);

export async function generateMetadata({ params }) {
  const id = parseId((await params).id);
  const p = id ? await load(id) : null;
  if (!p) return { title: copy.seo.personFallbackTitle };
  const description = (p.bio || copy.seo.personFallback(p.name)).slice(0, 158);
  return {
    title: copy.seo.personMeta(p.name),
    description,
    alternates: { canonical: personPath(p) },
    robots: p.adult ? { index: false, follow: false } : undefined,
    openGraph: { type: 'profile', title: p.name, description, url: personPath(p), images: p.photo ? [{ url: p.photo, alt: p.name }] : undefined },
  };
}

export default async function Page({ params }) {
  const id = parseId((await params).id);
  if (!id) notFound();
  const p = await load(id);
  if (p === null) notFound();
  return <Gate app={<PersonPage id={Number(id)} />} pub={<PublicShell><PublicPerson p={p} /></PublicShell>} />;
}
