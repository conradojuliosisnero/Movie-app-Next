import { notFound } from 'next/navigation';
import PersonPage from '@/screens/Person/PersonPage';

export const metadata = { title: 'Persona' };

export default async function Page({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  return <PersonPage id={Number(id)} />;
}
