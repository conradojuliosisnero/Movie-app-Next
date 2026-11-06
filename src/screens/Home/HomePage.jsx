'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader';
import Card from '@/components/ui/Card/Card';
import Chip from '@/components/ui/Chip/Chip';
import Button from '@/components/ui/Button/Button';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import Status from '@/components/ui/Status/Status';
import ContinueCard from '@/components/title/ContinueCard/ContinueCard';
import PosterRail from '@/components/title/PosterRail/PosterRail';
import ReleaseCard from '@/components/title/ReleaseCard/ReleaseCard';
import { useSession } from '@/store/SessionContext';
import { useLibrary } from '@/store/LibraryContext';
import { useUI } from '@/store/UIContext';
import { useToast } from '@/store/ToastContext';
import { useLibraryLists } from '@/hooks/useLibraryLists';
import { useAsync } from '@/hooks/useAsync';
import { usePaged } from '@/hooks/usePaged';
import { getForYou, getNowPlaying, getTrending, getUpcoming, pickSuggestion } from '@/services/catalog';
import { MOODS } from '@/data/moods';
import { todayLabel } from '@/utils/format';
import { APP, ROUTES, STATUS } from '@/config/app.config';
import { copy } from '@/i18n';
import s from './HomePage.module.css';

export default function HomePage() {
  const { profile } = useSession();
  const lib = useLibrary();
  const ui = useUI();
  const { show } = useToast();
  const lists = useLibraryLists();
  const router = useRouter();
  const [mood, setMood] = useState(null);
  const [suggesting, setSuggesting] = useState(false);

  const ctxKey = `${profile.id}|${lib.settings.onlyMine}|${lib.myPlatforms.join()}`;
  // Filas que siguen cargando al llegar al final (deslizando o arrastrando).
  const forYou = usePaged((page) => getForYou({ profile, lib }, page), ctxKey);
  const trending = usePaged((page) => getTrending({ profile }, page), `trending|${profile.kids}`);
  const nowPlaying = usePaged(getNowPlaying, profile.kids ? null : 'now');
  const upcoming = useAsync(getUpcoming, profile.kids ? null : 'upcoming');

  // Lo que ya decidiste desaparece de las sugerencias al instante.
  const hide = (t) => lib.statuses[t.id] === STATUS.SEEN || lib.statuses[t.id] === STATUS.DISMISSED;
  const forYouList = forYou.items.filter((t) => !hide(t));
  const more = (p) => ({ onLoadMore: p.loadMore, hasMore: !p.done, loadingMore: p.loading });

  const suggest = async () => {
    setSuggesting(true);
    try {
      const t = await pickSuggestion({ moodId: mood, excludeId: ui.detail?.item.id, profile, lib });
      if (t) ui.openDetail(t, { proposed: true });
      else show(copy.toasts.allSeen);
    } catch {
      show(copy.common.error);
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div className={s.page}>
      <PageHeader eyebrow={`${todayLabel()} · ${profile.name}`} title={copy.home.greeting(profile.name)} />

      {lists.watching.length > 0 && (
        <section className={s.section}>
          <SectionHeader title={copy.home.continue} action={<Button variant="link" iconRight="forward" onClick={() => router.push(ROUTES.library)}>{copy.home.seeList}</Button>} />
          <div className={s.grid}>
            {lists.watching.slice(0, APP.continueWatchingLimit).map((t) => <ContinueCard key={t.id} title={t} />)}
          </div>
        </section>
      )}

      <Card as="section" padding={7} radius="xl" className={s.suggest}>
        <div className={s.suggestText}>
          <h2 className={s.suggestTitle}>{copy.home.suggestTitle}</h2>
          <p className="u-muted">{copy.home.suggestBody}</p>
          <div className={s.chips}>
            {MOODS.filter((m) => !profile.kids || m.id !== 'scare').map((m) => (
              <Chip key={m.id} active={mood === m.id} onClick={() => setMood(mood === m.id ? null : m.id)}>{copy.moods[m.id]}</Chip>
            ))}
          </div>
        </div>
        <Button variant="primary" size="xl" icon="suggest" disabled={suggesting} onClick={suggest}>{suggesting ? copy.home.suggesting : copy.home.suggestCta}</Button>
      </Card>

      <section className={s.section}>
        <SectionHeader title={copy.home.forYou} subtitle={copy.home.forYouHint} />
        <Status rail loading={forYou.loading && !forYou.items.length} error={!forYou.items.length && forYou.error} onRetry={forYou.retry}>
          {forYouList.length ? <PosterRail titles={forYouList} withSave {...more(forYou)} /> : <EmptyState>{copy.home.nothingNew}</EmptyState>}
        </Status>
      </section>

      {lists.wantList.length > 0 && (
        <section className={s.section}>
          <SectionHeader title={copy.home.saved} action={<Button variant="link" iconRight="forward" onClick={() => router.push(`${ROUTES.library}?tab=want`)}>{copy.home.seeAll(lists.wantList.length)}</Button>} />
          <PosterRail titles={lists.wantList.slice(0, APP.railLimit)} />
        </section>
      )}

      <section className={s.section}>
        <SectionHeader title={copy.home.trending} />
        <Status rail loading={trending.loading && !trending.items.length} error={!trending.items.length && trending.error} onRetry={trending.retry}>
          <PosterRail titles={trending.items.filter((t) => !hide(t))} withSave {...more(trending)} />
        </Status>
      </section>

      {!profile.kids && (
        <section className={s.section}>
          <SectionHeader title={copy.home.nowPlaying} />
          <Status rail loading={nowPlaying.loading && !nowPlaying.items.length} error={!nowPlaying.items.length && nowPlaying.error} onRetry={nowPlaying.retry}>
            <PosterRail titles={nowPlaying.items} withSave {...more(nowPlaying)} />
          </Status>
        </section>
      )}

      {!profile.kids && upcoming.data?.length > 0 && (
        <section className={s.section}>
          <SectionHeader title={copy.home.upcoming} />
          <div className={s.grid}>
            {upcoming.data.slice(0, APP.upcomingLimit).map((t) => <ReleaseCard key={t.id} title={t} />)}
          </div>
        </section>
      )}
    </div>
  );
}
