'use client';
// Datos de TMDB que usan varias pantallas.
import { useAsync } from './useAsync';
import { getPlatforms, getTitleDetails } from '@/services/catalog';

export const usePlatforms = () => useAsync(getPlatforms, 'platforms');

export const useTitleDetails = (id) => useAsync(() => getTitleDetails(id), id ?? null);
