'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader';
import SearchField from '@/components/ui/SearchField/SearchField';
import Segmented from '@/components/ui/Segmented/Segmented';
import Card from '@/components/ui/Card/Card';
import Poster from '@/components/ui/Poster/Poster';
import PosterCard from '@/components/title/PosterCard/PosterCard';
import Button from '@/components/ui/Button/Button';
import EpisodeGrid from '@/components/ui/EpisodeGrid/EpisodeGrid';
import Stars from '@/components/ui/Stars/Stars';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import { useLibraryLists } from '@/hooks/useLibraryLists';
import { useTitleActions } from '@/hooks/useTitleActions';
import { useLibrary } from '@/store/LibraryContext';
import { useSession } from '@/store/SessionContext';
import { useUI } from '@/store/UIContext';
import { nextEpisode, watchedIn } from '@/services/catalog';
import { dayMonth, titleMeta, todayISO } from '@/utils/format';
import { ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';
import s from './LibraryPage.module.css';

const TABS = ['watching', 'want', 'seen'];
const TYPES = ['all', 'movie', 'series'];

// Sin tildes ni mayúsculas, para que “accion” encuentre “Acción”.
const fold = (x) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function LibraryPage() {
  const lists = useLibraryLists();
  const lib = useLibrary();
  const ui = useUI();
  const act = useTitleActions();
  const { profile } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const tab = TABS.includes(params.get('tab')) ? params.get('tab') : 'watching';
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const counts = { watching: lists.watching.length, want: lists.wantList.length, seen: lists.seenList.length };

  const q = fold(query.trim());
  const matches = (t) => (!q || fold(t.title).includes(q)) && (type === 'all' || t.type === type);
  const source = { watching: lists.watching, want: lists.wantList, seen: lists.seenList }[tab];
  const visible = source.filter(matches);
  // En “Todo” se muestran dos secciones: películas y series.
  const groups = type === 'all' && tab !== 'watching'
    ? [{ key: 'movie', items: visible.filter((t) => t.type === 'movie') }, { key: 'series', items: visible.filter((t) => t.type === 'series') }].filter((g) => g.items.length)
    : [{ key: null, items: visible }];

  const renderWant = (items) => (
    <div className={s.grid}>
      {items.map((t) => (
        <PosterCard key={t.id} title={t} size="fluid" action={{ label: copy.library.remove, icon: 'dismiss', onClick: () => act.save(t) }} />
      ))}
    </div>
  );

  const renderSeen = (items) => (
    <Card padding={2} radius="xl" className={s.diary}>
      {items.map((t) => {
        const d = dayMonth(lib.seenAt[t.id] || todayISO());
        return (
          <div key={t.id} className={s.diaryRow}>
            <div className={s.date}><span className={s.day}>{d.day}</span><span className={s.month}>{d.month}</span></div>
            <Poster title={t} size="xs" onClick={() => ui.openDetail(t)} />
            <div className={s.diaryInfo}><b>{t.title}</b><span className="u-muted">{titleMeta(t)}</span></div>
            <Stars value={lib.ratings[t.id] || 0} onChange={(v) => lib.setRating(t.id, v)} />
            <input className={s.review} value={lib.reviews[t.id] || ''} onChange={(e) => lib.setReview(t.id, e.target.value)} placeholder={copy.library.reviewPlaceholder} aria-label={`${copy.library.reviewPlaceholder} ${t.title}`} />
          </div>
        );
      })}
    </Card>
  );

  const renderWatching = (items) => (
    <div className={s.stack}>
      {items.map((t) => {
        const progress = lib.progress[t.id];
        const next = nextEpisode(t, progress);
        const season = t.seasons?.find((x) => x.n === (progress?.season ?? t.seasons[0].n));
        return (
          <Card key={t.id} padding={4} radius="xl" className={s.watchCard}>
            <Poster title={t} size="sm" onClick={() => ui.openDetail(t)} />
            <div className={s.watchInfo}>
              {season ? (
                <>
                  <div className={s.watchHead}><b className={s.name}>{t.title}</b><span className="u-muted">{copy.library.season(season.n, Math.min(season.episodes, watchedIn(progress, season.n)), season.episodes)}</span></div>
                  <EpisodeGrid total={season.episodes} watched={Math.min(season.episodes, watchedIn(progress, season.n))} onToggle={(n) => act.markEpisode(t, season.n, n)} />
                </>
              ) : <b className={s.name}>{t.title}</b>}
            </div>
            {next && <Button icon="play" onClick={() => ui.openPlayer(t, { mode: 'full', season: next.season, ep: next.ep })}>{copy.player.episode(next.season, next.ep)}</Button>}
          </Card>
        );
      })}
    </div>
  );

  const render = { watching: renderWatching, want: renderWant, seen: renderSeen }[tab];

  return (
    <div className={s.page}>
      <PageHeader
        eyebrow={profile.name}
        title={copy.library.title}
        action={<Segmented label={copy.library.title} value={tab} onChange={(v) => router.replace(`${ROUTES.library}?tab=${v}`, { scroll: false })} options={TABS.map((k) => ({ value: k, label: `${copy.library.tabs[k]} ${counts[k]}` }))} />}
      />

      {source.length > 0 && (
        <div className={s.toolbar}>
          <div className={s.search}>
            <SearchField value={query} onChange={setQuery} onClear={() => setQuery('')} placeholder={copy.library.searchPlaceholder} />
          </div>
          {tab !== 'watching' && (
            <Segmented label={copy.library.typeLabel} value={type} onChange={setType} options={TYPES.map((k) => ({ value: k, label: copy.library.types[k] }))} />
          )}
        </div>
      )}

      {!source.length && <EmptyState>{copy.library.empty[tab]}</EmptyState>}
      {source.length > 0 && !visible.length && <EmptyState>{copy.library.noMatch(query.trim())}</EmptyState>}

      {visible.length > 0 && groups.map((g) => (
        <section key={g.key ?? 'all'} className={s.group}>
          {g.key && <SectionHeader title={`${copy.library.types[g.key]} · ${g.items.length}`} />}
          {render(g.items)}
        </section>
      ))}
    </div>
  );
}
