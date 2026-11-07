import Gate from '@/components/layout/Gate/Gate';
import HomePage from '@/screens/Home/HomePage';
import { Landing, PublicShell } from '@/screens/Public/Public';
import { getLanding } from '@/services/tmdbServer';
import { APP } from '@/config/app.config';
import { copy } from '@/i18n';

export const revalidate = 3600;

export const metadata = {
  title: { absolute: copy.seo.landingMeta(APP.name) },
  description: copy.seo.landingLead,
  alternates: { canonical: '/' },
};

// Sin sesión: portada pública (la que indexa Google). Con sesión: el inicio de la app.
export default async function Page() {
  const data = await getLanding();
  return <Gate app={<HomePage />} pub={<PublicShell><Landing data={data} /></PublicShell>} />;
}
