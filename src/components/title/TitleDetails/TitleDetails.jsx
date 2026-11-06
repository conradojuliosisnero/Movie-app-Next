'use client';
// Contenido de la ficha de un título. Se usa en el panel lateral (variant="sheet")
// y en su página propia /titulo/[id] (variant="page").
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button/Button';
import Chip from '@/components/ui/Chip/Chip';
import EpisodeGrid from '@/components/ui/EpisodeGrid/EpisodeGrid';
import Stars from '@/components/ui/Stars/Stars';
import Avatar from '@/components/ui/Avatar/Avatar';
import Status from '@/components/ui/Status/Status';
import PosterRail from '@/components/title/PosterRail/PosterRail';
import { useUI } from '@/store/UIContext';
import { useLibrary } from '@/store/LibraryContext';
import { useSession } from '@/store/SessionContext';
import { useToast } from '@/store/ToastContext';
import { useTitleActions } from '@/hooks/useTitleActions';
import { useTitleDetails } from '@/hooks/useCatalogData';
import { usePaged } from '@/hooks/usePaged';
import { nextEpisode, pickSuggestion, watchedIn, episodesWatched, getRecommendations } from '@/services/catalog';
import { posterBackground } from '@/utils/poster';
import { titleGenres, titleMeta } from '@/utils/format';
import { APP, ROUTES, STATUS } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './TitleDetails.module.css';

async function share(t, show) {
  const url = `${window.location.origin}${ROUTES.title(t.id)}`;
  try {
    if (navigator.share) await navigator.share({ title: t.title, url });
    else { await navigator.clipboard.writeText(url); show(copy.toasts.shared); }
  } catch { /* la persona canceló */ }
}

/**
 * item: título completo o solo { id } · proposed: viene de “Sugerirme algo”
 * onBack: botón Volver · heroRef: para arrastrar la cabecera (panel) · heroAction: botón extra arriba a la derecha
 */
