import { notFound } from 'next/navigation';
import TitlePage from '@/screens/Title/TitlePage';

export const metadata = { title: 'Ficha' };

export default async function Page({ params }) {
  const { id } = await params;
  if (!/^(movie|tv)-\d+$/.test(id)) notFound();
  return <TitlePage id={id} />;
}
