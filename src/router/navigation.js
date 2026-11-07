import { ROUTES } from '@/config/app.config';

// Ítems de la barra principal, por prioridad de uso. El texto sale de copy.nav[key], el ícono de icons/registry.js.
// Perfil, ajustes, novedades y ayuda viven en el menú del avatar.
export const NAV_ITEMS = [
  { key: 'home', to: ROUTES.home, icon: 'home', end: true },
  { key: 'search', to: ROUTES.search, icon: 'search' },
  { key: 'library', to: ROUTES.library, icon: 'library' },
  { key: 'anime', to: ROUTES.anime, icon: 'anime' },
  // En celular no va en las pestañas: se entra tocando la racha de la cabecera.
  { key: 'ranking', to: ROUTES.ranking, icon: 'ranking', desktopOnly: true },
  // En celular se entra desde el ranking (botón del boleto de puntos).
  { key: 'store', to: ROUTES.store, icon: 'store', desktopOnly: true },
];
