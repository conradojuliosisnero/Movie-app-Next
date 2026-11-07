// Sitemap para Google: portada + títulos y personas populares (se rehace una vez al día).
import { SITE_URL } from '@/config/app.config';
import { getSitemapEntries, personPath, titlePath } from '@/services/tmdbServer';

export const revalidate = 86400;

export default async function sitemap() {
  const { titles, people } = await getSitemapEntries();
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/login`, changeFrequency: 'yearly', priority: 0.3 },
    ...titles.map((t) => ({ url: `${SITE_URL}${titlePath(t)}`, changeFrequency: 'weekly', priority: 0.8 })),
    ...people.map((p) => ({ url: `${SITE_URL}${personPath(p)}`, changeFrequency: 'monthly', priority: 0.5 })),
  ];
}
