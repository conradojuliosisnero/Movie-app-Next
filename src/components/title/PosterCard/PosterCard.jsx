'use client';
// Póster con su información encima: título, leyenda y acciones aparecen al pasar el mouse
// (o al llegar con el teclado). En pantallas táctiles quedan solo botones redondos en la esquina.
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
 * actions: [{ key, label, icon, active, onClick }]
 * size: md (filas, ancho fijo) | fluid (cuadrículas)
 */
export default function PosterCard({ title: t, actions = [], size = 'md' }) {
  const ui = useUI();
  const ref = useRef(null);
  const activeAction = actions.find((a) => a.active);
  const activeKey = activeAction?.key ?? null;
  const wasActive = useRef(activeKey);

  // Al guardar o marcar como vista, la marca aparece con un rebote. Solo por una acción, no al cargar.
  useGSAP(() => {
    const changed = wasActive.current !== activeKey;
    wasActive.current = activeKey;
    if (!changed || !activeKey || !motionOK()) return;
    gsap.fromTo('[data-badge]', { scale: 0, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(3)' });
    gsap.fromTo(`[data-action="${activeKey}"] svg`, { scale: 0.6 }, { scale: 1, duration: 0.45, ease: 'back.out(4)' });
  }, { dependencies: [activeKey], scope: ref });

  return (
    <div ref={ref} className={cx(s.card, size === 'fluid' && s.fluid)}>
      <Poster title={t} size={size} onClick={() => ui.openDetail(t)} className={s.poster} />
      {activeAction && <span className={s.badge} aria-hidden="true" data-badge><Icon name={activeAction.icon} size="xs" /></span>}
      <div className={s.overlay}>
        <b className={s.name}>{t.title}</b>
        <span className={s.caption}>{titleCaption(t)}</span>
        {actions.length > 0 && (
          <div className={s.actions}>
            {actions.map((a) => (
              <Button key={a.key} size="sm" variant={a.active ? 'primary' : 'media'} icon={a.icon} block className={s.action} data-action={a.key} onClick={a.onClick}>{a.label}</Button>
            ))}
          </div>
        )}
      </div>
      {actions.length > 0 && (
        <div className={s.corner}>
          {actions.map((a) => (
            <button key={a.key} type="button" className={cx(s.cornerBtn, a.active && s.cornerOn)} aria-label={`${a.label}: ${t.title}`} onClick={a.onClick}>
              <Icon name={a.icon} size="sm" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
