'use client';
import Card from '@/components/ui/Card/Card';
import Poster from '@/components/ui/Poster/Poster';
import Button from '@/components/ui/Button/Button';
import { useUI } from '@/store/UIContext';
import { useTitleActions } from '@/hooks/useTitleActions';
import { titleMeta } from '@/utils/format';
import { genreLabel } from '@/data/genres';
import { STATUS } from '@/config/app.config';
import { copy } from '@/i18n';
import s from './ResultCard.module.css';

export default function ResultCard({ title: t }) {
  const ui = useUI();
  const act = useTitleActions();
  const status = act.statusOf(t);
  return (
    <Card padding={3} radius="xl" className={s.card}>
      <Poster title={t} size="sm" onClick={() => ui.openDetail(t)} />
      <div className={s.info}>
        <button type="button" className={s.name} onClick={() => ui.openDetail(t)}>{t.title}</button>
        <span className={s.meta}>{titleMeta(t)}{t.rating ? ` · ${copy.detail.rating(t.rating)}` : ''}</span>
        <p className={s.synopsis}>{t.synopsis}</p>
        <div className={s.footer}>
          <span className={s.platform}>{t.genres?.[0] ? genreLabel(t.genres[0]) : ''}</span>
          <Button size="sm" icon="seen" active={status === STATUS.SEEN} onClick={() => act.markSeen(t)}>{status === STATUS.SEEN ? copy.common.seenDone : copy.common.seen}</Button>
          <Button size="sm" icon="save" active={status === STATUS.WANT} onClick={() => act.save(t)}>{status === STATUS.WANT ? copy.common.saved : copy.common.save}</Button>
        </div>
      </div>
    </Card>
  );
}
