'use client';
import Card from '@/components/ui/Card/Card';
import Poster from '@/components/ui/Poster/Poster';
import Button from '@/components/ui/Button/Button';
import { useLibrary } from '@/store/LibraryContext';
import { useUI } from '@/store/UIContext';
import { useTitleActions } from '@/hooks/useTitleActions';
import { episodesWatched, nextEpisode } from '@/services/catalog';
import { copy } from '@/i18n';
import s from './ContinueCard.module.css';

export default function ContinueCard({ title: t }) {
  const lib = useLibrary();
  const ui = useUI();
  const act = useTitleActions();
  const progress = lib.progress[t.id];
  const next = nextEpisode(t, progress);
  const pct = t.episodes ? (episodesWatched(t, progress) / t.episodes) * 100 : 0;

  return (
    <Card padding={4} radius="xl" className={s.card}>
      <Poster title={t} size="sm" onClick={() => ui.openDetail(t)} />
      <div className={s.info}>
        <b className={s.name}>{t.title}</b>
        {next && <span className={s.sub}>{copy.home.episodeOf(next.season, next.ep, next.total)}</span>}
        <div className={s.track}><div className={s.fill} style={{ width: `${pct}%` }} /></div>
        {next && (
          <div className={s.row}>
            <Button size="sm" variant="primary" icon="seen" onClick={() => act.markEpisode(t, next.season, next.ep)}>{copy.home.markEpisode(next.ep)}</Button>
            <Button size="sm" icon="play" onClick={() => ui.openPlayer(t, { mode: 'full', season: next.season, ep: next.ep })}>{copy.player.episode(next.season, next.ep)}</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
