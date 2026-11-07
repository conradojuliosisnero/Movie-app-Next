// TMDB desde el servidor (el token nunca sale de aquí). Lo usan el proxy /api/tmdb
// y las páginas públicas que llegan armadas para Google (fichas, personas, portada, sitemap).
import dns from 'node:dns';
import { normalize } from './catalog';
import { imageUrl } from './tmdb';

// Algunas redes fallan por IPv6 hacia TMDB (timeouts intermitentes): se prefiere IPv4.
dns.setDefaultResultOrder('ipv4first');

const TIMEOUT_MS = 8000;
const DAY = 60 * 60 * 24;

/** Llamada cruda a TMDB (con un reintento si la red falla). Devuelve la Response. */
export function tmdbFetch(path, query, ttl) {
  const call = () => fetch(`https://api.themoviedb.org/3/${path}?${query}`, {
    headers: { accept: 'application/json', Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
    next: { revalidate: ttl },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  return call().catch(call);
}

/** JSON de TMDB; null si no existe (404). Si TMDB no responde, lanza error. */
async function get(path, params = {}, ttl = DAY) {
  const res = await tmdbFetch(path, new URLSearchParams({ language: 'es-MX', ...params }), ttl);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

// ---------- Enlaces amigables: /titulo/movie-550-el-club-de-la-pelea ----------
export const slugify = (text = '') => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
export const titlePath = (t) => `/titulo/${t.id}${slugify(t.title) ? `-${slugify(t.title)}` : ''}`;
export const personPath = (p) => `/persona/${p.id}${slugify(p.name) ? `-${slugify(p.name)}` : ''}`;

const NON_LATIN = /[぀-ヿ㐀-鿿가-힯Ѐ-ӿ]/;
const usable = (t) => t && t.title && t.image && !t.adult && !NON_LATIN.test(t.title);
const listOf = (data, kind) => (data?.results ?? []).map((r) => normalize(r, kind)).filter(usable);

/** Ficha pública de una película o serie. */
export async function getPublicTitle(id) {
  const [kind, num] = id.split('-');
  const append = kind === 'tv' ? 'aggregate_credits,recommendations,videos' : 'credits,recommendations,videos';
  const raw = await get(`${kind}/${num}`, { append_to_response: append });
  if (!raw) return null;
  const t = normalize(raw, kind);
  // Sin traducción al español: título en inglés (mejor que caracteres que casi nadie busca).
  if (NON_LATIN.test(t.title) || !t.synopsis) {
    const en = await get(`${kind}/${num}`, { language: 'en-US' }).catch(() => null);
    if (en && NON_LATIN.test(t.title)) t.title = en.title || en.name || t.title;
    if (en && !t.synopsis) t.synopsis = en.overview || '';
  }
  const credits = kind === 'tv' ? raw.aggregate_credits : raw.credits;
  const makers = kind === 'tv' ? raw.created_by ?? [] : (raw.credits?.crew ?? []).filter((c) => c.job === 'Director');
  return {
    ...t,
    originalTitle: raw.original_title || raw.original_name,
    tagline: raw.tagline || '',
    voteCount: raw.vote_count ?? 0,
    genreNames: (raw.genres ?? []).map((g) => g.name),
    backdropLarge: imageUrl(raw.backdrop_path, 'w1280'),
    makers: makers.slice(0, 3).map((m) => ({ id: m.id, name: m.name })),
    cast: (credits?.cast ?? []).slice(0, 12).map((c) => ({
      id: c.id, name: c.name, role: c.character || c.roles?.[0]?.character || '', photo: imageUrl(c.profile_path, 'w185'),
    })),
    similar: listOf(raw.recommendations, kind).slice(0, 12),
    seasonCount: raw.number_of_seasons,
  };
}

/** Ficha pública de una persona. */
export async function getPublicPerson(id) {
  const raw = await get(`person/${id}`, { append_to_response: 'combined_credits' });
  if (!raw) return null;
  let bio = raw.biography;
  if (!bio) bio = (await get(`person/${id}`, { language: 'en-US' }).catch(() => null))?.biography ?? '';
  const seen = new Set();
  const knownFor = [...(raw.combined_credits?.cast ?? []), ...(raw.combined_credits?.crew ?? [])]
    .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
    .map((r) => normalize(r))
    .filter((t) => usable(t) && !seen.has(t.id) && seen.add(t.id))
    .slice(0, 18);
  return {
    id: raw.id, name: raw.name, bio, photo: imageUrl(raw.profile_path, 'w342'), knownForDept: raw.known_for_department,
    birthday: raw.birthday, place: raw.place_of_birth, adult: raw.adult, knownFor,
  };
}

/** Listas de la portada pública. */
export async function getLanding() {
  const pick = async (path, params, kind) => listOf(await get(path, params, 60 * 60).catch(() => null), kind).slice(0, 12);
  const [trending, movies, series, anime] = await Promise.all([
    pick('trending/all/week'),
    pick('movie/popular', {}, 'movie'),
    pick('tv/popular', {}, 'tv'),
    pick('discover/tv', { with_original_language: 'ja', with_genres: '16', sort_by: 'popularity.desc', include_adult: 'false' }, 'tv'),
  ]);
  return { trending, movies, series, anime };
}

/** Enlaces para el sitemap: títulos y personas populares. */
export async function getSitemapEntries() {
  const pages = (path, n, params = {}) => Array.from({ length: n }, (_, i) => get(path, { ...params, page: i + 1 }, DAY).catch(() => null));
  const titleCalls = [
    ...pages('movie/popular', 5).map((p) => p.then((d) => listOf(d, 'movie'))),
    ...pages('movie/top_rated', 3).map((p) => p.then((d) => listOf(d, 'movie'))),
    ...pages('tv/popular', 5).map((p) => p.then((d) => listOf(d, 'tv'))),
    ...pages('tv/top_rated', 3).map((p) => p.then((d) => listOf(d, 'tv'))),
    ...pages('trending/all/week', 3).map((p) => p.then((d) => listOf(d))),
    ...pages('discover/tv', 3, { with_original_language: 'ja', with_genres: '16', sort_by: 'popularity.desc' }).map((p) => p.then((d) => listOf(d, 'tv'))),
  ];
  const people = (await Promise.all(pages('person/popular', 2))).flatMap((d) => (d?.results ?? []).filter((p) => !p.adult && p.profile_path));
  const titles = (await Promise.all(titleCalls)).flat();
  const unique = [...new Map(titles.map((t) => [t.id, t])).values()];
  return { titles: unique, people: people.map((p) => ({ id: p.id, name: p.name })) };
}
