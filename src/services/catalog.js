// Catálogo: convierte TMDB al formato de la app y arma las listas (sin React).
import { tmdb, imageUrl } from './tmdb';
import { GENRES, genresFromTmdb, genreLabel } from '@/data/genres';
import { MOODS } from '@/data/moods';
import { ANIME_BASE, ANIME_SECTIONS, ANIME_VIBES } from '@/data/anime';
import { FAQ } from '@/data/faq';
import { APP, STATUS } from '@/config/app.config';
import { copy, currentLang } from '@/i18n';

// ---------- Forma de un título ----------
// { id: 'movie-550' | 'tv-1399', tmdbId, type: 'movie' | 'series', title, year, genres, synopsis,
//   image, backdrop, hues, rating, releaseDate, minutes?, seasons?: [{ n, episodes, name }],
//   episodes?, episodeMinutes?, reason? }

// Contenido +18 (marca `adult` de TMDB): solo se pide y se muestra si el perfil lo activó.
let adultOK = false;
export const setAdultContent = (on) => { adultOK = !!on; };

export const isSeries = (t) => t?.type === 'series';
export const tmdbKind = (t) => (isSeries(t) ? 'tv' : 'movie');
export const parseId = (id) => {
  const [kind, num] = String(id).split('-');
  return { kind: kind === 'tv' ? 'tv' : 'movie', tmdbId: Number(num) };
};

// Dos tonos estables por título para el degradado mientras carga la imagen (o si no hay).
const huesFor = (n) => { const h = (n * 47) % 360; return [h, (h + 52) % 360]; };

export function normalize(raw, kindHint) {
  if (!raw || raw.media_type === 'person') return null;
  const kind = raw.media_type === 'tv' || raw.media_type === 'movie' ? raw.media_type : kindHint ?? (raw.first_air_date !== undefined || raw.name && !raw.title ? 'tv' : 'movie');
  const date = raw.release_date || raw.first_air_date || '';
  const seasons = raw.seasons
    ?.filter((s) => s.season_number > 0 && s.episode_count > 0)
    .map((s) => ({ n: s.season_number, episodes: s.episode_count, name: s.name }));
  return {
    id: `${kind}-${raw.id}`,
    tmdbId: raw.id,
    type: kind === 'tv' ? 'series' : 'movie',
    title: raw.title || raw.name || '',
    year: date ? Number(date.slice(0, 4)) : null,
    releaseDate: date || null,
    genres: genresFromTmdb(raw.genre_ids ?? raw.genres?.map((g) => g.id), { originalLanguage: raw.original_language }),
    synopsis: raw.overview || '',
    image: imageUrl(raw.poster_path),
    backdrop: imageUrl(raw.backdrop_path, 'w780'),
    hues: huesFor(raw.id),
    rating: raw.vote_average ? Math.round(raw.vote_average * 10) / 10 : null,
    minutes: raw.runtime || undefined,
    seasons: seasons?.length ? seasons : undefined,
    episodes: seasons?.length ? seasons.reduce((n, s) => n + s.episodes, 0) : undefined,
    episodeMinutes: raw.episode_run_time?.[0] || raw.last_episode_to_air?.runtime || undefined,
    adult: raw.adult || undefined,
  };
}

const parse = (data, kindHint) => (data?.results ?? []).map((r) => normalize(r, kindHint)).filter((t) => t && t.title && (t.image || t.backdrop) && (adultOK || !t.adult));

// Cuando un título no tiene traducción al español, TMDB devuelve el original (japonés, coreano…).
// Esos pocos se piden en inglés; la respuesta queda en caché del servidor 24 h.
const NON_LATIN = /[Ͱ-ϿЀ-ӿ֐-ۿ฀-๿぀-ヿ㐀-鿿가-힯]/;

async function readableTitles(items) {
  await Promise.all(items.map(async (t) => {
    if (!NON_LATIN.test(t.title)) return;
    try {
      const en = await tmdb(`${tmdbKind(t)}/${t.tmdbId}`, { language: 'en-US' });
      t.title = en.title || en.name || t.title;
      if (!t.synopsis) t.synopsis = en.overview || '';
    } catch { /* se queda con el título original */ }
  }));
  return items;
}

const list = (data, kindHint) => readableTitles(parse(data, kindHint));

