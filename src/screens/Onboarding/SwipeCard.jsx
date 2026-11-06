'use client';
// Tarjeta arrastrable con GSAP: → me interesa · ← no · ↑ ya la vi
// Se arrastra libre, gira con el movimiento y, si la sueltas con fuerza o pasado el umbral, sale disparada.
import { useRef, useState } from 'react';
import { gsap, useGSAP, Draggable, InertiaPlugin, DUR, motionOK } from '@/lib/motion';
import { posterBackground } from '@/utils/poster';
import { titleMeta } from '@/utils/format';
import { APP } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './SwipeCard.module.css';

const STAMP = { right: 'want', left: 'no', up: 'seen' };
const FLING_VELOCITY = 900; // px/s: un gesto rápido decide aunque no pase el umbral

/** Hacia dónde apunta un desplazamiento (o null si es muy corto). */
function direction(x, y) {
  if (y < -30 && Math.abs(y) > Math.abs(x)) return 'up';
  if (x > 20) return 'right';
  if (x < -20) return 'left';
  return null;
}

export default function SwipeCard({ title: t, exit, onDecide }) {
  const ref = useRef(null);
  const stampRef = useRef(null);
  const [dir, setDir] = useState(null);
  const T = APP.swipeThresholdPx;

  const showStamp = (x, y) => {
    const d = direction(x, y);
    setDir(d);
    const strength = d === 'up' ? -y / T : Math.abs(x) / T;
    if (stampRef.current) gsap.set(stampRef.current, { autoAlpha: Math.min(1, strength) });
  };

  // Entrada de la tarjeta y gesto de arrastre.
  useGSAP(() => {
    const card = ref.current;
    if (motionOK()) gsap.from(card, { scale: 0.9, y: 30, autoAlpha: 0, duration: DUR.slow, ease: 'spring' });
    Draggable.create(card, {
      type: 'x,y',
      inertia: false,
      onDrag() {
        gsap.set(card, { rotate: this.x / 16 });
        showStamp(this.x, this.y);
      },
      onRelease() {
        const vx = InertiaPlugin.getVelocity(card, 'x');
        const vy = InertiaPlugin.getVelocity(card, 'y');
        let d = null;
        if (this.x > T || vx > FLING_VELOCITY) d = 'right';
        else if (this.x < -T || vx < -FLING_VELOCITY) d = 'left';
        else if (this.y < -T || vy < -FLING_VELOCITY) d = 'up';
        if (d) { onDecide(d); return; }
        setDir(null);
        gsap.to(card, { x: 0, y: 0, rotate: 0, duration: DUR.slow, ease: 'spring' });
      },
    });
  }, { scope: ref });

  // Salida: con el gesto o con los botones/teclado, la tarjeta sale disparada en esa dirección.
  useGSAP(() => {
    if (!exit) return;
    const card = ref.current;
    setDir(exit);
    if (stampRef.current) gsap.set(stampRef.current, { autoAlpha: 1 });
    const to = { right: { x: '+=760', y: '+=40', rotate: 28 }, left: { x: '-=760', y: '+=40', rotate: -28 }, up: { y: '-=900' } }[exit];
    gsap.to(card, { ...to, autoAlpha: 0, duration: motionOK() ? 0.3 : 0, ease: 'power2.in' });
  }, { dependencies: [exit], scope: ref });

  const background = t.image
    ? `linear-gradient(180deg, rgba(0,0,0,.35) 0%, transparent 25%, transparent 45%, rgba(0,0,0,.88) 100%), url(${t.image}) center / cover`
    : posterBackground(t.hues);

  return (
    <div ref={ref} className={s.card} style={{ background }}>
      <div className={s.top}>
        <span className={s.type}>{(t.type === 'series' ? copy.common.series : copy.common.movie).toUpperCase()}</span>
        {t.rating ? <span className={cx('u-media-glass', s.platform)}>{copy.detail.rating(t.rating)}</span> : null}
      </div>
      <div className={s.bottom}>
        <span className={s.title}>{t.title}</span>
        <span className={s.meta}>{titleMeta(t)}</span>
        <p className={s.synopsis}>{t.synopsis}</p>
      </div>
      <div ref={stampRef} className={cx('u-media-glass', s.stamp)} style={{ opacity: 0 }}>{dir ? copy.onboarding.stamp[STAMP[dir]] : ''}</div>
    </div>
  );
}
