// Imagen al compartir el enlace (WhatsApp, X, Facebook…).
import { ImageResponse } from 'next/og';
import { APP } from '@/config/app.config';
import { copy } from '@/i18n';

export const alt = APP.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: 'linear-gradient(135deg, #0b0c10 0%, #1d1320 60%, #3a1a14 100%)', color: '#f4f0ea' }}>
        <div style={{ display: 'flex', fontSize: 120, fontWeight: 800, letterSpacing: -4 }}>
          {APP.nameParts[0]}<span style={{ color: '#f57050' }}>{APP.nameParts[1]}</span>
        </div>
        <div style={{ fontSize: 44, marginTop: 20, opacity: 0.85 }}>{copy.seo.landingTitle}</div>
        <div style={{ fontSize: 30, marginTop: 16, opacity: 0.6 }}>{copy.seo.ogLine}</div>
      </div>
    ),
    size,
  );
}