/** Título y sinopsis en el mejor idioma disponible: idioma activo › inglés › original. */
function bestTranslation(raw, current) {
  const all = raw.translations?.translations ?? [];
  const [lang, region] = currentLang().tmdb.split('-');
  const pick = (field) => {
    const order = [
      all.find((x) => x.iso_639_1 === lang && x.iso_3166_1 === region),
      ...all.filter((x) => x.iso_639_1 === lang),
      all.find((x) => x.iso_639_1 === 'en' && x.iso_3166_1 === 'US'),
      ...all.filter((x) => x.iso_639_1 === 'en'),
    ];
    return order.map((x) => x?.data?.[field]).find((v) => v && v.trim());
  };
  return {
    title: NON_LATIN.test(current.title) ? pick(raw.title !== undefined ? 'title' : 'name') || current.title : current.title,
    synopsis: current.synopsis || pick('overview') || '',
  };
}

/** Versión mínima para guardar en la lista del usuario (Firestore no acepta undefined). */
export const compact = (t) => JSON.parse(JSON.stringify({
  id: t.id, tmdbId: t.tmdbId, type: t.type, title: t.title, year: t.year, releaseDate: t.releaseDate, genres: t.genres,
  image: t.image, backdrop: t.backdrop, hues: t.hues, rating: t.rating, minutes: t.minutes, seasons: t.seasons,
  episodes: t.episodes, episodeMinutes: t.episodeMinutes, adult: t.adult,
}));

// ---------- Ficha completa ----------
// El idioma pesa más que el tipo: un teaser en español gana a un tráiler en inglés.
// Idioma activo primero (en español, el de México); luego inglés.
const LANG_SCORE = (v) => {
  const [lang, region] = currentLang().tmdb.split('-');
  if (v.iso_639_1 === lang) return v.iso_3166_1 === region ? 300 : 200;
  return v.iso_639_1 === 'en' ? 100 : 0;
};
const TYPE_SCORE = { Trailer: 30, Teaser: 20, Clip: 10 };

function pickTrailer(videos) {
  const score = (v) => LANG_SCORE(v) + (TYPE_SCORE[v.type] ?? 0) + (v.official ? 5 : 0);
  return [...videos]
    .filter((v) => TYPE_SCORE[v.type])
    .sort((a, b) => score(b) - score(a) || (b.published_at ?? '').localeCompare(a.published_at ?? ''))[0] ?? videos[0];
}

export async function getTitleDetails(id) {
  const { kind, tmdbId } = parseId(id);
  const raw = await tmdb(`${kind}/${tmdbId}`, {
    append_to_response: 'videos,credits,watch/providers,recommendations,translations',
    include_video_language: `${currentLang().tmdb.slice(0, 2)},en`,
  });
  const t = normalize(raw, kind);
  const videos = raw.videos?.results?.filter((v) => v.site === 'YouTube') ?? [];
  const trailer = pickTrailer(videos);
  const where = raw['watch/providers']?.results?.[APP.region];
  const providers = [...(where?.flatrate ?? []), ...(where?.free ?? []), ...(where?.ads ?? [])];
  return {
    ...t,
    ...bestTranslation(raw, t),
    tagline: raw.tagline || '',
    trailerKey: trailer?.key ?? null,
    cast: (raw.credits?.cast ?? []).slice(0, 12).map((c) => ({ id: c.id, name: c.name, role: c.character, photo: imageUrl(c.profile_path, 'w185') })),
    providers: providers.map((p) => ({ id: p.provider_id, name: p.provider_name, logo: imageUrl(p.logo_path, 'w92') })),
    rentOrBuy: !providers.length && !!(where?.rent?.length || where?.buy?.length),
    watchLink: where?.link ?? null,
    recommendations: await list(raw.recommendations, kind),
  };
}

// ---------- Listas ----------
/** Más recomendaciones de un título (página 2 en adelante; la 1 viene con la ficha). */
export async function getRecommendations(id, page) {
  const { kind, tmdbId } = parseId(id);
  return list(await tmdb(`${kind}/${tmdbId}/recommendations`, { page }), kind);
}

const kidsParams = (kind) => ({ with_genres: kind === 'tv' ? '10751|10762' : '10751', ...(kind === 'movie' ? { certification_country: 'US', 'certification.lte': 'PG' } : {}) });

/** Filtros comunes: perfil infantil y “solo mis plataformas”. */
function baseParams(kind, { profile, settings, myPlatforms } = {}) {
  const p = { include_adult: adultOK, sort_by: 'popularity.desc', 'vote_count.gte': 20 };
  if (profile?.kids) Object.assign(p, kidsParams(kind));
  if (settings?.onlyMine && myPlatforms?.length) Object.assign(p, { with_watch_providers: myPlatforms.join('|'), watch_region: APP.region });
  return p;
}

