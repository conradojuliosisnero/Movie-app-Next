'use client';
import { useCallback, useEffect, useState } from 'react';

/**
 * Ejecuta una función async y guarda { data, loading, error }.
 * Se vuelve a ejecutar cuando cambia `key` (null = no ejecutar).
 */
export function useAsync(fn, key) {
  const [state, setState] = useState({ data: null, loading: key != null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (key == null) { setState({ data: null, loading: false, error: null }); return undefined; }
    let cancelled = false;
    setState((s) => ({ data: s.data, loading: true, error: null }));
    fn().then(
      (data) => { if (!cancelled) setState({ data, loading: false, error: null }); },
      (error) => { if (!cancelled) setState({ data: null, loading: false, error }); }
    );
    return () => { cancelled = true; };
    // fn cambia en cada render; `key` resume de qué depende.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
