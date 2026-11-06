import { ROUTES } from '@/config/app.config';

// Ítems de la barra principal. El texto sale de copy.nav[key], el ícono de icons/registry.js
export const NAV_ITEMS = [
  { key: 'home', to: ROUTES.home, icon: 'home', end: true },
  { key: 'search', to: ROUTES.search, icon: 'search' },
  { key: 'anime', to: ROUTES.anime, icon: 'anime' },
  { key: 'library', to: ROUTES.library, icon: 'library' },
  { key: 'profile', to: ROUTES.profile, icon: 'profile' },
  { key: 'help', to: ROUTES.help, icon: 'help' },
];
