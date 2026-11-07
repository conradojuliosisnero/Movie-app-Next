// Configuración global de la app. Cambia aquí comportamiento sin tocar componentes.
export const APP = {
  name: 'PeliBox',
  nameParts: ['Peli', 'Box'], // la segunda parte se pinta con el color de acento
  locale: 'es-419',
  region: 'CO', // país para plataformas, estrenos y cartelera (TMDB watch_region)
  storageKey: 'pelibox:v1',
  defaultTheme: 'noche',
  bigTextScale: 1.14,
  toastDurationMs: 2600,
  swipeThresholdPx: 110,
  onboardingDeckSize: 6,
  forYouLimit: 12,
  railLimit: 12,
  continueWatchingLimit: 2,
  upcomingLimit: 3,
  platformsLimit: 12,
  maxProfiles: 5,
  saveDebounceMs: 600,
  features: {
    // “Ver juntos” es una demo con mensajes simulados. Se activa cuando exista la sala real.
    watchParty: false,
  },
};

// Dirección pública del sitio (enlaces canónicos, sitemap, vista previa al compartir).
// En Netlify sale sola de URL; para otro dominio pon NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || 'http://localhost:3000').replace(/\/$/, '');

export const STATUS = {
  WANT: 'want',
  SEEN: 'seen',
  WATCHING: 'watching',
  DISMISSED: 'dismissed',
};

export const ROUTES = {
  login: '/login',
  onboarding: '/bienvenida',
  profiles: '/perfiles',
  home: '/',
  search: '/buscar',
  anime: '/anime',
  library: '/mi-lista',
  profile: '/perfil',
  help: '/ayuda',
  news: '/novedades',
  ranking: '/ranking',
  title: (id) => `/titulo/${id}`,
  person: (id) => `/persona/${id}`,
  season: (seriesId, n) => `/serie/${seriesId}/temporada/${n}`,
};

// Fuente de “Ver completa” (se conserva de la versión anterior).
// Se configura en el .env sin tocar código; {id}, {season} y {episode} se reemplazan.
// sandbox impide que el sitio externo abra ventanas emergentes o te saque de PeliBox.
// Si el reproductor muestra un error de “sandbox”, pon NEXT_PUBLIC_FULL_PLAYER_SANDBOX=off.
const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');
const MOVIE_URL = process.env.NEXT_PUBLIC_FULL_PLAYER_MOVIE || 'https://vidsrc.cc/v2/embed/movie/{id}?autoPlay=false';
const SERIES_URL = process.env.NEXT_PUBLIC_FULL_PLAYER_SERIES || 'https://vidsrc.cc/v2/embed/tv/{id}/{season}/{episode}?autoPlay=false';

export const FULL_PLAYER = {
  sandbox: process.env.NEXT_PUBLIC_FULL_PLAYER_SANDBOX === 'off' ? null : 'allow-scripts allow-same-origin allow-presentation',
  movie: (id) => fill(MOVIE_URL, { id }),
  series: (id, season, episode) => fill(SERIES_URL, { id, season, episode }),
};
