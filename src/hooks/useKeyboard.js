'use client';
import { useEffect, useRef } from 'react';

/** useKeyboard({ ArrowLeft: fn, Escape: fn }, enabled). Ignora teclas mientras se escribe. */
export function useKeyboard(handlers, enabled = true) {
  const ref = useRef(handlers);
  ref.current = handlers;
  useEffect(() => {
    if (!enabled) return undefined;
    const onKey = (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      const fn = ref.current[e.key];
      if (fn) { e.preventDefault(); fn(e); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
