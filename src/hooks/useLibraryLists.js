'use client';
// Listas del perfil activo, armadas con las copias guardadas en la biblioteca (sin pedir nada a TMDB).
import { useMemo } from 'react';
import { useLibrary } from '@/store/LibraryContext';
import { STATUS } from '@/config/app.config';

export function useLibraryLists() {
  const lib = useLibrary();
  return useMemo(() => {
    const byStatus = (s) => Object.entries(lib.statuses).filter(([id, st]) => st === s && lib.items[id]).map(([id]) => lib.items[id]);
    return {
      watching: byStatus(STATUS.WATCHING).filter((t) => t.type === 'series'),
      wantList: byStatus(STATUS.WANT).reverse(), // lo último guardado primero
      seenList: byStatus(STATUS.SEEN).sort((a, b) => (lib.seenAt[b.id] || '').localeCompare(lib.seenAt[a.id] || '')),
    };
  }, [lib.statuses, lib.items, lib.seenAt]);
}
