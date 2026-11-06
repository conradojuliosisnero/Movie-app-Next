import { Dela_Gothic_One } from 'next/font/google';
import AnimePage from '@/screens/Anime/AnimePage';

// Tipografía de la pantalla de Animé: trazo grueso con glifos japoneses (solo se carga en esta ruta).
// Sin preload: el navegador baja solo los fragmentos (unicode-range) de los caracteres que se usan, incluido el japonés.
const anime = Dela_Gothic_One({ weight: '400', preload: false, variable: '--nf-anime', display: 'swap' });

export const metadata = { title: 'Animé' };

export default function Page() {
  return <AnimePage fontClass={anime.variable} />;
}
