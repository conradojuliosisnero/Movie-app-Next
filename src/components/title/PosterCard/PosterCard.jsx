'use client';
// Póster con su información encima: título, leyenda y una acción aparecen al pasar el mouse
// (o al llegar con el teclado). En pantallas táctiles queda solo un botón pequeño en la esquina.
import { useRef } from 'react';
import Poster from '@/components/ui/Poster/Poster';
import { gsap, useGSAP, motionOK } from '@/lib/motion';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import { useUI } from '@/store/UIContext';
import { titleCaption } from '@/utils/format';
import { cx } from '@/utils/cx';
import s from './PosterCard.module.css';

/**
 * action: { label, icon, active, onClick } | null
 * size: md (filas, ancho fijo) | fluid (cuadrículas)
 */
export default function PosterCard({ title: t, action = null, size = 'md' }) {
  const ui = useUI();
  const ref = useRef(null);
  const active = !!action?.active;
  const wasActive = useRef(active);

  // Al guardar, la marca aparece con un rebote; el botón del hover da un pequeño “latido”.
  // Solo cuando cambia por una acción, no al cargar la página.
  useGSAP(() => {
    const changed = wasActive.current !== active;
    wasActive.current = active;
    if (!changed || !active || !motionOK()) return;
    gsap.fromTo('[data-badge]', { scale: 0, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(3)' });
    gsap.fromTo('[data-action] svg', { scale: 0.6 }, { scale: 1, duration: 0.45, ease: 'back.out(4)' });
  }, { dependencies: [active], scope: ref });

  return (
    <div ref={ref} className={cx(s.card, size === 'fluid' && s.fluid)}>
      <Poster title={t} size={size} onClick={() => ui.openDetail(t)} className={s.poster} />
      {action?.active && <span className={s.badge} aria-hidden="true" data-badge><Icon name={action.icon} size="xs" /></span>}
      <div className={s.overlay}>
        <b className={s.name}>{t.title}</b>
        <span className={s.caption}>{titleCaption(t)}</span>
        {action && <Button size="sm" variant={action.active ? 'primary' : 'media'} icon={action.icon} block className={s.action} data-action onClick={action.onClick}>{action.label}</Button>}
      </div>
      {action && (
        <button type="button" className={cx(s.corner, action.active && s.cornerOn)} aria-label={`${action.label}: ${t.title}`} onClick={action.onClick}>
          <Icon name={action.icon} size="sm" />
        </button>
      )}
    </div>
  );
}
