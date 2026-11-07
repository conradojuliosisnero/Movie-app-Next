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
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import Sheet from '@/components/ui/Sheet/Sheet';
import { useSession } from '@/store/SessionContext';
import { usePaged } from '@/hooks/usePaged';
import { usePlatforms } from '@/hooks/useCatalogData';
import { exploreTitles, getForYou, parseQuery, yearRanges } from '@/services/catalog';
import PosterCard from '@/components/title/PosterCard/PosterCard';
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader';
import { useLibrary } from '@/store/LibraryContext';
import { useTitleActions } from '@/hooks/useTitleActions';
import { GENRES, genreLabel } from '@/data/genres';
import { ROUTES, STATUS } from '@/config/app.config';
import { copy } from '@/i18n';
import s from './SearchPage.module.css';

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
  const [panel, setPanel] = useState(false);

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

  // Se busca al tocar “Buscar” (o Enter), no mientras escribes.
  const submit = (value = text) => {
    setText(value);
    setQuery(value);
    setRemoved([]);
    writeUrl({ ...filters, q: value });
  };

  const anyFilter = filters.type !== 'all' || filters.genre || filters.year || filters.sort !== 'popular' || TOGGLES.some((k) => filters[k]);
  const active = !!query.trim() || anyFilter;
  const parsed = useMemo(() => (query.trim() ? parseQuery(query, platforms.data ?? []).filter((f) => !removed.includes(f.label)) : []), [query, platforms.data, removed]);
  const key = active ? JSON.stringify({ query, removed, filters, kids: profile.kids, p: platforms.data?.length ?? 0 }) : null;
  const results = usePaged((page) => exploreTitles({ ...filters, query, removedLabels: removed, platforms: platforms.data ?? [], profile }, page), key);
  const lib = useLibrary();
  const act = useTitleActions();
  const forYou = usePaged((page) => getForYou({ profile, lib }, page), active ? null : `search-foryou|${profile.id}`);
  const forYouEnd = useRef(null);
  useEffect(() => {
    const el = forYouEnd.current;
    if (!el || forYou.done || forYou.loading) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) forYou.loadMore(); }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, [forYou]);

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
  // Un chip por filtro activo; tocarlo lo quita.
  const chips = [
    filters.type !== 'all' && { key: 'type', label: ui.types[filters.type], remove: () => setFilter('type', 'all') },
    filters.genre && { key: 'genre', label: genreLabel(filters.genre), remove: () => setFilter('genre', '') },
    filters.year && { key: 'year', label: ui.years[filters.year] ?? filters.year, remove: () => setFilter('year', '') },
    filters.sort !== 'popular' && { key: 'sort', label: ui.sorts[filters.sort], remove: () => setFilter('sort', 'popular') },
    ...TOGGLES.map((k) => filters[k] && { key: k, label: ui.toggles[k], remove: () => setFilter(k, false) }),
  ].filter(Boolean);
  const activeCount = chips.length;
  return (
    <div className={s.page}>
      <PageHeader title={copy.search.title} />
      <SearchField value={text} onChange={setText} onClear={() => submit('')} onSubmit={() => submit()} submitLabel={copy.search.submit} placeholder={copy.search.placeholder} autoFocus />

      {/* Botón de filtros + filtros activos (cada chip se quita con un toque). */}
      <div className={s.toolbar}>
        <Button icon="filters" active={activeCount > 0} onClick={() => setPanel(true)}>
          {ui.open}{activeCount > 0 && <span className={s.count}>{activeCount}</span>}
        </Button>
        <div className={s.chips}>
          {chips.map((c) => <Chip key={c.key} removable title={copy.search.removeFilter} onClick={c.remove}>{c.label}</Chip>)}
          {parsed.map((f) => <Chip key={f.label} removable title={copy.search.removeFilter} onClick={() => setRemoved((r) => [...r, f.label])}>{f.label}</Chip>)}
        </div>
      </div>

      {panel && (
        <Sheet size="sm" label={ui.title} onClose={() => setPanel(false)}>
          {({ close, dragRef }) => (
            <div className={s.panel}>
              <header ref={dragRef} className={s.panelHead}>
                <h2 className={s.panelTitle}>{ui.title}</h2>
                <Button variant="ghost" size="sm" icon="close" aria-label={copy.common.close} onClick={close} />
              </header>

              <section className={s.group}>
                <b className={s.groupTitle}>{ui.type}</b>
                <Segmented label={ui.type} value={filters.type} onChange={(v) => setFilter('type', v)} options={TYPES.map((k) => ({ value: k, label: ui.types[k] }))} />
              </section>

              <section className={s.group}>
                <b className={s.groupTitle}>{ui.genre}</b>
                <div className={s.wrapChips}>
                  {Object.keys(GENRES).map((id) => (
                    <Chip key={id} active={filters.genre === id} onClick={() => setFilter('genre', filters.genre === id ? '' : id)}>{genreLabel(id)}</Chip>
                  ))}
                </div>
              </section>

              <section className={s.group}>
                <b className={s.groupTitle}>{ui.year}</b>
                <div className={s.wrapChips}>
                  <Chip active={!filters.year} onClick={() => setFilter('year', '')}>{ui.anyYear}</Chip>
                  {years.map((y) => <Chip key={y.id} active={filters.year === y.id} onClick={() => setFilter('year', filters.year === y.id ? '' : y.id)}>{ui.years[y.id] ?? y.id}</Chip>)}
                </div>
              </section>

              <section className={s.group}>
                <b className={s.groupTitle}>{ui.more}</b>
                <div className={s.wrapChips}>
                  {TOGGLES.map((k) => <Chip key={k} active={filters[k]} onClick={() => setFilter(k, !filters[k])}>{ui.toggles[k]}</Chip>)}
                </div>
              </section>

              <section className={s.group}>
                <b className={s.groupTitle}>{ui.sort}</b>
                <Segmented label={ui.sort} value={filters.sort} onChange={(v) => setFilter('sort', v)} options={SORTS.map((k) => ({ value: k, label: ui.sorts[k] }))} />
              </section>

              <footer className={s.panelFoot}>
                <Button variant="ghost" disabled={!anyFilter} onClick={clearFilters}>{ui.clear}</Button>
                <Button variant="primary" onClick={close}>{active && results.items.length ? ui.show(results.items.length, !results.done) : ui.done}</Button>
              </footer>
            </div>
          )}
        </Sheet>
      )}

      {!active && (
        <div className={s.explore}>
          <span className="u-muted">{copy.search.explore}</span>
          <div className={s.row}>{copy.search.suggestions.map((x) => <Chip key={x} onClick={() => submit(x)}>{x}</Chip>)}</div>
        </div>
      )}

      {/* Antes de buscar: recomendados para ti (siguen cargando al bajar). */}
      {!active && (
        <section className={s.recommended}>
          <SectionHeader title={copy.home.forYou} subtitle={copy.home.forYouHint} />
          <Status skeleton="rail" loading={forYou.loading && !forYou.items.length} error={!forYou.items.length && forYou.error} onRetry={forYou.retry}>
            <div className={s.grid}>
              {forYou.items.map((t) => (
                <PosterCard key={t.id} title={t} size="fluid" actions={[
                  { key: 'save', label: lib.statuses[t.id] === STATUS.WANT ? copy.common.saved : copy.common.save, icon: 'save', active: lib.statuses[t.id] === STATUS.WANT, onClick: () => act.save(t) },
                  { key: 'seen', label: copy.common.seen, icon: 'seen', active: lib.statuses[t.id] === STATUS.SEEN, onClick: () => act.markSeen(t) },
                ]} />
              ))}
            </div>
            {!forYou.done && <div ref={forYouEnd} className={s.more}><Skeleton kind="rail" /></div>}
          </Status>
        </section>
      )}

      {active && (
        <Status skeleton="cards" loading={results.loading && !results.items.length} error={!results.items.length && results.error} onRetry={results.retry}>
          {results.items.length ? (
            <>
              <span className="u-muted">{copy.search.results(results.items.length)}{!results.done ? '+' : ''}</span>
              <div className={s.results}>{results.items.map((t) => <ResultCard key={t.id} title={t} />)}</div>
              {!results.done && <div ref={sentinel} className={s.more}><Skeleton kind="cards" /></div>}
            </>
          ) : (
            <EmptyState>{copy.search.empty}</EmptyState>
          )}
        </Status>
      )}
    </div>
  );
}
