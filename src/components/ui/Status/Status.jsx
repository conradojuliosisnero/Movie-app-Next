'use client';
import EmptyState from '../EmptyState/EmptyState';
import Button from '../Button/Button';
import { copy } from '@/i18n';
import s from './Status.module.css';

/** Muestra carga o error de una petición; si todo salió bien, pinta children. */
export default function Status({ loading, error, onRetry, rail = false, children }) {
  if (error) {
    return (
      <EmptyState>
        <p>{copy.common.error}</p>
        {onRetry && <Button size="sm" className={s.retry} onClick={onRetry}>{copy.common.retry}</Button>}
      </EmptyState>
    );
  }
  if (loading) {
    return rail
      ? <div className="u-hscroll" aria-busy="true">{Array.from({ length: 6 }, (_, i) => <div key={i} className={s.ghost} />)}</div>
      : <div className={s.loading} role="status">{copy.common.loading}</div>;
  }
  return children;
}
