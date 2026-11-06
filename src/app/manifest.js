import { APP } from '@/config/app.config';
import { copy } from '@/i18n';

// Manifiesto de la app web: permite instalar PeliBox en el celular y abrirla a pantalla completa.
export default function manifest() {
  return {
    name: APP.name,
    short_name: APP.name,
    description: copy.app.description,
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0b0c10',
    theme_color: '#0b0c10',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
