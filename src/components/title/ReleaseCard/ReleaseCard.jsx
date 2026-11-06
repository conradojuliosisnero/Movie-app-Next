'use client';
import Card from '@/components/ui/Card/Card';
import Poster from '@/components/ui/Poster/Poster';
import Switch from '@/components/ui/Switch/Switch';
import { useLibrary } from '@/store/LibraryContext';
import { useToast } from '@/store/ToastContext';
import { useUI } from '@/store/UIContext';
import { releaseLabel, titleGenres } from '@/utils/format';
import { copy } from '@/i18n';
import s from './ReleaseCard.module.css';

export default function ReleaseCard({ title: t }) {
  const lib = useLibrary();
  const ui = useUI();
  const { show } = useToast();
  const on = !!lib.reminders[t.id];
  return (
    <Card padding={4} radius="xl" className={s.card}>
      <Poster title={t} size="sm" onClick={() => ui.openDetail(t)} />
      <div className={s.info}>
        <span className={s.date}>{releaseLabel(t.releaseDate)}</span>
        <b className={s.name}>{t.title}</b>
        <span className="u-muted">{titleGenres(t)}</span>
      </div>
      <label className={s.remind}>
        {copy.common.remind}
        <Switch checked={on} label={copy.common.remind} onChange={() => { lib.toggleReminder(t); show(on ? copy.toasts.remindOff : copy.toasts.remindOn); }} />
      </label>
    </Card>
  );
}
