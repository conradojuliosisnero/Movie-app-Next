'use client';
import { APP } from '@/config/app.config';
import s from './Logo.module.css';

export default function Logo({ size = 'md', onClick }) {
  const [a, b] = APP.nameParts;
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag type={onClick ? 'button' : undefined} className={`${s.logo} ${s[size]}`} onClick={onClick} aria-label={APP.name}>
      {a}<span className={s.accent}>{b}</span>
    </Tag>
  );
}
