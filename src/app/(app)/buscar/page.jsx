import { Suspense } from 'react';
import SearchPage from '@/screens/Search/SearchPage';

export const metadata = { title: 'Buscar' };

export default function Page() {
  return <Suspense><SearchPage /></Suspense>;
}
