'use client';
// Lista que se va cargando por páginas (TMDB devuelve 20 títulos por página).
import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_PAGES = 10;

/** fetchPage(page) → Promise<títulos[]>. Se reinicia cuando cambia `key` (null = no cargar). */
export function usePaged(fetchPage, key) {
  const [state, setState] = useState({ items: [], page: 0, loading: key != null, error: null, done: false });
  const busy = useRef(false);
  const fn = useRef(fetchPage);
  fn.current = fetchPage;

  const load = useCallback(async (page, reset) => {
    if (busy.current) return;
    busy.current = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const next = await fn.current(page);
      setState((s) => {
        const base = reset ? [] : s.items;
        const seen = new Set(base.map((t) => t.id));
        const fresh = next.filter((t) => !seen.has(t.id));
        return { items: [...base, ...fresh], page, loading: false, error: null, done: !fresh.length || page >= MAX_PAGES };
      });
    } catch (error) {
      setState((s) => ({ ...s, loading: false, error }));
    } finally {
      busy.current = false;
    }
  }, []);

  useEffect(() => {
    if (key == null) { setState({ items: [], page: 0, loading: false, error: null, done: true }); return; }
    busy.current = false;
    load(1, true);
  }, [key, load]);

  return {
    ...state,
    loadMore: () => { if (!state.done && !state.loading && !state.error) load(state.page + 1, false); },
    retry: () => load(state.page || 1, state.page === 0),
  };
}
