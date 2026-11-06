'use client';
import Card from '@/components/ui/Card/Card';
import Poster from '@/components/ui/Poster/Poster';
import Button from '@/components/ui/Button/Button';
import { useUI } from '@/store/UIContext';
import { useTitleActions } from '@/hooks/useTitleActions';
import { releaseLabel, titleGenres } from '@/utils/format';
import { STATUS } from '@/config/app.config';
import { copy } from '@/i18n';
import s from './ReleaseCard.module.css';

export default function ReleaseCard({ title: t }) {
  const ui = useUI();
  const act = useTitleActions();
  const saved = act.statusOf(t) === STATUS.WANT;
  return (
    <Card padding={4} radius="xl" className={s.card}>
      <Poster title={t} size="sm" onClick={() => ui.openDetail(t)} />
      <div className={s.info}>
        <span className={s.date}>{releaseLabel(t.releaseDate)}</span>
        <b className={s.name}>{t.title}</b>
        <span className="u-muted">{titleGenres(t)}</span>
      </div>
      <Button size="sm" icon="save" active={saved} onClick={() => act.save(t)}>{saved ? copy.common.saved : copy.common.save}</Button>
    </Card>
  );
}
