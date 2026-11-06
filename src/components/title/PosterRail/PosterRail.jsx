'use client';
import { useRef } from 'react';
import PosterCard from '@/components/title/PosterCard/PosterCard';
import Poster from '@/components/ui/Poster/Poster';
import { useUI } from '@/store/UIContext';
import { useTitleActions } from '@/hooks/useTitleActions';
import { useEndReached, useRailMotion } from '@/hooks/useRailMotion';
import { STATUS } from '@/config/app.config';
import { copy } from '@/i18n';
import s from './PosterRail.module.css';

/**
 * Fila horizontal de pósters. La información, “Guardar” y “Ya la vi” aparecen al pasar el mouse; con mouse se puede arrastrar.
 * Con onLoadMore, al llegar al final (deslizando o arrastrando) se cargan más títulos.
 */
export default function PosterRail({ titles, withSave = false, size = 'md', onLoadMore, hasMore = false, loadingMore = false }) {
  const ui = useUI();
  const act = useTitleActions();
  const ref = useRef(null);
  const sentinel = useRef(null);
  useRailMotion(ref, titles.length);
  useEndReached(ref, sentinel, onLoadMore, !!onLoadMore && hasMore && !loadingMore);

  return (
    <div ref={ref} className="u-hscroll">
      {titles.map((t) => {
        if (size === 'sm') return <Poster key={t.id} title={t} size="sm" onClick={() => ui.openDetail(t)} />;
        const status = act.statusOf(t);
        const actions = withSave ? [
          { key: 'save', label: status === STATUS.WANT ? copy.common.saved : copy.common.save, icon: 'save', active: status === STATUS.WANT, onClick: () => act.save(t) },
          { key: 'seen', label: status === STATUS.SEEN ? copy.common.seenDone : copy.common.seen, icon: 'seen', active: status === STATUS.SEEN, onClick: () => act.markSeen(t) },
        ] : [];
        return <PosterCard key={t.id} title={t} actions={actions} />;
      })}
      {onLoadMore && hasMore && (
        <div ref={sentinel} data-sentinel className={s.more} aria-label={copy.common.loading} role="status">
          <span className={s.spinner} />
        </div>
      )}
    </div>
  );
}
