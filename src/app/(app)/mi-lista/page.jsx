import { Suspense } from 'react';
import LibraryPage from '@/screens/Library/LibraryPage';

export const metadata = { title: 'Mi lista' };

export default function Page() {
  return <Suspense><LibraryPage /></Suspense>;
}