export const discover = async (kind, params) => list(await tmdb(`discover/${kind}`, params), kind);

/** Mezcla películas y series alternando, sin repetir. */
const interleave = (a, b) => {
  const out = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) { if (a[i]) out.push(a[i]); if (b[i]) out.push(b[i]); }
  return out;
};

const notDecided = (statuses) => (t) => !statuses?.[t.id];

export async function getTrending(ctx, page = 1) {
  if (ctx?.profile?.kids) return interleave(await discover('movie', { ...baseParams('movie', ctx), page }), await discover('tv', { ...baseParams('tv', ctx), page }));
  return list(await tmdb('trending/all/week', { page }));
}

// Filas del inicio por género (“|” = cualquiera). En series, TMDB junta acción y aventura en 10759.
const HOME_GENRES = {
  actionAdventure: { movie: '28|12', tv: '10759' },
  scifi: { movie: '878', tv: '10765' },
};

/** Fila de un género para el inicio: películas y series mezcladas, populares y bien votadas. */
export async function getGenreRail(id, ctx, page = 1) {
  const g = HOME_GENRES[id];
  const params = (kind) => ({ ...baseParams(kind, ctx), with_genres: ctx?.profile?.kids ? `${kidsParams(kind).with_genres},${g[kind]}` : g[kind], 'vote_count.gte': 200, page });
  const [movies, series] = await Promise.all([discover('movie', params('movie')), discover('tv', params('tv'))]);
  return interleave(movies, series);
}

export async function getNowPlaying(page = 1) {
  return list(await tmdb('movie/now_playing', { region: APP.region, page }), 'movie');
}

export async function getUpcoming() {
  const today = new Date().toISOString().slice(0, 10);
  const items = await list(await tmdb('movie/upcoming', { region: APP.region }), 'movie');
  return items.filter((t) => t.releaseDate && t.releaseDate > today).sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
}

/** Títulos de la lista del usuario usados como “semilla” de recomendaciones. */
function seedsFrom(lib) {
  const liked = Object.entries(lib.statuses)
    .filter(([id, s]) => (s === STATUS.SEEN && (lib.ratings[id] ?? 4) >= 4) || s === STATUS.WANT || s === STATUS.WATCHING)
    .map(([id, s]) => ({ item: lib.items[id], status: s }))
    .filter((x) => x.item);
  return liked.slice(-2).reverse();
}

function topGenres(lib, n = 2) {
  const count = {};
  Object.entries(lib.statuses).forEach(([id, s]) => {
    if (s === STATUS.DISMISSED) return;
    (lib.items[id]?.genres ?? []).forEach((g) => { count[g] = (count[g] || 0) + 1; });
  });
  return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, n).map(([g]) => g);
}

/** “Recomendados para ti”, cada uno con su motivo. page: para seguir cargando al llegar al final. */
export async function getForYou(ctx, page = 1) {
  const { profile, lib } = ctx;
  const keep = notDecided(lib.statuses);
  const ctxp = { profile, settings: lib.settings, myPlatforms: lib.myPlatforms };

  if (profile?.kids) {
    const items = interleave(await discover('movie', { ...baseParams('movie', ctxp), page }), await discover('tv', { ...baseParams('tv', ctxp), page }));
    return items.filter(keep).map((t) => ({ ...t, reason: copy.reasons.family }));
  }

  if (lib.settings.onlyMine && lib.myPlatforms.length) {
    const [g] = topGenres(lib, 1);
    const genre = g && GENRES[g];
    const withGenre = (kind) => (genre?.[kind] ? { with_genres: genre[kind], ...(genre.language ? { with_original_language: genre.language } : {}) } : {});
    const [movies, series] = await Promise.all([
      discover('movie', { ...baseParams('movie', ctxp), ...withGenre('movie'), page }),
      genre && !genre.tv ? [] : discover('tv', { ...baseParams('tv', ctxp), ...withGenre('tv'), page }),
    ]);
    const reason = genre ? copy.reasons.genreOnPlatforms(genreLabel(g)) : copy.reasons.onPlatforms;
    return interleave(movies, series).filter(keep).map((t) => ({ ...t, reason }));
  }

  const seeds = seedsFrom(lib);
  if (seeds.length) {
    const lists = await Promise.all(seeds.map(({ item, status }) =>
      tmdb(`${tmdbKind(item)}/${item.tmdbId}/recommendations`, { page }).then((d) => list(d, tmdbKind(item))).then((items) => items.map((t) => ({ ...t, reason: copy.reasons.because(item.title, status) })))
    ));
    const seen = new Set();
    const merged = (lists.length > 1 ? interleave(lists[0], lists[1]) : lists[0]).filter((t) => keep(t) && !seen.has(t.id) && seen.add(t.id));
    if (merged.length >= 4) return merged;
  }

  return (await getTrending(ctx, page)).filter(keep).map((t) => ({ ...t, reason: copy.reasons.trending }));
}

