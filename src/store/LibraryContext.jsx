'use client';
// Lista del perfil activo: estados, progreso, calificaciones, reseñas, plataformas y ajustes.
// Con cuenta se guarda en Firestore (users/{uid}/profiles/{profileId}); en modo explorar, en este navegador.
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSession } from './SessionContext';
import { useToast } from './ToastContext';
import { storage } from '@/services/storage';
import { compact, setAdultContent } from '@/services/catalog';
import { POINTS, credit, entryId, legacyScore, openChest, publishScore, removeScore, rollWeek, scoreOf, visitToday } from '@/services/ranking';
import { avatarSeed } from '@/components/ui/Avatar/Avatar';
import { emitPoints } from '@/lib/pointsFx';
import { APP, STATUS } from '@/config/app.config';
import { todayISO } from '@/utils/format';
import { copy } from '@/i18n';

const LibraryContext = createContext(null);

export const EMPTY_LIBRARY = {
  items: {}, // copia mínima de cada título, para mostrar la lista sin pedirla otra vez a TMDB
  statuses: {},
  progress: {}, // { [id]: { season, ep } }
  ratings: {},
  reviews: {},
  seenAt: {},
  myPlatforms: [],
  activity: {}, // { days, streak, best, weeks, last }: visitas diarias para la racha y los puntos
  watched: {}, // { [id | id:temporada:episodio]: fecha } lo que se vio completo en el reproductor
  chests: {}, // cofres: { day, opened, week, rare } (ver services/ranking)
  ledger: {}, // puntos por día { 'YYYY-MM-DD': n, legacy: n } con tope diario (ver services/ranking)
  earned: {}, // { 'want:movie-550': fecha } puntos ya ganados: cada título suma una sola vez por acción (anti trampas)
  settings: { onlyMine: false, adult: false, ranking: true },
};

