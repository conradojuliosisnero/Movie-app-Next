// Coleccionables equipables: qué espacio ocupa cada tipo y qué se publica en el ranking.
import { CATALOG } from './catalog.js';

// Tipo del catálogo → espacio. 'wall' = se cuelga solo en tu colección; null = aún sin uso en el app.
export const SLOT_OF = { Marcos: 'frame', Títulos: 'title', Fondos: 'background', Efectos: 'effect', Insignias: 'badges', Pines: 'badges', Pósters: 'wall', Reacciones: null };
export const MAX_BADGES = 3;
export const EMPTY_LOOK = { frame: null, title: null, background: null, effect: null, badges: [] };

export const itemById = Object.fromEntries(CATALOG.map((it) => [it.id, it]));
/** 'Título “Director de culto”' → 'Director de culto'. */
export const shortName = (id) => itemById[id]?.name.match(/“(.+)”/)?.[1] ?? itemById[id]?.name ?? '';

/** Lo equipado, solo con lo que de verdad se tiene (lo que se publica en el ranking). */
export function lookOf(store = {}) {
  const owned = store.owned ?? {};
  const eq = { ...EMPTY_LOOK, ...store.equipped };
  const has = (id) => (id && owned[id] ? id : null);
  return {
    frame: has(eq.frame), title: has(eq.title), background: has(eq.background), effect: has(eq.effect),
    badges: (eq.badges ?? []).filter((id) => owned[id]).slice(0, MAX_BADGES),
  };
}

/** Equipar o quitar (las insignias y pines se suman o se quitan, hasta MAX_BADGES). */
export function toggleEquip(equipped = EMPTY_LOOK, id) {
  const slot = SLOT_OF[itemById[id]?.kind];
  const eq = { ...EMPTY_LOOK, ...equipped };
  if (slot === 'badges') {
    const on = eq.badges.includes(id);
    if (!on && eq.badges.length >= MAX_BADGES) return eq;
    return { ...eq, badges: on ? eq.badges.filter((b) => b !== id) : [...eq.badges, id] };
  }
  if (!slot || slot === 'wall') return eq;
  return { ...eq, [slot]: eq[slot] === id ? null : id };
}