/** “Sugerirme algo”: un título al azar que no hayas decidido, según el ánimo. */
export async function pickSuggestion({ moodId, excludeId, profile, lib }) {
  const mood = MOODS.find((m) => m.id === moodId);
  const kinds = ['movie', 'tv'].filter((k) => !mood || mood.discover[k]);
  const ctxp = { profile, settings: lib.settings, myPlatforms: lib.myPlatforms };
  const ok = (t) => !lib.statuses[t.id] && t.id !== excludeId;

  for (const page of [1 + Math.floor(Math.random() * 3), 1]) {
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const params = { ...baseParams(kind, ctxp), ...(mood?.discover[kind] ?? {}), page };
    if (profile?.kids) params.with_genres = kidsParams(kind).with_genres; // el perfil infantil manda sobre el ánimo
    const pool = (await discover(kind, params)).filter(ok);
    if (pool.length) return { ...pool[Math.floor(Math.random() * pool.length)], reason: mood ? copy.reasons.mood(copy.moods[mood.id]) : copy.reasons.random };
  }
  return null;
}

// ---------- Animé ----------
/** Una sección de la pantalla de Animé, filtrada por vibra y por perfil infantil. */
export async function getAnime(sectionId, { vibe = 'all', profile } = {}, page = 1) {
  const section = ANIME_SECTIONS.find((x) => x.id === sectionId);
  const extra = ANIME_VIBES.find((v) => v.id === vibe)?.[section.kind];
  const kids = profile?.kids ? (section.kind === 'tv' ? 10762 : 10751) : null;
  const genres = [16, extra, kids].filter(Boolean).join(','); // coma = debe tener todos
  return discover(section.kind, { ...ANIME_BASE, include_adult: adultOK, ...section.params(), with_genres: genres, page });
}

// ---------- Búsqueda ----------
/** Convierte texto libre (“series cortas de miedo”) en filtros editables. */
export function parseQuery(query, platforms = []) {
  const s = query.toLowerCase();
  const filters = [];
  if (/serie|\bshows?\b/.test(s)) filters.push({ key: 'type', value: 'tv', label: copy.search.filters.series });
  else if (/pel[ií]cula|peli|movie|film/.test(s)) filters.push({ key: 'type', value: 'movie', label: copy.search.filters.movies });
  Object.entries(GENRES).forEach(([id, g]) => { if (g.pattern.test(s)) filters.push({ key: 'genre', value: id, label: genreLabel(id) }); });
  if (/cort|r[aá]pid|short|quick/.test(s)) filters.push({ key: 'short', label: copy.search.filters.short });
  platforms.forEach((p) => { if (s.includes(p.name.toLowerCase())) filters.push({ key: 'platform', value: p.id, label: copy.search.filters.onPlatform(p.name) }); });
  return filters;
}

// Rangos de año del filtro de búsqueda. id → { from, to } (años incluidos).
export function yearRanges(now = new Date().getFullYear()) {
  return [
    { id: String(now), from: now, to: now },
    { id: String(now - 1), from: now - 1, to: now - 1 },
    { id: '2020s', from: 2020, to: 2029 },
    { id: '2010s', from: 2010, to: 2019 },
    { id: '2000s', from: 2000, to: 2009 },
    { id: '1990s', from: 1990, to: 1999 },
    { id: 'older', from: 1900, to: 1989 },
  ];
}

const SORTS = {
  popular: () => ({ sort_by: 'popularity.desc' }),
  rating: () => ({ sort_by: 'vote_average.desc', 'vote_count.gte': 300 }),
  recent: (kind) => ({ sort_by: kind === 'tv' ? 'first_air_date.desc' : 'primary_release_date.desc', 'vote_count.gte': 10 }),
};
const IN_THEATERS_DAYS = 45;

/**
 * Búsqueda y exploración. f = { query, type: all|movie|tv, genre, year, inTheaters, short, topRated, sort,
 * removedLabels, platforms, profile }. El texto se interpreta (“series cortas de comedia” → filtros) y se suma
 * a los filtros elegidos; si el texto no trae filtros, se busca por título.
 */
