import { copy, currentLang } from '@/i18n';
import { genreLabel } from '@/data/genres';

export const formatRuntime = (min) => `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}`;

export function titleMeta(t) {
  const parts = [t.type === 'series' ? copy.common.series : copy.common.movie];
  if (t.type === 'series' && t.seasons?.length) parts.push(copy.common.seasons(t.seasons.length));
  if (t.type === 'movie' && t.minutes) parts.push(formatRuntime(t.minutes));
  if (t.year) parts.push(t.year);
  return parts.join(' · ');
}

export const titleGenres = (t) => (t.genres ?? []).map(genreLabel).join(' · ');

/** Línea corta bajo un póster: género principal y año. */
export const titleCaption = (t) => [t.genres?.[0] && genreLabel(t.genres[0]), t.year].filter(Boolean).join(' · ');

const locale = () => currentLang().locale;
export const dayMonth = (iso) => {
  const d = new Date(iso + 'T12:00:00');
  return {
    day: new Intl.DateTimeFormat(locale(), { day: '2-digit' }).format(d),
    month: new Intl.DateTimeFormat(locale(), { month: 'short' }).format(d).replace('.', '').toUpperCase(),
  };
};

export const longDate = (iso) =>
  iso ? new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso + 'T12:00:00')) : '';

export const releaseLabel = (iso) =>
  new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso + 'T12:00:00')).toUpperCase();

export const todayLabel = () =>
  new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date()).replace('.', '').toUpperCase();

/** Fecha local (no UTC): a las 9 p. m. en Colombia sigue siendo “hoy”. */
export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
