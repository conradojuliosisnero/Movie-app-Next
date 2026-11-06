'use client';
import { cx } from '@/utils/cx';
import s from './Card.module.css';

/** variant: surface (contenido) | glass (solo capas flotantes) */
export default function Card({ variant = 'surface', padding = 5, radius = 'xl', className, style, children, as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={cx(variant === 'glass' ? 'u-glass' : 'u-surface', s.card, className)}
      style={{ padding: `var(--space-${padding})`, borderRadius: `var(--radius-${radius})`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
