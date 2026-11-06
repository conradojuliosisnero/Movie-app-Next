'use client';
import Icon from '../Icon/Icon';
import { cx } from '@/utils/cx';
import s from './Chip.module.css';

export default function Chip({ active = false, removable = false, onClick, children, ...rest }) {
  return (
    <button type="button" aria-pressed={active} className={cx(s.chip, active && s.active)} onClick={onClick} {...rest}>
      {children}
      {removable && <Icon name="close" size="xs" className={s.x} />}
    </button>
  );
}
