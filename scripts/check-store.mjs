// Prueba rápida de las reglas de precio de la tienda. Uso: node scripts/check-store.mjs
import assert from 'node:assert/strict';
import { claimStatus, multiplier, priceFor } from '../src/screens/Store/economy.js';

assert.equal(multiplier(0), 1);
assert.equal(multiplier(3), 1.3); // +10 % por pieza
assert.equal(priceFor(1400, 1.3), 1820); // redondea a decenas
assert.equal(priceFor(700, 1.1), 770);

const item = { id: 'vhs', base: 700 };
const ok = { owned: {}, stock: { vhs: 5 }, balance: 1000, mult: 1 };
assert.equal(claimStatus(item, ok).ok, true);
assert.equal(claimStatus(item, { ...ok, guest: true }).reason, 'guest');
assert.equal(claimStatus(item, { ...ok, guest: true, owned: { vhs: true } }).reason, 'owned'); // el sello se ve igual
assert.equal(claimStatus(item, { ...ok, owned: { vhs: true } }).reason, 'owned');
assert.equal(claimStatus(item, { ...ok, stock: { vhs: 0 } }).reason, 'soldout');
assert.equal(claimStatus(item, { ...ok, balance: 700 }).ok, true); // sin límite semanal: solo cuenta el saldo
assert.equal(claimStatus(item, { ...ok, balance: 699 }).reason, 'funds');
assert.equal(claimStatus(item, { ...ok, owned: { vhs: true }, stock: { vhs: 0 } }).reason, 'owned'); // lo tuyo no sale “agotado”
console.log('Tienda OK: precios y reglas de canje.');

// Equipables
const { toggleEquip, lookOf, EMPTY_LOOK } = await import('../src/screens/Store/cosmetics.js');
let eq = toggleEquip(EMPTY_LOOK, 'butaca');
assert.equal(eq.frame, 'butaca');
assert.equal(toggleEquip(eq, 'neon').frame, 'neon'); // cambia de marco
assert.equal(toggleEquip(eq, 'butaca').frame, null); // quitar
for (const id of ['maraton', 'primera', 'claqueta']) eq = toggleEquip(eq, id);
assert.deepEqual(toggleEquip(eq, 'rollo').badges, ['maraton', 'primera', 'claqueta']); // máximo 3
assert.deepEqual(toggleEquip(eq, 'primera').badges, ['maraton', 'claqueta']);
// Solo se publica lo que se tiene.
assert.deepEqual(lookOf({ owned: { butaca: {}, maraton: {} }, equipped: eq }), { frame: 'butaca', title: null, background: null, effect: null, badges: ['maraton'] });
console.log('Equipables OK.');