const without = (obj, key) => { const { [key]: _, ...rest } = obj; return rest; };
const toggleIn = (list, value) => (list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

function reducer(state, a) {
  switch (a.type) {
    case 'load': {
      const { reminders, ...saved } = a.state ?? {}; // los recordatorios se quitaron: se descartan de listas viejas
      const next = { ...EMPTY_LIBRARY, ...saved, settings: { ...EMPTY_LIBRARY.settings, ...saved.settings }, dirty: false, visited: null };
      // Listas de antes del ranking: lo que ya estaba guardado o visto cuenta como ganado.
      if (!saved.earned) next.earned = Object.fromEntries(Object.entries(next.statuses).filter(([, st]) => POINTS[st]).map(([id, st]) => [`${st}:${id}`, next.seenAt[id] ?? todayISO()]));
      // Lista de antes del tope diario: lo ya ganado queda como saldo inicial.
      if (!saved.ledger) next.ledger = { legacy: legacyScore(next) };
      // Primera vez del día: suma la visita (si la lista no cargó, no se toca para no pisar lo guardado).
      if (a.failed) return next;
      const activity = visitToday(next.activity);
      const chests = rollWeek(next.chests); // primera vez de la semana: ¿aparece el cofre especial?
      const visit = activity && credit(next.ledger, POINTS.day + (activity.streak % 7 === 0 ? POINTS.week : 0));
      return {
        ...next,
        ...(activity && { activity, visited: activity, ledger: visit.ledger }),
        ...(chests && { chests }),
        dirty: !!(activity || chests || !saved.ledger),
      };
    }
    case 'chest': {
      const opened = openChest(state.chests, a.kind, a.points);
      if (!opened) return state;
      const c = credit(state.ledger, opened.won);
      return { ...state, dirty: true, chests: opened.chests, ledger: c.ledger, capped: c.capped ? (state.capped ?? 0) + 1 : state.capped };
    }
    case 'watched':
      if (state.watched[a.key]) return state;
      {
        const c = credit(state.ledger, POINTS.watched);
        return { ...state, dirty: true, watched: { ...state.watched, [a.key]: todayISO() }, ledger: c.ledger, capped: c.capped ? (state.capped ?? 0) + 1 : state.capped };
      }
    case 'status': {
      const { id } = a.item;
      if (a.status == null) {
        const keepItem = state.progress[id];
        return { ...state, dirty: true, statuses: without(state.statuses, id), items: keepItem ? state.items : without(state.items, id) };
      }
      const seenAt = a.status === STATUS.SEEN && !state.seenAt[id] ? { ...state.seenAt, [id]: todayISO() } : state.seenAt;
      // Se anota el día en que ganó los puntos: quitar y volver a poner no vuelve a sumar.
      const earnKey = `${a.status}:${id}`;
      const isNew = POINTS[a.status] && !state.earned[earnKey];
      const earned = isNew ? { ...state.earned, [earnKey]: todayISO() } : state.earned;
      // Los puntos se anotan en el registro del día (con el tope diario).
      const c = isNew ? credit(state.ledger, POINTS[a.status]) : { ledger: state.ledger, capped: false };
      return {
        ...state, dirty: true, statuses: { ...state.statuses, [id]: a.status }, items: { ...state.items, [id]: { ...state.items[id], ...compact(a.item) } },
        seenAt, earned, ledger: c.ledger, capped: c.capped ? (state.capped ?? 0) + 1 : state.capped,
      };
    }
    case 'item':
      if (!state.items[a.item.id]) return state;
      return { ...state, dirty: true, items: { ...state.items, [a.item.id]: { ...state.items[a.item.id], ...compact(a.item) } } };
    case 'progress':
      return { ...state, dirty: true, progress: a.value ? { ...state.progress, [a.id]: a.value } : without(state.progress, a.id) };
    case 'rating':
      return { ...state, dirty: true, ratings: { ...state.ratings, [a.id]: a.value } };
    case 'review':
      return { ...state, dirty: true, reviews: { ...state.reviews, [a.id]: a.value } };
    case 'setting':
      return { ...state, dirty: true, settings: { ...state.settings, [a.key]: !state.settings[a.key] } };
    case 'platform':
      return { ...state, dirty: true, myPlatforms: toggleIn(state.myPlatforms, a.id) };
    default:
      return state;
  }
}

export function LibraryProvider({ children }) {
  const { user, isGuest, profile } = useSession();
  const { show } = useToast();
  const [state, dispatch] = useReducer(reducer, { ...EMPTY_LIBRARY, dirty: false });
  const [loadedKey, setLoadedKey] = useReducer((_, k) => k, null);

  const key = profile ? (isGuest ? 'guest' : `${user?.uid}/${profile.id}`) : null;
  // Depende SOLO de la clave (uid/perfil). Si dependiera del objeto `profile`, cada cambio de la cuenta
  // (p. ej. guardar “Última”) recargaría la lista desde Firestore y borraría el clic que aún no se guardó.
  const ref = useMemo(() => {
    if (!key || key === 'guest') return null;
    const [uid, profileId] = key.split('/');
    return doc(db, 'users', uid, 'profiles', profileId);
  }, [key]);

  // Cargar la lista cuando cambia el perfil.
  useEffect(() => {
    if (!key) return undefined;
    let cancelled = false;
    const load = async () => {
      try {
        const data = isGuest ? storage.get('library', {}) : (await getDoc(ref)).data() ?? {};
        if (!cancelled) { dispatch({ type: 'load', state: data }); setLoadedKey(key); }
      } catch {
        if (!cancelled) { dispatch({ type: 'load', state: {}, failed: true }); setLoadedKey(key); show(copy.toasts.saveError); }
      }
    };
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Guardar los cambios (agrupados para no escribir en cada tecla de una reseña).
  const timer = useRef();
  const pending = useRef(null);
  const flush = () => { clearTimeout(timer.current); const fn = pending.current; pending.current = null; fn?.(); };

  useEffect(() => {
    if (!state.dirty || loadedKey !== key) return;
    const { dirty, visited, capped, ...data } = state;
    pending.current = () => {
      if (isGuest) storage.set('library', data);
      else if (ref) setDoc(ref, data).catch(() => show(copy.toasts.saveError));
    };
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, APP.saveDebounceMs);
  }, [state, loadedKey, key, isGuest, ref, show]);

  // +18 solo si el perfil lo activó (nunca en perfiles infantiles).
  // Se aplica aquí, en el render y no en un efecto: los efectos de las pantallas (que piden a TMDB)
  // corren antes que los de este proveedor, y la primera búsqueda salía sin el +18.
  setAdultContent(!!state.settings.adult && !profile?.kids);

  // Tope diario: aviso cuando algo ya no sumó porque se llegó a 500 hoy.
  useEffect(() => {
    if (state.capped) show(copy.ranking.capReached);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.capped]);

  // Racha: aviso la primera vez del día.
  useEffect(() => {
    if (state.visited) show(copy.ranking.dayToast(state.visited.streak, POINTS.day + (state.visited.streak % 7 === 0 ? POINTS.week : 0)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.visited]);

  // Ranking: con cuenta, el puntaje (y nombre y avatar del perfil) se publica en el top; si lo apagas, se borra.
  const score = scoreOf(state);
  const ranked = state.settings.ranking !== false;
  const avatar = avatarSeed(profile);

  // Animación “+N pts” cuando el puntaje sube. Al cargar la lista no; la visita del día sí se celebra.
  const lastScore = useRef(null);
  useEffect(() => {
    if (!key || loadedKey !== key) return undefined;
    const prev = lastScore.current;
    lastScore.current = { key, score };
    if (prev?.key === key) { emitPoints(score - prev.score); return undefined; }
    if (!state.visited) return undefined;
    const t = setTimeout(() => emitPoints(POINTS.day + (state.visited.streak % 7 === 0 ? POINTS.week : 0)), 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, key, loadedKey]);
  useEffect(() => {
    if (isGuest || !key || loadedKey !== key) return undefined;
    const [uid, profileId] = key.split('/');
    const id = entryId(uid, profileId);
    const t = setTimeout(() => {
      (ranked ? publishScore(id, { name: profile?.name ?? '', avatar, score }) : removeScore(id)).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, ranked, profile?.name, avatar, isGuest, key, loadedKey]);

  // Si cambias de perfil o cierras la pestaña antes de que pase la espera, se guarda igual.
  useEffect(() => flush, [key]);
  useEffect(() => {
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      ready: !!key && loadedKey === key,
      setStatus: (item, status) => dispatch({ type: 'status', item, status }),
      updateItem: (item) => dispatch({ type: 'item', item }),
      setProgress: (id, value) => dispatch({ type: 'progress', id, value }),
      setRating: (id, value) => dispatch({ type: 'rating', id, value }),
      setReview: (id, value) => dispatch({ type: 'review', id, value }),
      toggleSetting: (key) => dispatch({ type: 'setting', key }),
      togglePlatform: (id) => dispatch({ type: 'platform', id }),
      /** Película o episodio visto completo (suma puntos una sola vez). */
      markWatched: (key) => dispatch({ type: 'watched', key }),
      /** Abre un cofre ('daily' | 'rare') con los puntos que salieron en la ruleta. */
      openChest: (kind, points) => dispatch({ type: 'chest', kind, points }),
      score,
    }),
    [state, key, loadedKey, score]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export const useLibrary = () => useContext(LibraryContext);