export default function TitleDetails({ item, proposed = false, variant = 'sheet', onBack, heroRef, heroAction }) {
  const ui = useUI();
  const lib = useLibrary();
  const { profile } = useSession();
  const { show } = useToast();
  const act = useTitleActions();
  const details = useTitleDetails(item.id);
  const t = details.data ? { ...details.data, reason: item.reason } : item;
  const [season, setSeason] = useState(null);
  const [suggesting, setSuggesting] = useState(false);
  // Similares: la página 1 llega con la ficha; al deslizar hasta el final se piden más.
  const similar = usePaged((page) => (page === 1 ? Promise.resolve(details.data?.recommendations ?? []) : getRecommendations(item.id, page)), details.data ? item.id : null);

  // Mantener actualizada la copia guardada en la lista (temporadas nuevas, duración).
  useEffect(() => {
    if (details.data && lib.items[item.id]) lib.updateItem(details.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details.data]);

  const status = lib.statuses[t.id];
  const progress = lib.progress[t.id];
  const isSeries = t.type === 'series';
  const typeLabel = (isSeries ? copy.common.series : copy.common.movie).toUpperCase();
  const currentSeason = season ?? progress?.season ?? t.seasons?.[0]?.n;
  const seasonInfo = t.seasons?.find((x) => x.n === currentSeason);
  const firstProvider = t.providers?.[0];
  const next = isSeries && t.seasons ? nextEpisode(t, progress) ?? { season: t.seasons[0].n, ep: 1 } : null;
  const isPage = variant === 'page';

  const another = async () => {
    setSuggesting(true);
    try {
      const n = await pickSuggestion({ excludeId: t.id, profile, lib });
      if (n) ui.openDetail(n, { proposed: true });
      else show(copy.toasts.allSeen);
    } catch { show(copy.common.error); } finally { setSuggesting(false); }
  };

  const fallback = posterBackground(t.hues ?? [220, 260]);
  const backdrop = isPage ? t.backdrop?.replace('/w780/', '/original/') : t.backdrop;
  const heroBg = backdrop ? `url(${backdrop}) center / cover, ${fallback}` : fallback;

  return (
    <div className={cx(s.details, isPage && s.page)}>
      <div ref={heroRef} className={s.hero} style={{ background: heroBg }}>
        {onBack && <Button variant="media" icon="back" className={s.back} onClick={onBack}>{copy.common.back}</Button>}
        {heroAction && <div className={s.heroAction}>{heroAction}</div>}
        {t.title && (
          <div className={s.heroInfo}>
            {isPage && t.image && <img className={s.heroPoster} src={t.image} alt="" />}
            <div className={s.heroText}>
              <span className={s.eyebrow}>{typeLabel}{t.genres?.length ? ` · ${titleGenres(t).toUpperCase()}` : ''}</span>
              <h1 className={s.title}>{t.title}</h1>
              <span className={s.meta}>{titleMeta(t)}{t.rating ? ` · ${copy.detail.rating(t.rating)}` : ''}</span>
            </div>
          </div>
        )}
      </div>

      <div className={s.body}>
        <Status loading={details.loading && !t.title} error={details.error && !t.title ? details.error : null} onRetry={details.retry}>
          {(proposed || t.reason) && (
            <div className={s.reason}>
              <span className={s.reasonLabel}>{proposed ? copy.detail.proposed : copy.detail.why}</span>
              {t.reason && <p>{copy.detail.because(t.reason)}</p>}
            </div>
          )}
          {t.tagline && <p className={s.tagline}>{t.tagline}</p>}
          {t.synopsis && <p className={s.synopsis}>{t.synopsis}</p>}

          <div className={s.actions}>
            <Button variant="inverse" size="lg" icon="play" onClick={() => ui.openPlayer(t)}>{copy.common.trailer}</Button>
            <Button size="lg" icon="full" onClick={() => ui.openPlayer(t, { mode: 'full', season: next?.season, ep: next?.ep })}>
              {isSeries && next ? `${copy.common.watchFull} · ${copy.player.episode(next.season, next.ep)}` : copy.common.watchFull}
            </Button>
            <Button size="lg" icon="save" active={status === STATUS.WANT} onClick={() => act.save(t)}>{copy.detail.saveToList}</Button>
            <Button size="lg" icon="seen" active={status === STATUS.SEEN} onClick={() => act.markSeen(t)}>{copy.common.seen}</Button>
            <Button size="lg" variant="ghost" active={status === STATUS.DISMISSED} onClick={() => act.dismiss(t)}>{copy.common.dismiss}</Button>
            <Button size="lg" variant="ghost" icon="share" aria-label={copy.common.share} onClick={() => share(t, show)} />
          </div>

          {proposed && <Button variant="outline" icon="replay" className={s.another} disabled={suggesting} onClick={another}>{suggesting ? copy.home.suggesting : copy.detail.another}</Button>}

          <div className={s.columns}>
            {details.data && (
              <div className={s.where}>
                <span className="u-eyebrow">{copy.detail.whereToWatch}</span>
                {t.providers.length > 0 && (
                  <div className={s.providers}>
                    {t.providers.map((p) => (
                      <span key={p.id} className={s.provider}>
                        {p.logo && <img src={p.logo} alt="" className={s.logo} />}{p.name}
                      </span>
                    ))}
                  </div>
                )}
                {!t.providers.length && <span className="u-muted">{t.rentOrBuy ? copy.detail.rentOrBuy : copy.detail.notStreaming}</span>}
                <div className={s.row}>
                  {t.watchLink && (firstProvider || t.rentOrBuy) && (
                    <Button href={t.watchLink} target="_blank" rel="noopener noreferrer" variant="primary" iconRight="external">
                      {firstProvider ? copy.common.watchOn(firstProvider.name) : copy.common.watchOptions}
                    </Button>
                  )}
                  {APP.features.watchParty && <Button icon="party" onClick={() => ui.openPlayer(t, { party: true })}>{copy.common.watchParty}</Button>}
                </div>
              </div>
            )}

            {status === STATUS.SEEN ? (
              <div className={s.block}>
                <b>{copy.detail.yourRating}</b>
                <Stars size="lg" value={lib.ratings[t.id] || 0} onChange={(v) => lib.setRating(t.id, v)} />
                <input className={s.review} value={lib.reviews[t.id] || ''} onChange={(e) => lib.setReview(t.id, e.target.value)} placeholder={copy.library.reviewPlaceholder} aria-label={copy.library.reviewPlaceholder} />
              </div>
            ) : (
              <p className={s.hint}>{copy.detail.rateHint}</p>
            )}
          </div>

          {isSeries && seasonInfo && (
            <div className={s.block}>
              {t.seasons.length > 1 && (
                <div className={s.seasons}>
                  {t.seasons.map((x) => <Chip key={x.n} active={x.n === currentSeason} onClick={() => setSeason(x.n)}>{copy.detail.season(x.n)}</Chip>)}
                </div>
              )}
              <div className={s.blockHead}>
                <b>{copy.detail.season(seasonInfo.n)}</b>
                <span className="u-muted">{copy.detail.progress(episodesWatched(t, progress), t.episodes)}</span>
              </div>
              <EpisodeGrid total={seasonInfo.episodes} watched={Math.min(seasonInfo.episodes, watchedIn(progress, seasonInfo.n))} onToggle={(n) => act.markEpisode(t, seasonInfo.n, n)} />
              <Link className={s.seasonLink} href={ROUTES.season(t.tmdbId, seasonInfo.n)}>{copy.detail.seasonLink} ›</Link>
            </div>
          )}

          {t.cast?.length > 0 && (
            <div className={s.block}>
              <b>{copy.detail.cast}</b>
              <div className="u-hscroll">
                {t.cast.map((c) => (
                  <Link key={c.id} href={ROUTES.person(c.id)} className={s.castItem}>
                    {c.photo ? <img src={c.photo} alt="" className={s.castPhoto} loading="lazy" /> : <Avatar name={c.name} hue={(c.id * 37) % 360} size="xl" />}
                    <span className={s.castName}>{c.name}</span>
                    <span className={s.castRole}>{c.role}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {similar.items.length > 0 && (
            <div className={s.block}>
              <b>{copy.detail.similar}</b>
              <PosterRail titles={similar.items.map((r) => ({ ...r, reason: copy.reasons.similar }))} withSave={isPage} onLoadMore={similar.loadMore} hasMore={!similar.done} loadingMore={similar.loading} />
            </div>
          )}
        </Status>
      </div>
    </div>
  );
}
