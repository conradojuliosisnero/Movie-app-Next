'use client';
import EmptyState from '../EmptyState/EmptyState';
import Button from '../Button/Button';
import Skeleton from '../Skeleton/Skeleton';
import { copy } from '@/i18n';
import s from './Status.module.css';

/**
 * Muestra carga (esqueleto con la forma del contenido) o error de una petición; si todo salió bien, pinta children.
 * skeleton: rail | hero | cards | detail | person | episodes | chips | lines
 */
export default function Status({ loading, error, onRetry, rail = false, skeleton = rail ? 'rail' : 'lines', children }) {
  if (error) {
    return (
      <EmptyState>
        <p>{copy.common.error}</p>
        {onRetry && <Button size="sm" className={s.retry} onClick={onRetry}>{copy.common.retry}</Button>}
      </EmptyState>
    );
  }
  if (loading) return <Skeleton kind={skeleton} />;
  return children;
}
