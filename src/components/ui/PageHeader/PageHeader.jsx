'use client';
import s from './PageHeader.module.css';

export default function PageHeader({ eyebrow, title, action }) {
  return (
    <header className={s.wrap}>
      <div className={s.text}>
        {eyebrow && <span className="u-eyebrow">{eyebrow}</span>}
        <h1 className={s.title}>{title}</h1>
      </div>
      {action}
    </header>
  );
}
