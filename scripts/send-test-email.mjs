// Envía correos de prueba con la plantilla de títulos (película, serie y animé).
// Uso: npm run email:test
// - Sin SMTP en el .env: usa Ethereal (buzón de prueba, no llega a nadie) e imprime el enlace para verlo.
// - Con SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y TEST_EMAIL_TO: lo envía de verdad a ese correo.
// Además guarda cada correo en .emails/ para abrirlo en el navegador.
import dns from 'node:dns';
import { mkdirSync, writeFileSync } from 'node:fs';
import nodemailer from 'nodemailer';
import { titleEmail } from '../src/emails/titleEmail.mjs';

dns.setDefaultResultOrder('ipv4first');
process.loadEnvFile('.env');

const TOKEN = process.env.BEARER_TOKEN;
if (!TOKEN) throw new Error('Falta BEARER_TOKEN en el .env');

const SAMPLES = [
  { kind: 'movie', id: 693134, variant: 'pelibox' }, // Duna: Parte dos
  { kind: 'tv', id: 1399, variant: 'pelibox' }, // Juego de tronos
  { kind: 'tv', id: 1429, variant: 'anime' }, // Ataque a los titanes
];

const img = (path, size) => (path ? `https://image.tmdb.org/t/p/${size}${path}` : null);

async function fetchTitle({ kind, id }) {
  const url = `https://api.themoviedb.org/3/${kind}/${id}?language=es-MX&append_to_response=videos,watch/providers&include_video_language=es,en`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error(`TMDB ${res.status} para ${kind}/${id}`);
  const r = await res.json();
  const videos = (r.videos?.results ?? []).filter((v) => v.site === 'YouTube' && /Trailer|Teaser/.test(v.type));
  const trailer = videos.find((v) => v.iso_639_1 === 'es') ?? videos[0];
  const co = r['watch/providers']?.results?.CO;
  return {
    id: `${kind}-${id}`,
    type: kind === 'tv' ? 'series' : 'movie',
    title: r.title || r.name,
    year: (r.release_date || r.first_air_date || '').slice(0, 4),
    synopsis: r.overview,
    tagline: r.tagline,
    genres: (r.genres ?? []).map((g) => g.name),
    rating: r.vote_average ? Math.round(r.vote_average * 10) / 10 : null,
    backdrop: img(r.backdrop_path, 'w1280'),
    image: img(r.poster_path, 'w342'),
    minutes: r.runtime,
    seasons: r.number_of_seasons,
    trailerKey: trailer?.key,
    providers: [...(co?.flatrate ?? []), ...(co?.free ?? [])].map((p) => ({ name: p.provider_name, logo: img(p.logo_path, 'w92') })),
  };
}

async function transport() {
  const { SMTP_HOST, SMTP_PORT = '587', SMTP_USER, SMTP_PASS, TEST_EMAIL_TO } = process.env;
  if (SMTP_HOST && TEST_EMAIL_TO) {
    return {
      to: TEST_EMAIL_TO,
      real: true,
      mailer: nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: SMTP_PORT === '465', auth: { user: SMTP_USER, pass: SMTP_PASS } }),
    };
  }
  const account = await nodemailer.createTestAccount();
  return {
    to: 'prueba@pelibox.test',
    real: false,
    mailer: nodemailer.createTransport({ host: account.smtp.host, port: account.smtp.port, secure: account.smtp.secure, auth: { user: account.user, pass: account.pass } }),
  };
}

const { mailer, to, real } = await transport();
mkdirSync('.emails', { recursive: true });
console.log(real ? `Enviando de verdad a ${to}…` : 'Sin SMTP en el .env: usando Ethereal (buzón de prueba, no llega a nadie).');

for (const sample of SAMPLES) {
  const t = await fetchTitle(sample);
  const { subject, html, text } = titleEmail(t, { variant: sample.variant, recipientName: 'Julio' });
  const file = `.emails/${sample.variant}-${t.id}.html`;
  writeFileSync(file, html);
  const info = await mailer.sendMail({ from: '"PeliBox" <hola@pelibox.test>', to, subject, html, text });
  const preview = nodemailer.getTestMessageUrl(info);
  console.log(`✓ ${subject}\n  archivo: ${file}${preview ? `\n  ver correo: ${preview}` : ''}`);
}
