// Único punto de contacto con TMDB. El token nunca sale del servidor.
// Solo deja pasar rutas de lectura conocidas, para no ser un proxy abierto.
import { NextResponse } from 'next/server';

const ALLOWED = [
  /^trending\/(all|movie|tv)\/(day|week)$/,
  /^discover\/(movie|tv)$/,
  /^search\/(multi|movie|tv)$/,
  /^movie\/(popular|now_playing|upcoming|top_rated)$/,
  /^(movie|tv)\/\d+$/,
  /^(movie|tv)\/\d+\/(videos|recommendations|similar|credits|aggregate_credits|watch\/providers|release_dates|content_ratings)$/,
  /^tv\/\d+\/season\/\d+$/,
  /^person\/\d+$/,
  /^person\/\d+\/combined_credits$/,
  /^watch\/providers\/(movie|tv)$/,
  /^genre\/(movie|tv)\/list$/,
];

const LIST_TTL = 60 * 60; // 1 h: listas y búsquedas
const DETAIL_TTL = 60 * 60 * 24; // 24 h: fichas, personas, géneros, plataformas
const TIMEOUT_MS = 8000;

export async function GET(request, { params }) {
  const path = (await params).path.join('/');
  if (!ALLOWED.some((re) => re.test(path))) {
    return NextResponse.json({ error: 'Ruta no permitida' }, { status: 404 });
  }

  const incoming = new URL(request.url).searchParams;
  const query = new URLSearchParams(incoming);
  if (!query.has('language')) query.set('language', 'es-MX');

  const ttl = /^(search|discover|trending|movie\/(popular|now_playing|upcoming|top_rated))/.test(path) ? LIST_TTL : DETAIL_TTL;

  const call = () => fetch(`https://api.themoviedb.org/3/${path}?${query}`, {
    headers: { accept: 'application/json', Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
    next: { revalidate: ttl },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  // Si la red falla (no hay respuesta de TMDB), se intenta una vez más antes de rendirse.
  let res;
  try {
    res = await call().catch(call);
  } catch (error) {
    console.error(`TMDB sin conexión (${path}):`, error.cause?.code ?? error.name);
    return NextResponse.json({ error: 'No pudimos conectar con TMDB. Inténtalo de nuevo.' }, { status: 502 });
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: body.status_message || 'Error de TMDB' }, { status: res.status });
  }
  return NextResponse.json(body, {
    headers: { 'Cache-Control': `public, s-maxage=${ttl}, stale-while-revalidate=${ttl}` },
  });
}