export async function exploreTitles(f, page = 1) {
  const q = (f.query ?? '').trim();
  const parsed = q ? parseQuery(q, f.platforms ?? []).filter((x) => !(f.removedLabels ?? []).includes(x.label)) : [];
  const type = f.type && f.type !== 'all' ? f.type : parsed.find((x) => x.key === 'type')?.value;
  const genreIds = [...new Set([f.genre, ...parsed.filter((x) => x.key === 'genre').map((x) => x.value)].filter(Boolean))];
  const genres = genreIds.map((id) => GENRES[id]);
  const short = f.short || parsed.some((x) => x.key === 'short');
  const platform = parsed.find((x) => x.key === 'platform')?.value;
  const range = yearRanges().find((r) => r.id === f.year);
  const today = new Date().toISOString().slice(0, 10);
  const theatersFrom = new Date(Date.now() - IN_THEATERS_DAYS * 864e5).toISOString().slice(0, 10);

  // Solo texto (sin filtros dentro): búsqueda por título y los filtros elegidos se aplican sobre los resultados.
  if (q && !parsed.length) {
    const path = type ? `search/${type}` : 'search/multi';
    let results = await list(await tmdb(path, { query: q, include_adult: adultOK, page }), type);
    results = results.filter((t) =>
      (!genres.length || genreIds.every((g) => t.genres.includes(g)))
      && (!range || (t.year >= range.from && t.year <= range.to))
      && (!f.inTheaters || (t.type === 'movie' && t.releaseDate >= theatersFrom && t.releaseDate <= today))
      && (!f.topRated || (t.rating ?? 0) >= 7.5)
      && (!f.profile?.kids || t.genres.some((g) => g === 'family' || g === 'animation')));
    return results;
  }

  const kinds = (f.inTheaters ? ['movie'] : type ? [type] : ['movie', 'tv']).filter((k) => genres.every((g) => g[k]));
  const lists = await Promise.all(kinds.map((kind) => {
    const p = { ...baseParams(kind, { profile: f.profile }), ...(SORTS[f.sort] ?? SORTS.popular)(kind), page };
    if (genres.length) p.with_genres = genres.map((g) => g[kind]).join(',');
    const lang = genres.find((g) => g.language)?.language;
    if (lang) p.with_original_language = lang;
    if (short) p['with_runtime.lte'] = kind === 'tv' ? 30 : 100;
    if (platform) Object.assign(p, { with_watch_providers: platform, watch_region: APP.region });
    const dateKey = kind === 'tv' ? 'first_air_date' : 'primary_release_date';
    if (range) Object.assign(p, { [`${dateKey}.gte`]: `${range.from}-01-01`, [`${dateKey}.lte`]: `${range.to}-12-31` });
    if (f.sort === 'recent') p[`${dateKey}.lte`] = p[`${dateKey}.lte`] && p[`${dateKey}.lte`] < today ? p[`${dateKey}.lte`] : today;
    if (f.topRated) Object.assign(p, { 'vote_average.gte': 7.5, 'vote_count.gte': Math.max(300, p['vote_count.gte'] ?? 0) });
    if (f.inTheaters) Object.assign(p, { 'release_date.gte': theatersFrom, 'release_date.lte': today, with_release_type: '2|3', region: APP.region });
    return discover(kind, p);
  }));
  return lists.length > 1 ? interleave(lists[0], lists[1]) : lists[0] ?? [];
}

// ---------- Plataformas ----------
export async function getPlatforms() {
  const data = await tmdb('watch/providers/movie', { watch_region: APP.region });
  return (data.results ?? [])
    .sort((a, b) => (a.display_priorities?.[APP.region] ?? 99) - (b.display_priorities?.[APP.region] ?? 99))
    .slice(0, APP.platformsLimit)
    .map((p) => ({ id: p.provider_id, name: p.provider_name, logo: imageUrl(p.logo_path, 'w92') }));
}

// ---------- Personas y temporadas ----------
export async function getPerson(id) {
  const [p, credits] = await Promise.all([tmdb(`person/${id}`), tmdb(`person/${id}/combined_credits`)]);
  const seen = new Set();
  const knownFor = (credits.cast ?? [])
    .concat(credits.crew ?? [])
    .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
    .map((r) => normalize(r))
    .filter((t) => t && t.image && !seen.has(t.id) && seen.add(t.id))
    .slice(0, 20);
  await readableTitles(knownFor);
  return {
    id: p.id,
    name: p.name,
    photo: imageUrl(p.profile_path, 'h632'),
    bio: p.biography || '',
    birthday: p.birthday,
    deathday: p.deathday,
    place: p.place_of_birth,
    department: p.known_for_department,
    knownFor,
  };
}

