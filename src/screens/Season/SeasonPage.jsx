'use client';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import Chip from '@/components/ui/Chip/Chip';
import Status from '@/components/ui/Status/Status';
import { useAsync } from '@/hooks/useAsync';
import { useTitleDetails } from '@/hooks/useCatalogData';
import { useTitleActions } from '@/hooks/useTitleActions';
import { useLibrary } from '@/store/LibraryContext';
import { useUI } from '@/store/UIContext';
import { getSeason, watchedIn } from '@/services/catalog';
import { longDate } from '@/utils/format';
import { ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './SeasonPage.module.css';

export default function SeasonPage({ seriesId, n }) {
  const series = useTitleDetails(`tv-${seriesId}`);
  const season = useAsync(() => getSeason(seriesId, n), `${seriesId}-${n}`);
  const lib = useLibrary();
  const ui = useUI();
  const act = useTitleActions();
  const router = useRouter();
  const t = series.data;
  const data = season.data;
  const watched = t ? watchedIn(lib.progress[t.id], n) : 0;

  return (
    <Status skeleton="episodes" loading={series.loading || season.loading} error={series.error || season.error} onRetry={() => { series.retry(); season.retry(); }}>
      {t && data && (
        <div className={s.page}>
          <PageHeader
            eyebrow={<button type="button" className={s.seriesLink} onClick={() => ui.openDetail(t)}>{t.title}</button>}
            title={data.name}
            action={<span className="u-muted">{copy.season.episodes(data.episodes.length)}{data.airDate ? ` · ${longDate(data.airDate)}` : ''}</span>}
          />
          {t.seasons?.length > 1 && (
            <div className={s.seasons}>
              {t.seasons.map((x) => (
                <Chip key={x.n} active={x.n === n} onClick={() => router.push(ROUTES.season(seriesId, x.n))}>{copy.detail.season(x.n)}</Chip>
              ))}
            </div>
          )}
          {data.overview && <p className={s.overview}>{data.overview}</p>}

          <div className={s.list}>
            {data.episodes.map((e) => {
              const isWatched = e.n <= watched;
              return (
                <Card key={e.n} padding={3} radius="xl" className={cx(s.episode, isWatched && s.watched)}>
                  <div className={s.still} style={e.still ? { backgroundImage: `url(${e.still})` } : undefined}>
                    <span className={s.number}>{e.n}</span>
                  </div>
                  <div className={s.info}>
                    <b className={s.name}>{e.name}</b>
                    <span className={s.meta}>
                      {[e.airDate && longDate(e.airDate), e.minutes && copy.season.minutes(e.minutes), e.rating && copy.detail.rating(e.rating)].filter(Boolean).join(' · ')}
                    </span>
                    <p className={s.synopsis}>{e.overview || copy.season.noOverview}</p>
                    <div className={s.actions}>
                      <Button size="sm" icon="seen" active={isWatched} onClick={() => act.markEpisode(t, n, e.n)}>{isWatched ? copy.season.watched : copy.season.markUpTo(e.n)}</Button>
                      <Button size="sm" icon="play" onClick={() => ui.openPlayer(t, { mode: 'full', season: n, ep: e.n })}>{copy.common.watchFull}</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </Status>
  );
}
