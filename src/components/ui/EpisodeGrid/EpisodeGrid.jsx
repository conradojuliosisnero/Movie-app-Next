'use client';
import { cx } from '@/utils/cx';
import s from './EpisodeGrid.module.css';

export default function EpisodeGrid({ total, watched, onToggle }) {
  return (
    <div className={s.grid}>
      {Array.from({ length: total }, (_, i) => (
        <button key={i} type="button" aria-pressed={i < watched} className={cx(s.ep, i < watched && s.on)} onClick={() => onToggle(i + 1)}>
          {i + 1}
        </button>
      ))}
    </div>
  );
}
