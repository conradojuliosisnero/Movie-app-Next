'use client';
import s from './SectionHeader.module.css';

export default function SectionHeader({ title, subtitle, action, as: Tag = 'h2' }) {
  return (
    <div className={s.wrap}>
      <div className={s.text}>
        <Tag className={s.title}>{title}</Tag>
        {subtitle && <p className={s.subtitle}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
