'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import SearchField from '@/components/ui/SearchField/SearchField';
import Chip from '@/components/ui/Chip/Chip';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import Status from '@/components/ui/Status/Status';
import ResultCard from '@/components/title/ResultCard/ResultCard';
import { useSession } from '@/store/SessionContext';
import { useAsync } from '@/hooks/useAsync';
import { usePlatforms } from '@/hooks/useCatalogData';
import { searchTitles } from '@/services/catalog';
import { ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';
import s from './SearchPage.module.css';

const DEBOUNCE_MS = 350;

export default function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { profile } = useSession();
  const platforms = usePlatforms();
  const [text, setText] = useState(params.get('q') ?? '');
  const [query, setQuery] = useState(text);
  const [removed, setRemoved] = useState([]);

  // Espera a que dejes de escribir antes de buscar, y deja la búsqueda en la URL.
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(text);
      setRemoved([]);
      const url = text.trim() ? `${ROUTES.search}?q=${encodeURIComponent(text.trim())}` : ROUTES.search;
      router.replace(url, { scroll: false });
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [text, router]);

  const hasQuery = !!query.trim();
  const search = useAsync(
    () => searchTitles(query, { removedLabels: removed, platforms: platforms.data ?? [], profile }),
    hasQuery ? `${query}|${removed.join()}|${profile.id}|${platforms.data?.length ?? 0}` : null
  );
  const { filters = [], results = [] } = search.data ?? {};

  return (
    <div className={s.page}>
      <PageHeader title={copy.search.title} />
      <SearchField value={text} onChange={setText} onClear={() => setText('')} placeholder={copy.search.placeholder} autoFocus />

      {filters.length > 0 && (
        <div className={s.row}>
          <span className="u-muted">{copy.search.applied}</span>
          {filters.map((f) => <Chip key={f.label} removable title={copy.search.removeFilter} onClick={() => setRemoved((r) => [...r, f.label])}>{f.label}</Chip>)}
        </div>
      )}

      {!hasQuery && (
        <div className={s.explore}>
          <span className="u-muted">{copy.search.explore}</span>
          <div className={s.row}>{copy.search.suggestions.map((x) => <Chip key={x} onClick={() => setText(x)}>{x}</Chip>)}</div>
        </div>
      )}

      {hasQuery && (
        <Status loading={search.loading} error={search.error} onRetry={search.retry}>
          {results.length ? (
            <>
              <span className="u-muted">{copy.search.results(results.length)}</span>
              <div className={s.results}>{results.map((t) => <ResultCard key={t.id} title={t} />)}</div>
            </>
          ) : (
            <EmptyState>{copy.search.empty}</EmptyState>
          )}
        </Status>
      )}
    </div>
  );
}
