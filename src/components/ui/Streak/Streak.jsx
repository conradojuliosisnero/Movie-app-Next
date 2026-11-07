'use client';
// Racha diaria al estilo TikTok: una llama con degradado que titila y el número de días seguidos.
// Apagada (gris) si la racha se perdió. Cuando sube hoy, la llama da un salto.
import { useId } from 'react';
import { useLibrary } from '@/store/LibraryContext';
import { currentStreak } from '@/services/ranking';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './Streak.module.css';

export function Flame({ lit = true, className }) {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" className={cx(s.flame, lit && s.lit, className)} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0" stopColor={lit ? '#ff2d6f' : '#6b6b75'} />
          <stop offset=".55" stopColor={lit ? '#ff7a1a' : '#8a8a94'} />
          <stop offset="1" stopColor={lit ? '#ffd23f' : '#a9a9b2'} />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d="M12.6 1.8c.6 3.4-1.3 5.3-2.9 7.1C8 10.8 6.5 12.7 6.5 15.5 6.5 19.2 9 22 12 22s5.5-2.8 5.5-6.4c0-2.7-1.2-4.6-2.7-6.3-.3 1.6-1 2.7-2.2 3.4.5-3.8-.6-7.8-2-10.9z" />
      <path className={s.core} fill="#fff" fillOpacity=".55" d="M12 12.6c1.7 1.5 2.7 2.8 2.7 4.5A2.7 2.7 0 0 1 12 20a2.7 2.7 0 0 1-2.7-2.9c0-1.7 1.2-2.9 2.7-4.5z" />
    </svg>
  );
}

/** Píldora para la cabecera. */
export function StreakBadge({ onClick, className }) {
  const lib = useLibrary();
  const days = currentStreak(lib.activity);
  return (
    <button type="button" data-streak className={cx(s.badge, lib.visited && s.pop, className)} onClick={onClick} aria-label={copy.ranking.streak.badge(days)}>
      <Flame lit={days > 0} />
      <b className={s.count}>{days}</b>
    </button>
  );
}

/** Tarjeta grande: llama, días seguidos y los 7 puntos de la semana hacia el bono. */
export function StreakCard() {
  const lib = useLibrary();
  const days = currentStreak(lib.activity);
  const inWeek = days === 0 ? 0 : days % 7 || 7;
  const left = 7 - inWeek;
  return (
    <div className={cx(s.card, lib.visited && s.pop)}>
      <Flame lit={days > 0} className={s.big} />
      <div className={s.cardText}>
        <span className={s.days}><b>{days}</b> {copy.ranking.streak.label(days)}</span>
        <div className={s.week} aria-label={copy.ranking.streak.toWeek(left)}>
          {Array.from({ length: 7 }, (_, i) => <span key={i} className={cx(s.dot, i < inWeek && s.dotOn)} style={{ '--i': i }} />)}
        </div>
        <span className="u-muted">{left === 0 ? copy.ranking.streak.weekDone : copy.ranking.streak.toWeek(left)} · {copy.ranking.streak.best(lib.activity.best ?? 0)}</span>
      </div>
    </div>
  );
}
