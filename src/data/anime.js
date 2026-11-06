// Pantalla de Animé: secciones y filtros. Todo es “discover” de TMDB con animación japonesa.
// El texto de cada sección y filtro vive en i18n (copy.anime).
const sinceDays = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const year = () => new Date().getFullYear();

export const ANIME_BASE = { with_original_language: 'ja', include_adult: false, sort_by: 'popularity.desc' };

/** kind: movie | tv · params: filtros extra de TMDB */
export const ANIME_SECTIONS = [
  { id: 'airing', kind: 'tv', params: () => ({ 'air_date.gte': sinceDays(60) }) },
  // Portada, “Lo más visto” y “Películas”: siempre del año actual.
  { id: 'popular', kind: 'tv', params: () => ({ 'first_air_date.gte': `${year()}-01-01`, 'first_air_date.lte': sinceDays(0) }) },
  { id: 'movies', kind: 'movie', params: () => ({ primary_release_year: year() }) },
  { id: 'classics', kind: 'tv', params: () => ({ 'first_air_date.lte': '2009-12-31', sort_by: 'vote_average.desc', 'vote_count.gte': 300 }) },
];

/** Filtros por “vibra”: género de TMDB que se suma a animación (16) en series y películas. */
export const ANIME_VIBES = [
  { id: 'all', tv: null, movie: null },
  { id: 'action', tv: 10759, movie: 28 },
  { id: 'fantasy', tv: 10765, movie: 14 },
  { id: 'comedy', tv: 35, movie: 35 },
  { id: 'drama', tv: 18, movie: 18 },
  { id: 'mystery', tv: 9648, movie: 9648 },
];
