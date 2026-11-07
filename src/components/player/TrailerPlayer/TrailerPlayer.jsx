'use client';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button/Button';
import { gsap, useGSAP, DUR, motionOK } from '@/lib/motion';
import WatchParty from '../WatchParty/WatchParty';
import { useUI } from '@/store/UIContext';
import { useSession } from '@/store/SessionContext';
import { useTitleActions } from '@/hooks/useTitleActions';
import { useLibrary } from '@/store/LibraryContext';
import { useToast } from '@/store/ToastContext';
import { DEFAULT_MINUTES, POINTS, WATCH_SHARE } from '@/services/ranking';
import { useTitleDetails } from '@/hooks/useCatalogData';
import { useKeyboard } from '@/hooks/useKeyboard';
import { posterBackground } from '@/utils/poster';
import { APP, FULL_PLAYER } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './TrailerPlayer.module.css';

// Reproductor: tráiler de YouTube (mode 'trailer') o título completo (mode 'full').
export default function TrailerPlayer() {
  const ui = useUI();
  const p = ui.player;
  useKeyboard({ Escape: ui.closePlayer }, !!p);
  if (!p) return null;
  return <Player key={`${p.item.id}-${p.mode}`} />;
}

function Player() {
  const ui = useUI();
  const { profile } = useSession();
  const act = useTitleActions();
  const { item, mode, season = 1, ep = 1 } = ui.player;
  const details = useTitleDetails(item.id);
  const t = details.data ?? item;
  const isSeries = t.type === 'series';
  const typeLabel = (isSeries ? copy.common.series : copy.common.movie).toUpperCase();
  const overlayRef = useRef(null);

  useGSAP(() => {
    if (!motionOK()) return;
    gsap.from(overlayRef.current, { autoAlpha: 0, duration: DUR.base });
    gsap.from('[data-stage]', { scale: 0.92, y: 20, duration: DUR.slow, ease: 'spring' });
    gsap.from('[data-controls]', { y: 30, autoAlpha: 0, duration: DUR.slow, ease: 'standard', delay: 0.1 });
  }, { scope: overlayRef });

  const finish = (fn) => { fn(t); ui.closePlayer(); };
  const goEpisode = (s2, e2) => ui.openPlayer(t, { mode: 'full', season: s2, ep: e2 });
  const seasonInfo = t.seasons?.find((x) => x.n === season);
  const prev = ep > 1 ? [season, ep - 1] : null;
  const next = seasonInfo && ep < seasonInfo.episodes ? [season, ep + 1] : t.seasons?.find((x) => x.n === season + 1) ? [season + 1, 1] : null;

  let src = null;
  if (mode === 'full') src = isSeries ? FULL_PLAYER.series(t.tmdbId, season, ep) : FULL_PLAYER.movie(t.tmdbId);
  else if (t.trailerKey) src = `https://www.youtube-nocookie.com/embed/${t.trailerKey}?autoplay=1&rel=0&modestbranding=1`;

  // Puntos por verla completa: el reproductor tiene que haber cargado y seguir abierto y a la vista
  // la mitad de la duración (si el servicio no carga, no cuenta).
  const lib = useLibrary();
  const { show } = useToast();
  const [frameReady, setFrameReady] = useState(false);
  useEffect(() => setFrameReady(false), [src]);
  const watchKey = mode === 'full' && frameReady ? (isSeries ? `${t.id}:${season}:${ep}` : t.id) : null;
  const minutes = (isSeries ? t.episodeMinutes || DEFAULT_MINUTES.episode : t.minutes || DEFAULT_MINUTES.movie) * WATCH_SHARE;
  useEffect(() => {
    if (!watchKey || lib.watched[watchKey]) return undefined;
    let seconds = 0;
    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      seconds += 1;
      if (seconds < minutes * 60) return;
      clearInterval(id);
      lib.markWatched(watchKey);
      show(copy.ranking.watchedToast(POINTS.watched));
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchKey]);

  const badge = ui.party.active
    ? copy.player.roomBadge(profile?.name ?? '')
    : [typeLabel, t.year, mode === 'full' && isSeries && copy.player.episode(season, ep)].filter(Boolean).join(' · ');

  return (
    <div ref={overlayRef} className={s.overlay} role="dialog" aria-modal="true" aria-label={t.title}>
      {/* Barra superior fuera del video, para no tapar los controles de YouTube. */}
      <div className={s.top}>
        <div className={s.heading}>
          <b className={s.headingTitle}>{t.title}</b>
          <span className={s.badge}>{badge}</span>
        </div>
        <Button variant="media" icon="close" aria-label={copy.common.close} onClick={ui.closePlayer} />
      </div>
      <div data-stage className={s.stage} style={{ background: posterBackground(t.hues ?? [220, 260]) }}>
        {src ? (
          <iframe
            key={src}
            className={s.frame}
            src={src}
            title={t.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox={mode === 'full' && FULL_PLAYER.sandbox ? FULL_PLAYER.sandbox : undefined}
            onLoad={() => setFrameReady(true)}
          />
        ) : details.loading ? (
          <div className={s.shimmer} role="status" aria-label={copy.common.loading} />
        ) : (
          <>
            <div className={s.vignette} />
            <div className={s.center}>
              <span className={s.official}>{copy.player.noTrailer}</span>
              <h2 className={s.title}>{t.title}</h2>
            </div>
          </>
        )}
      </div>

      <div data-controls className={cx('u-media-glass', s.controls)}>
        {mode === 'trailer' ? (
          <>
            <b className={s.askTitle}>{copy.player.convinced}</b>
            <Button variant="media" icon="dismiss" onClick={() => finish(act.dismiss)}>{copy.player.no}</Button>
            <Button variant="media" icon="seen" onClick={() => finish(act.markSeen)}>{copy.common.seen}</Button>
            <Button variant="primary" icon="save" onClick={() => finish(act.save)}>{copy.common.save}</Button>
            <span className={s.spacer} />
            <Button variant="media" icon="full" onClick={() => ui.openPlayer(t, { mode: 'full', season, ep })}>{copy.common.watchFull}</Button>
          </>
        ) : (
          <>
            <span className={s.official}>{copy.player.full}</span>
            {isSeries && (
              <>
                <Button variant="media" icon="back" disabled={!prev} onClick={() => prev && goEpisode(...prev)} aria-label="Episodio anterior" />
                <Button variant="media" iconRight="forward" disabled={!next} onClick={() => next && goEpisode(...next)}>{next ? copy.player.episode(...next) : copy.player.episode(season, ep)}</Button>
                <Button variant="media" icon="seen" onClick={() => act.markEpisode(t, season, ep)}>{copy.home.markEpisode(ep)}</Button>
              </>
            )}
            <span className={s.spacer} />
            {t.trailerKey && <Button variant="media" icon="play" onClick={() => ui.openPlayer(t)}>{copy.common.trailer}</Button>}
          </>
        )}
        {APP.features.watchParty && <Button variant="media" icon="party" active={ui.party.active} onClick={ui.toggleParty}>{copy.common.watchParty}</Button>}
      </div>
      {APP.features.watchParty && ui.party.active && <WatchParty />}
    </div>
  );
}
