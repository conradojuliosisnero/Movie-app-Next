// Qué puede rastrear Google: lo público sí; las pantallas privadas de la app y la API, no.
import { SITE_URL } from '@/config/app.config';

export default function robots() {
  return {
    rules: [{
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/buscar', '/mi-lista', '/perfil', '/perfiles', '/bienvenida', '/novedades', '/ayuda', '/anime', '/ranking', '/tienda', '/serie/'],
    }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
