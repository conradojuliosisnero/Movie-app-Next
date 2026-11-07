// Prueba rápida de las reglas de precio de la tienda. Uso: node scripts/check-store.mjs
import assert from 'node:assert/strict';
import { claimStatus, multiplier, priceFor } from '../src/screens/Store/economy.js';

assert.equal(multiplier(0), 1);
assert.equal(multiplier(3), 1.3); // +10 % por pieza
assert.equal(priceFor(1400, 1.3), 1820); // redondea a decenas
assert.equal(priceFor(700, 1.1), 770);

const item = { id: 'vhs', base: 700 };
const ok = { owned: {}, stock: { vhs: 5 }, claims: 0, balance: 1000, mult: 1, weeklyLimit: 3 };
assert.equal(claimStatus(item, ok).ok, true);
assert.equal(claimStatus(item, { ...ok, guest: true }).reason, 'guest');
assert.equal(claimStatus(item, { ...ok, guest: true, owned: { vhs: true } }).reason, 'owned'); // el sello se ve igual
assert.equal(claimStatus(item, { ...ok, owned: { vhs: true } }).reason, 'owned');
assert.equal(claimStatus(item, { ...ok, stock: { vhs: 0 } }).reason, 'soldout');
assert.equal(claimStatus(item, { ...ok, claims: 3 }).reason, 'limit');
assert.equal(claimStatus(item, { ...ok, balance: 699 }).reason, 'funds');
assert.equal(claimStatus(item, { ...ok, owned: { vhs: true }, stock: { vhs: 0 } }).reason, 'owned'); // lo tuyo no sale “agotado”
console.log('Tienda OK: precios y reglas de canje.');
