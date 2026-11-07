// Reglas anti-inflación de la tienda.
export const DEFAULTS = { incrementPct: 10, weeklyLimit: 3, raffleCost: 500 };

export const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Cada coleccionable que ya tienes en la temporada sube tu precio un X %.
export const multiplier = (ownedCount, incrementPct = DEFAULTS.incrementPct) => 1 + (incrementPct / 100) * ownedCount;
export const formatMult = (m) => "x" + m.toFixed(2).replace(/0$/, "").replace(".", ",");
export const priceFor = (base, mult) => Math.round((base * mult) / 10) * 10;

// Devuelve si se puede canjear y por qué no.
export function claimStatus(item, { owned, stock, claims, balance, mult, weeklyLimit, guest }) {
  if (owned[item.id]) return { ok: false, reason: "owned", label: "Lo tienes", stamp: "EN COLECCIÓN" };
  if (!stock[item.id]) return { ok: false, reason: "soldout", label: "Agotado", stamp: "AGOTADO" };
  if (guest) return { ok: false, reason: "guest", label: "Con cuenta" };
  if (claims >= weeklyLimit) return { ok: false, reason: "limit", label: "Límite semanal" };
  if (balance < priceFor(item.base, mult)) return { ok: false, reason: "funds", label: "Sin saldo" };
  return { ok: true, label: "Canjear" };
}
