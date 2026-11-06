'use client';
// Acciones sobre títulos con su aviso correspondiente. Úsalo desde cualquier componente.
import { useLibrary } from '@/store/LibraryContext';
import { useSession } from '@/store/SessionContext';
import { useToast } from '@/store/ToastContext';
import { getTitleDetails, isSeries } from '@/services/catalog';
import { STATUS } from '@/config/app.config';
import { copy } from '@/i18n';

export function useTitleActions() {
  const lib = useLibrary();
  const session = useSession();
  const { show } = useToast();

  // Para las estadísticas hacen falta duración y temporadas, que las listas de TMDB no traen.
  const complete = (t) => {
    const missing = isSeries(t) ? !t.seasons : !t.minutes;
    if (missing) getTitleDetails(t.id).then(lib.updateItem).catch(() => {});
  };

  const setStatus = (t, status) => {
    lib.setStatus(t, status);
    if (status === STATUS.SEEN || status === STATUS.WATCHING) { complete(t); session.touchProfile(t.title); }
  };

  const toggle = (t, status, message) => {
    if (lib.statuses[t.id] === status) {
      lib.setStatus(t, null);
      show(copy.toasts.removed);
    } else {
      setStatus(t, status);
      show(message);
    }
  };

  return {
    statusOf: (t) => lib.statuses[t.id],
    save: (t) => toggle(t, STATUS.WANT, copy.toasts.saved(t.title)),
    markSeen: (t) => toggle(t, STATUS.SEEN, copy.toasts.seen(t.title)),
    dismiss: (t) => toggle(t, STATUS.DISMISSED, copy.toasts.dismissed),
    /** Marca hasta el episodio n de la temporada; tocar el último marcado lo desmarca. */
    markEpisode: (t, season, n) => {
      if (!t.seasons?.length) return;
      const current = lib.progress[t.id];
      const first = t.seasons[0].n;
      const last = t.seasons[t.seasons.length - 1];
      let value = current?.season === season && current.ep === n ? { season, ep: n - 1 } : { season, ep: n };
      if (value.ep === 0 && season === first) value = null;

      lib.setProgress(t.id, value);
      if (value && value.season === last.n && value.ep >= last.episodes) {
        setStatus(t, STATUS.SEEN);
        show(copy.toasts.finished(t.title));
      } else if (value && lib.statuses[t.id] !== STATUS.WATCHING) {
        setStatus(t, STATUS.WATCHING);
      } else if (!value && lib.statuses[t.id] === STATUS.WATCHING) {
        lib.setStatus(t, null);
      }
    },
  };
}