export async function getSeason(seriesId, n) {
  const s = await tmdb(`tv/${seriesId}/season/${n}`);
  return {
    n: s.season_number,
    name: s.name,
    overview: s.overview || '',
    airDate: s.air_date,
    image: imageUrl(s.poster_path),
    episodes: (s.episodes ?? []).map((e) => ({
      n: e.episode_number,
      name: e.name,
      overview: e.overview || '',
      airDate: e.air_date,
      minutes: e.runtime,
      rating: e.vote_average ? Math.round(e.vote_average * 10) / 10 : null,
      still: imageUrl(e.still_path, 'w300'),
    })),
  };
}

// ---------- Progreso de series ----------
// progress[id] = { season, ep }: temporada actual y episodios vistos dentro de ella.
export const watchedIn = (progress, seasonN) => {
  if (!progress) return 0;
  return seasonN < progress.season ? Infinity : seasonN === progress.season ? progress.ep : 0;
};

export function episodesWatched(t, progress) {
  if (!progress || !t.seasons) return 0;
  return t.seasons.reduce((n, s) => n + Math.min(s.episodes, watchedIn(progress, s.n)), 0);
}

export function nextEpisode(t, progress) {
  const seasons = t.seasons ?? [];
  const current = seasons.find((s) => s.n === (progress?.season ?? seasons[0]?.n));
  if (!current) return null;
  if ((progress?.ep ?? 0) < current.episodes) return { season: current.n, ep: (progress?.ep ?? 0) + 1, total: current.episodes };
  const following = seasons.find((s) => s.n > current.n);
  return following ? { season: following.n, ep: 1, total: following.episodes } : null;
}

// ---------- Estadísticas ----------
const DEFAULT_MOVIE_MIN = 110;
const DEFAULT_EPISODE_MIN = 45;

function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  return y * 100 + Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7);
}

export function computeStats({ items, statuses, progress, ratings, seenAt }) {
  let minutes = 0;
  const genreCount = {};
  const year = String(new Date().getFullYear());
  Object.entries(statuses).forEach(([id, s]) => {
    const t = items[id];
    if (!t || (s !== STATUS.SEEN && s !== STATUS.WATCHING)) return;
    if (s === STATUS.SEEN && seenAt[id] && !seenAt[id].startsWith(year)) return;
    const epMin = t.episodeMinutes || DEFAULT_EPISODE_MIN;
    if (s === STATUS.SEEN) minutes += isSeries(t) ? (t.episodes || 10) * epMin : t.minutes || DEFAULT_MOVIE_MIN;
    else minutes += episodesWatched(t, progress[id]) * epMin;
    t.genres?.forEach((g) => { genreCount[g] = (genreCount[g] || 0) + 1; });
  });

  const seenThisYear = Object.entries(statuses).filter(([id, s]) => s === STATUS.SEEN && items[id] && (seenAt[id] ?? year).startsWith(year)).map(([id]) => items[id]);

  // Racha: semanas seguidas (hasta esta o la anterior) con al menos un título visto.
  const weeks = new Set(Object.values(seenAt).map((d) => isoWeek(new Date(`${d}T12:00:00`))));
  let streak = 0;
  const cursor = new Date();
  if (!weeks.has(isoWeek(cursor))) cursor.setDate(cursor.getDate() - 7);
  while (weeks.has(isoWeek(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 7); }

  const hours = Math.round(minutes / 60);
  return {
    hours,
    days: Math.round((hours / 24) * 10) / 10,
    titles: seenThisYear.length,
    streakWeeks: streak,
    topGenres: Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 4),
    favorite: [...seenThisYear].sort((a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0))[0] ?? null,
  };
}

// ---------- Ayuda ----------
export const visibleFaq = () => FAQ.filter((f) => !f.feature || APP.features[f.feature]);

export function answerQuestion(question) {
  const s = question.toLowerCase();
  let best = null;
  let score = 0;
  visibleFaq().forEach((f) => {
    const n = f.keywords.filter((k) => s.includes(k)).length;
    if (n > score) { score = n; best = f; }
  });
  return best ? copy.faq[best.id] : { q: question, a: copy.help.notFound };
}
