// Comprueba que todos los idiomas tengan las mismas claves que el español.
// Uso: npm run check:i18n
import { readFileSync } from 'node:fs';

// Los diccionarios no importan nada, así que se pueden cargar como módulos sueltos.
const load = async (file) => {
  const src = readFileSync(new URL(`../src/i18n/${file}`, import.meta.url), 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(src).toString('base64')}`);
};

const keys = (obj, prefix = '') => Object.entries(obj).flatMap(([k, v]) =>
  v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]);

const { es } = await load('es.js');
const { en } = await load('en.js');
const base = new Set(keys(es));
const other = new Set(keys(en));
const missing = [...base].filter((k) => !other.has(k));
const extra = [...other].filter((k) => !base.has(k));

if (missing.length || extra.length) {
  if (missing.length) console.error('Faltan en en.js:', missing);
  if (extra.length) console.error('Sobran en en.js (no están en es.js):', extra);
  process.exit(1);
}
console.log(`i18n OK: ${base.size} claves en español e inglés.`);
