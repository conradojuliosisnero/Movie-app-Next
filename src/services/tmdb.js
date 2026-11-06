// Cliente de TMDB para el navegador. Pasa por /api/tmdb (el token se queda en el servidor)
// y guarda en memoria las respuestas para no repetir la misma petición en la sesión.
import { currentLang } from '@/i18n';

const cache = new Map();
const MAX_ENTRIES = 300;

export async function tmdb(path, params = {}) {
  const query = new URLSearchParams({ language: currentLang().tmdb });
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') query.set(k, String(v)); });
  const url = `/api/tmdb/${path}${query.size ? `?${query}` : ''}`;

  if (cache.has(url)) return cache.get(url);
  const request = fetch(url).then(async (res) => {
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `TMDB respondió ${res.status}`);
    return body;
  });
  cache.set(url, request);
  request.catch(() => cache.delete(url)); // si falla, el siguiente intento vuelve a pedirlo
  if (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value);
  return request;
}

export const imageUrl = (path, size = 'w342') => (path ? `https://image.tmdb.org/t/p/${size}${path}` : null);
