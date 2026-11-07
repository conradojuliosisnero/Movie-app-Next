import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import Providers from './providers';
import { buildCssVars } from '@/theme/cssVars';
import { APP, SITE_URL } from '@/config/app.config';
import { copy } from '@/i18n';
import 'blobatar/motion.css';
import '@/theme/global.css';

const display = Bricolage_Grotesque({ subsets: ['latin'], weight: ['500', '700', '800'], variable: '--nf-display', display: 'swap' });
const body = Instrument_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--nf-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['500'], variable: '--nf-mono', display: 'swap' });

export const metadata = {
  title: { default: `${APP.name} · ${copy.app.tagline}`, template: `%s · ${APP.name}` },
  description: copy.seo.landingLead,
  metadataBase: new URL(SITE_URL),
  keywords: copy.seo.keywords,
  openGraph: { type: 'website', siteName: APP.name, locale: 'es_CO', title: `${APP.name} · ${copy.seo.landingTitle}`, description: copy.seo.landingLead },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  applicationName: APP.name,
  // Instalable: al agregarla a la pantalla de inicio abre como app, sin barra del navegador.
  appleWebApp: { capable: true, title: APP.name, statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
};

// viewport-fit=cover: la app usa toda la pantalla (notch incluido) y respeta las safe areas por CSS.
export const viewport = { themeColor: '#0b0c10', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

// Variables del tema por defecto, pintadas desde el servidor para que no haya parpadeo.
const rootVars = `:root{${Object.entries(buildCssVars(APP.defaultTheme)).map(([k, v]) => `${k}:${v}`).join(';')}}`;

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable}`} data-theme={APP.defaultTheme}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: rootVars }} />
        {/* Si ya entró antes, se oculta la versión pública mientras carga la sesión (sin parpadeo). */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('${APP.storageKey}:session'))document.documentElement.dataset.session='1'}catch(e){}` }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
