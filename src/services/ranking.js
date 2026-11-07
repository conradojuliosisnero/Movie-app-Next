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

/** Racha vigente: si la última visita no fue hoy ni ayer, ya se perdió. */
export function currentStreak(activity = {}) {
  const now = new Date();
  const yesterday = isoDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  return activity.last === isoDay(now) || activity.last === yesterday ? activity.streak ?? 0 : 0;
}

export function scoreOf(lib) {
  const a = lib.activity ?? {};
  let score = (a.days ?? 0) * POINTS.day + (a.weeks ?? 0) * POINTS.week + Object.keys(lib.watched ?? {}).length * POINTS.watched;
  // Ajuste manual del administrador (se pone a mano en la base: users/{uid}/profiles/{perfil}.bonus).
  score += Math.max(0, Math.trunc(Number(lib.bonus) || 0));
  // Cada título suma una vez por acción (registro con fecha en `earned`): quitarlo y volverlo a poner no suma de nuevo.
  for (const key of Object.keys(lib.earned ?? {})) score += POINTS[key.split(':')[0]] ?? 0;
  return score;
}

export const entryId = (uid, profileId) => `${uid}_${profileId}`;

export const publishScore = (id, { name, avatar, score }) =>
  setDoc(doc(db, 'leaderboard', id), { name: String(name).slice(0, 40), avatar: String(avatar).slice(0, 80), score, updatedAt: serverTimestamp() });

export const removeScore = (id) => deleteDoc(doc(db, 'leaderboard', id));

export async function topPlayers() {
  const snap = await getDocs(query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(TOP)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
