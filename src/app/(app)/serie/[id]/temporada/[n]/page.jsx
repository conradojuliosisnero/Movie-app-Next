import { notFound } from 'next/navigation';
import SeasonPage from '@/screens/Season/SeasonPage';

export const metadata = { title: 'Temporada' };

export default async function Page({ params }) {
  const { id, n } = await params;
  if (!/^\d+$/.test(id) || !/^\d+$/.test(n)) notFound();
  return <SeasonPage seriesId={Number(id)} n={Number(n)} />;
}
