'use client';
import s from './EmptyState.module.css';

export default function EmptyState({ children }) {
  return <div className={`u-surface ${s.empty}`}>{children}</div>;
}
