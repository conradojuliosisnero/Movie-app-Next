'use client';
import { useRef } from 'react';
import { useIndicator } from '@/hooks/useIndicator';
import { cx } from '@/utils/cx';
import s from './Segmented.module.css';

export default function Segmented({ options, value, onChange, label }) {
  const box = useRef(null);
  const pill = useRef(null);
  useIndicator(box, pill, '[aria-selected="true"]', value);
  return (
    <div ref={box} className={`u-surface ${s.wrap}`} role="tablist" aria-label={label}>
      <span ref={pill} className={s.pill} aria-hidden="true" />
      {options.map((o) => (
        <button key={o.value} type="button" role="tab" aria-selected={value === o.value} className={cx(s.item, value === o.value && s.active)} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
