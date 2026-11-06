'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import SearchField from '@/components/ui/SearchField/SearchField';
import Segmented from '@/components/ui/Segmented/Segmented';
import Chip from '@/components/ui/Chip/Chip';
import Button from '@/components/ui/Button/Button';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import Status from '@/components/ui/Status/Status';
import ResultCard from '@/components/title/ResultCard/ResultCard';
import { useSession } from '@/store/SessionContext';
import { usePaged } from '@/hooks/usePaged';
import { usePlatforms } from '@/hooks/useCatalogData';
import { exploreTitles, parseQuery, yearRanges } from '@/services/catalog';
import { GENRES, genreLabel } from '@/data/genres';
import { ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';
import s from './SearchPage.module.css';

const DEBOUNCE_MS = 350;
const TYPES = ['all', 'movie', 'tv'];
const TOGGLES = ['inTheaters', 'short', 'topRated'];
const SORTS = ['popular', 'rating', 'recent'];

/** Filtros guardados en la URL (?q=&type=&genre=&year=&sort=&inTheaters=1…), así se pueden compartir. */
function readFilters(params) {
  return {
    type: TYPES.includes(params.get('type')) ? params.get('type') : 'all',
    genre: GENRES[params.get('genre')] ? params.get('genre') : '',
    year: params.get('year') ?? '',
    sort: SORTS.includes(params.get('sort')) ? params.get('sort') : 'popular',
    ...Object.fromEntries(TOGGLES.map((k) => [k, params.get(k) === '1'])),
  };
}

export default function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { profile } = useSession();
  const platforms = usePlatforms();
  const [text, setText] = useState(params.get('q') ?? '');
  const [query, setQuery] = useState(text);
  const [removed, setRemoved] = useState([]);
  const filters = readFilters(params);
  const years = yearRanges();

  const writeUrl = (next) => {
    const url = new URLSearchParams();
    if (next.q?.trim()) url.set('q', next.q.trim());
    if (next.type !== 'all') url.set('type', next.type);
    if (next.genre) url.set('genre', next.genre);
    if (next.year) url.set('year', next.year);
    if (next.sort !== 'popular') url.set('sort', next.sort);
    TOGGLES.forEach((k) => { if (next[k]) url.set(k, '1'); });
    router.replace(url.size ? `${ROUTES.search}?${url}` : ROUTES.search, { scroll: false });
  };
  const setFilter = (key, value) => writeUrl({ ...filters, q: query, [key]: value });
  const clearFilters = () => writeUrl({ ...readFilters(new URLSearchParams()), q: query });

  // Espera a que dejes de escribir antes de buscar.
  useEffect(() => {
    const id = setTimeout(() => {
      if (text === query) return;
      setQuery(text);
      setRemoved([]);
      writeUrl({ ...filters, q: text });
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const anyFilter = filters.type !== 'all' || filters.genre || filters.year || filters.sort !== 'popular' || TOGGLES.some((k) => filters[k]);
  const active = !!query.trim() || anyFilter;
  const parsed = useMemo(() => (query.trim() ? parseQuery(query, platforms.data ?? []).filter((f) => !removed.includes(f.label)) : []), [query, platforms.data, removed]);
  const key = active ? JSON.stringify({ query, removed, filters, kids: profile.kids, p: platforms.data?.length ?? 0 }) : null;
  const results = usePaged((page) => exploreTitles({ ...filters, query, removedLabels: removed, platforms: platforms.data ?? [], profile }, page), key);

  // Al llegar al final de la lista, cargar más.
  const sentinel = useRef(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || results.done || results.loading) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) results.loadMore(); }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, [results]);

  const ui = copy.search.ui;
  return (
    <div className={s.page}>
      <PageHeader title={copy.search.title} />
      <SearchField value={text} onChange={setText} onClear={() => setText('')} placeholder={copy.search.placeholder} autoFocus />

      <div className={s.filters}>
        <Segmented label={ui.type} value={filters.type} onChange={(v) => setFilter('type', v)} options={TYPES.map((k) => ({ value: k, label: ui.types[k] }))} />
        <label className={s.select}>
          <span className="u-sr-only">{ui.year}</span>
          <select value={filters.year} onChange={(e) => setFilter('year', e.target.value)}>
            <option value="">{ui.anyYear}</option>
            {years.map((y) => <option key={y.id} value={y.id}>{ui.years[y.id] ?? y.id}</option>)}
          </select>
        </label>
        <label className={s.select}>
          <span className="u-sr-only">{ui.sort}</span>
          <select value={filters.sort} onChange={(e) => setFilter('sort', e.target.value)}>
            {SORTS.map((k) => <option key={k} value={k}>{ui.sorts[k]}</option>)}
          </select>
        </label>
        {TOGGLES.map((k) => <Chip key={k} active={filters[k]} onClick={() => setFilter(k, !filters[k])}>{ui.toggles[k]}</Chip>)}
        {anyFilter && <Button variant="link" onClick={clearFilters}>{ui.clear}</Button>}
      </div>

      <div className={s.genres} role="group" aria-label={ui.genre}>
        {Object.keys(GENRES).map((id) => (
          <Chip key={id} active={filters.genre === id} onClick={() => setFilter('genre', filters.genre === id ? '' : id)}>{genreLabel(id)}</Chip>
        ))}
      </div>

      {parsed.length > 0 && (
        <div className={s.row}>
          <span className="u-muted">{copy.search.applied}</span>
          {parsed.map((f) => <Chip key={f.label} removable title={copy.search.removeFilter} onClick={() => setRemoved((r) => [...r, f.label])}>{f.label}</Chip>)}
        </div>
      )}

      {!active && (
        <div className={s.explore}>
          <span className="u-muted">{copy.search.explore}</span>
          <div className={s.row}>{copy.search.suggestions.map((x) => <Chip key={x} onClick={() => setText(x)}>{x}</Chip>)}</div>
        </div>
      )}

      {active && (
        <Status loading={results.loading && !results.items.length} error={!results.items.length && results.error} onRetry={results.retry}>
          {results.items.length ? (
            <>
              <span className="u-muted">{copy.search.results(results.items.length)}{!results.done ? '+' : ''}</span>
              <div className={s.results}>{results.items.map((t) => <ResultCard key={t.id} title={t} />)}</div>
              {!results.done && <div ref={sentinel} className={s.more} role="status">{copy.common.loading}</div>}
            </>
          ) : (
            <EmptyState>{copy.search.empty}</EmptyState>
          )}
        </Status>
      )}
    </div>
  );
}
