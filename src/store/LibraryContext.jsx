'use client';
// Lista del perfil activo: estados, progreso, calificaciones, reseñas, plataformas y ajustes.
// Con cuenta se guarda en Firestore (users/{uid}/profiles/{profileId}); en modo explorar, en este navegador.
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSession } from './SessionContext';
import { useToast } from './ToastContext';
import { storage } from '@/services/storage';
import { compact } from '@/services/catalog';
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
  reminders: {},
  myPlatforms: [],
  settings: { onlyMine: false },
};

const without = (obj, key) => { const { [key]: _, ...rest } = obj; return rest; };
const toggleIn = (list, value) => (list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

function reducer(state, a) {
  switch (a.type) {
    case 'load':
      return { ...EMPTY_LIBRARY, ...a.state, settings: { ...EMPTY_LIBRARY.settings, ...a.state?.settings }, dirty: false };
    case 'status': {
      const { id } = a.item;
      if (a.status == null) {
        const keepItem = state.reminders[id] || state.progress[id];
        return { ...state, dirty: true, statuses: without(state.statuses, id), items: keepItem ? state.items : without(state.items, id) };
      }
      const seenAt = a.status === STATUS.SEEN && !state.seenAt[id] ? { ...state.seenAt, [id]: todayISO() } : state.seenAt;
      return { ...state, dirty: true, statuses: { ...state.statuses, [id]: a.status }, items: { ...state.items, [id]: { ...state.items[id], ...compact(a.item) } }, seenAt };
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
    case 'reminder': {
      const { id } = a.item;
      const on = !state.reminders[id];
      return { ...state, dirty: true, reminders: on ? { ...state.reminders, [id]: true } : without(state.reminders, id), items: on ? { ...state.items, [id]: compact(a.item) } : state.items };
    }
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
        if (!cancelled) { dispatch({ type: 'load', state: {} }); setLoadedKey(key); show(copy.toasts.saveError); }
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
    const { dirty, ...data } = state;
    pending.current = () => {
      if (isGuest) storage.set('library', data);
      else if (ref) setDoc(ref, data).catch(() => show(copy.toasts.saveError));
    };
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, APP.saveDebounceMs);
  }, [state, loadedKey, key, isGuest, ref, show]);

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
      toggleReminder: (item) => dispatch({ type: 'reminder', item }),
      toggleSetting: (key) => dispatch({ type: 'setting', key }),
      togglePlatform: (id) => dispatch({ type: 'platform', id }),
    }),
    [state, key, loadedKey]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export const useLibrary = () => useContext(LibraryContext);
