// Punto único de textos. `copy` es un solo objeto que todos importan; al cambiar de idioma
// se rellena con el diccionario nuevo y LanguageProvider vuelve a dibujar las pantallas.
import { es } from './es';
import { en } from './en';

export const LANGUAGES = {
  es: { dict: es, label: 'Español', locale: 'es-419', tmdb: 'es-MX', html: 'es' },
  en: { dict: en, label: 'English', locale: 'en-US', tmdb: 'en-US', html: 'en' },
};
export const DEFAULT_LANG = 'es';

let current = DEFAULT_LANG;
export const copy = { ...es };

export const currentLang = () => LANGUAGES[current];
export const currentLangCode = () => current;

export function setLanguage(code) {
  if (!LANGUAGES[code] || code === current) return;
  current = code;
  Object.keys(copy).forEach((k) => delete copy[k]);
  Object.assign(copy, LANGUAGES[code].dict);
}
