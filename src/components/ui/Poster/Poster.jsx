'use client';
import { posterSizes } from '@/theme/tokens';
import { posterBackground } from '@/utils/poster';
import { cx } from '@/utils/cx';
import s from './Poster.module.css';

/**
 * Póster del título. size: xs | sm | md | lg | fluid (tokens.posterSizes)
 * Con imagen real el nombre ya viene en el arte; el texto solo se pinta sobre el degradado.
 */
export default function Poster({ title, size = 'md', showTitle = false, onClick, className, children }) {
  const dim = posterSizes[size];
  const style = {
    width: dim.width,
    height: dim.height,
    aspectRatio: dim.aspectRatio,
    borderRadius: `var(--radius-${dim.radius})`,
    background: posterBackground(title.hues ?? [220, 260]),
  };
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} className={cx(s.poster, className)} style={style} onClick={onClick} aria-label={title.title}>
      {title.image && <img className={s.img} src={title.image} alt="" loading="lazy" decoding="async" />}
      {showTitle && !title.image && <span className={cx(s.title, s[size])}>{title.title}</span>}
      {children}
    </Tag>
  );
}
