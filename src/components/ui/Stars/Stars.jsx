'use client';
import { cx } from '@/utils/cx';
import s from './Stars.module.css';

export default function Stars({ value = 0, onChange, size = 'md', max = 5 }) {
  return (
    <div className={cx(s.stars, s[size])} role="radiogroup">
      {Array.from({ length: max }, (_, i) => (
        <button key={i} type="button" role="radio" aria-checked={value === i + 1} aria-label={`${i + 1}`} className={cx(s.star, i < value && s.on)} onClick={() => onChange?.(i + 1)}>
          ★
        </button>
      ))}
    </div>
  );
}
