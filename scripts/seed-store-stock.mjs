// Crea el stock inicial de la tienda en Firestore (storeStock/{id} = { left: total }).
// Solo crea lo que no existe: nunca repone ni pisa ventas. Uso: node scripts/seed-store-stock.mjs
// shortcut: usa la API pública con la llave web; funciona mientras las reglas permitan crear. Con
// firestore.rules publicadas (nadie crea stock desde el app), siembra desde la consola de Firebase o con firebase-admin.
import { readFileSync } from 'node:fs';
import { CATALOG } from '../src/screens/Store/catalog.js';

const env = Object.fromEntries(readFileSync(new URL('../.env', import.meta.url), 'utf8')
  .split(/\r?\n/).map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)).filter(Boolean)
  .map(([, k, v]) => [k, v.replace(/^["']|["']$/g, '')]));
const project = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const key = env.NEXT_PUBLIC_FIREBASE_API_KEY;
const SOLD_OUT = new Set(['critico']); // su descripción dice que está agotada

for (const item of CATALOG.filter((it) => it.base)) {
  const left = SOLD_OUT.has(item.id) ? 0 : item.total;
  const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/storeStock/${item.id}?currentDocument.exists=false&key=${key}`;
  const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { left: { integerValue: String(left) } } }) });
  const body = await res.json().catch(() => ({}));
  const status = res.ok ? `creado (${left})` : body.error?.status === 'FAILED_PRECONDITION' ? 'ya existía, no se toca' : `error ${res.status} ${body.error?.status ?? ''}`;
  console.log(item.id.padEnd(10), status);
}
