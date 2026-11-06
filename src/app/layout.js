import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import Providers from './providers';
import { buildCssVars } from '@/theme/cssVars';
import { APP } from '@/config/app.config';
import { copy } from '@/i18n';
import 'blobatar/motion.css';
import '@/theme/global.css';

const display = Bricolage_Grotesque({ subsets: ['latin'], weight: ['500', '700', '800'], variable: '--nf-display', display: 'swap' });
const body = Instrument_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--nf-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['500'], variable: '--nf-mono', display: 'swap' });

export const metadata = {
  title: { default: `${APP.name} · ${copy.app.tagline}`, template: `%s · ${APP.name}` },
  description: copy.app.description,
};

export const viewport = { themeColor: '#0b0c10' };

// Variables del tema por defecto, pintadas desde el servidor para que no haya parpadeo.
const rootVars = `:root{${Object.entries(buildCssVars(APP.defaultTheme)).map(([k, v]) => `${k}:${v}`).join(';')}}`;

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} ${mono.variable}`} data-theme={APP.defaultTheme}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: rootVars }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
