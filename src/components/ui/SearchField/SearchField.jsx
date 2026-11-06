'use client';
import Icon from '../Icon/Icon';
import Button from '../Button/Button';
import { copy } from '@/i18n';
import s from './SearchField.module.css';

export default function SearchField({ value, onChange, onClear, placeholder, autoFocus, onSubmit, submitLabel }) {
  return (
    <form className={`u-surface ${s.field}`} onSubmit={(e) => { e.preventDefault(); onSubmit?.(value); }}>
      <Icon name="search" size="md" className={s.icon} />
      <input className={s.input} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} aria-label={placeholder} />
      {value && onClear && <Button size="sm" onClick={onClear}>{copy.common.clear}</Button>}
      {submitLabel && <Button type="submit" variant="primary">{submitLabel}</Button>}
    </form>
  );
}
