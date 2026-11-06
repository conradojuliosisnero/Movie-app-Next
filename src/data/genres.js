import { copy } from '@/i18n';

// Géneros de la app y su equivalente en TMDB (los ids cambian entre películas y series).
// pattern: palabras que activan el filtro en la búsqueda en lenguaje natural.
export const GENRES = {
  action: { label: 'Acción', movie: 28, tv: 10759, pattern: /acci[oó]n|aventura|pelea|action|adventure|fight/ },
  comedy: { label: 'Comedia', movie: 35, tv: 35, pattern: /risa|re[ií]r|comedia|divertid|comedy|funny|laugh/ },
  drama: { label: 'Drama', movie: 18, tv: 18, pattern: /drama|llorar|novela|\bcry/ },
  romance: { label: 'Romance', movie: 10749, tv: null, pattern: /rom[aá]n|amor|love/ },
  horror: { label: 'Terror', movie: 27, tv: null, pattern: /miedo|terror|susto|asust|horror|scar/ },
  mystery: { label: 'Misterio', movie: 9648, tv: 9648, pattern: /misterio|suspenso|thriller|mystery|suspense/ },
  crime: { label: 'Crimen', movie: 80, tv: 80, pattern: /crimen|polic|mafia|narco|crime|cop/ },
  scifi: { label: 'Ciencia ficción', movie: 878, tv: 10765, pattern: /ciencia|sci-?fi|espacio|fantas|science|space/ },
  anime: { label: 'Animé', movie: 16, tv: 16, language: 'ja', pattern: /anim[eé]/ },
  animation: { label: 'Animación', movie: 16, tv: 16, pattern: /animaci[oó]n|animad|caricatura|animation|cartoon/ },
  family: { label: 'Familiar', movie: 10751, tv: 10762, pattern: /famil|niñ|peques|infantil|kids?\b|children/ },
  documentary: { label: 'Documental', movie: 99, tv: 99, pattern: /document/ },
};

export const genreLabel = (id) => copy.genres?.[id] ?? GENRES[id]?.label ?? id;

// Ids de TMDB que no tienen género propio en la app y se agrupan con otro.
const ALIASES = { 53: 'mystery', 12: 'action', 14: 'scifi', 10752: 'action', 10768: 'action', 10751: 'family' };

/** Convierte los ids de género de TMDB a las claves de la app. */
export function genresFromTmdb(ids = [], { originalLanguage } = {}) {
  const out = new Set();
  ids.forEach((id) => {
    if (id === 16) out.add(originalLanguage === 'ja' ? 'anime' : 'animation');
    else {
      const key = Object.keys(GENRES).find((k) => k !== 'anime' && k !== 'animation' && (GENRES[k].movie === id || GENRES[k].tv === id)) ?? ALIASES[id];
      if (key) out.add(key);
    }
  });
  return [...out];
}
