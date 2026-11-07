// Puntos, racha diaria y ranking público (top 50).
// Ranking en Firestore: leaderboard/{uid}_{perfil} = { name, avatar, score, updatedAt }.
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { STATUS } from '@/config/app.config';

export const POINTS = {
  day: 15, // entrar cada día
  week: 30, // cada 7 días seguidos
  watched: 7, // ver completa una película o un episodio (de verdad, ver WATCH_SHARE)
  [STATUS.WANT]: 5, // guardar
  [STATUS.SEEN]: 3, // “ya la vi”
  [STATUS.DISMISSED]: 1, // “no me interesa”
};

// Cuenta como vista si el reproductor estuvo abierto y a la vista al menos la mitad de la duración.
// Si el servicio no carga, nadie se queda tanto tiempo mirando un error: no suma.
export const WATCH_SHARE = 0.5;
export const DEFAULT_MINUTES = { movie: 100, episode: 24 };
export const TOP = 50;

// ---------- Cofres ----------
// 3 cofres por día (50 a 100 pts c/u). La primera vez que usas el app en la semana hay 45% de
// probabilidad de que aparezca un cofre especial (100 a 500 pts).
// lista.chests = { day, opened, week, rare: 'ready' | 'none' | 'opened' }
export const CHESTS = { perDay: 3, daily: [50, 100], rare: [100, 500], rareChance: 0.45 };

const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Registra la visita de hoy: suma un día, sigue o reinicia la racha y da el bono de cada 7 días. */
export function visitToday(activity = {}) {
  const now = new Date();
  const today = isoDay(now);
  if (activity.last === today) return null;
  const yesterday = isoDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  const streak = activity.last === yesterday ? (activity.streak ?? 0) + 1 : 1;
  const weekDone = streak % 7 === 0;
  return {
    days: (activity.days ?? 0) + 1,
    streak,
    best: Math.max(activity.best ?? 0, streak),
    weeks: (activity.weeks ?? 0) + (weekDone ? 1 : 0),
    last: today,
  };
}

const todayKey = () => isoDay(new Date());
/** Semana = fecha de su lunes. */
const weekKey = () => { const d = new Date(); return isoDay(new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7))); };

export const rollChest = (kind) => { const [a, b] = CHESTS[kind]; return a + Math.floor(Math.random() * (b - a + 1)); };
export const chestsOpenedToday = (c = {}) => (c.day === todayKey() ? c.opened ?? 0 : 0);
export const chestsLeft = (c = {}) => Math.max(0, CHESTS.perDay - chestsOpenedToday(c));
export const rareReady = (c = {}) => c.week === weekKey() && c.rare === 'ready';

/** Primera vez de la semana: se tira el 45% del cofre especial. null si ya se tiró esta semana. */
export function rollWeek(c = {}) {
  if (c.week === weekKey()) return null;
  return { ...c, week: weekKey(), rare: Math.random() < CHESTS.rareChance ? 'ready' : 'none' };
}

/** Abre un cofre (lo que valida la lista: cupo del día, cofre especial disponible, puntos en rango). */
export function openChest(c = {}, kind, points) {
  const [min, max] = CHESTS[kind];
  const won = Math.min(max, Math.max(0, Math.trunc(points))); // puede ser menos del mínimo si topó el día
  if (kind === 'rare') return rareReady(c) ? { chests: { ...c, rare: 'opened' }, won } : null;
  if (!chestsLeft(c)) return null;
  return { chests: { ...c, day: todayKey(), opened: chestsOpenedToday(c) + 1 }, won };
}

/** Racha vigente: si la última visita no fue hoy ni ayer, ya se perdió. */
export function currentStreak(activity = {}) {
  const now = new Date();
  const yesterday = isoDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  return activity.last === isoDay(now) || activity.last === yesterday ? activity.streak ?? 0 : 0;
}

// Tope diario: todo lo que se gana en un día (entrar, guardar, ver, cofres) suma hasta 500.
// Lo que pase de ahí ya no cuenta; toca esperar al día siguiente. El ajuste manual (bonus) no cuenta.
export const DAILY_CAP = 500;

/**
 * Registro de puntos por día: lista.ledger = { 'YYYY-MM-DD': puntos, legacy: puntos de antes del tope }.
 * Los puntos se anotan al ganarlos (y ahí se aplica el tope); devuelve el registro nuevo y cuánto sumó.
 */
export function credit(ledger = {}, points) {
  const today = todayKey();
  const got = Math.max(0, Math.min(points, DAILY_CAP - (ledger[today] ?? 0)));
  return { ledger: got ? { ...ledger, [today]: (ledger[today] ?? 0) + got } : ledger, got, capped: got < points };
}
export const todayPoints = (lib) => lib.ledger?.[todayKey()] ?? 0;

/** Puntos de una lista de antes del registro por día (para no perder lo ya ganado). */
export function legacyScore(lib) {
  const a = lib.activity ?? {};
  let score = (a.days ?? 0) * POINTS.day + (a.weeks ?? 0) * POINTS.week + Object.keys(lib.watched ?? {}).length * POINTS.watched;
  // Cada título sumó una vez por acción (registro con fecha en `earned`).
  for (const key of Object.keys(lib.earned ?? {})) score += POINTS[key.split(':')[0]] ?? 0;
  return score;
}

export function scoreOf(lib) {
  const earned = lib.ledger ? Object.values(lib.ledger).reduce((n, v) => n + (Number(v) || 0), 0) : legacyScore(lib);
  // Ajuste manual del administrador (se pone a mano en la base: users/{uid}/profiles/{perfil}.bonus).
  return earned + Math.max(0, Math.trunc(Number(lib.bonus) || 0));
}

export const entryId = (uid, profileId) => `${uid}_${profileId}`;

export const publishScore = (id, { name, avatar, score }) =>
  setDoc(doc(db, 'leaderboard', id), { name: String(name).slice(0, 40), avatar: String(avatar).slice(0, 80), score, updatedAt: serverTimestamp() });

export const removeScore = (id) => deleteDoc(doc(db, 'leaderboard', id));

export async function topPlayers() {
  const snap = await getDocs(query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(TOP)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
