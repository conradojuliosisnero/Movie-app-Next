'use client';
// “+N pts” al ganar puntos: salta desde donde tocaste, suelta chispas y vuela hasta la racha
// de la cabecera, que da un pulso. Si no hubo toque (visita del día, ver completa), sale del centro.
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap, useGSAP, motionOK } from '@/lib/motion';
import { onPoints } from '@/lib/pointsFx';
import { playPoints } from '@/lib/sfx';
import s from './PointsFx.module.css';

const SPARKS = 8;
const POINTER_FRESH_MS = 2000;

export default function PointsFx() {
  const [bursts, setBursts] = useState([]);
  const pointer = useRef(null);

  useEffect(() => {
    const down = (e) => { pointer.current = { x: e.clientX, y: e.clientY, t: Date.now() }; };
    document.addEventListener('pointerdown', down, true);
    const off = onPoints((n) => {
      const p = pointer.current && Date.now() - pointer.current.t < POINTER_FRESH_MS
        ? pointer.current
        : { x: window.innerWidth / 2, y: window.innerHeight * 0.4 };
      setBursts((list) => [...list, { id: `${Date.now()}-${Math.random()}`, n, x: p.x, y: p.y }]);
      playPoints();
    });
    return () => { document.removeEventListener('pointerdown', down, true); off(); };
  }, []);

  if (!bursts.length) return null;
  return createPortal(
    bursts.map((b) => <Burst key={b.id} {...b} onDone={() => setBursts((list) => list.filter((x) => x.id !== b.id))} />),
    document.body,
  );
}

function Burst({ n, x, y, onDone }) {
  const ref = useRef(null);

  useGSAP(() => {
    const chip = ref.current.querySelector('[data-chip]');
    const sparks = ref.current.querySelectorAll('[data-spark]');
    gsap.set(chip, { xPercent: -50, yPercent: -50 });
    const tl = gsap.timeline({ onComplete: onDone });

    if (!motionOK()) {
      tl.from(chip, { autoAlpha: 0, duration: 0.2 }).to(chip, { autoAlpha: 0, duration: 0.3, delay: 1 });
      return;
    }

    // 1) Aparece con rebote y suelta chispas alrededor.
    tl.fromTo(chip, { scale: 0.2, autoAlpha: 0, rotate: -14 }, { scale: 1.2, autoAlpha: 1, rotate: 0, duration: 0.35, ease: 'back.out(3)' })
      .to(sparks, {
        x: (i) => Math.cos((i / SPARKS) * Math.PI * 2) * gsap.utils.random(34, 58),
        y: (i) => Math.sin((i / SPARKS) * Math.PI * 2) * gsap.utils.random(34, 58),
        scale: 0, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
      }, 0.05)
      // 2) Sube un poco y se acomoda.
      .to(chip, { y: -46, scale: 1, duration: 0.45, ease: 'power2.out' }, 0.3);

    // 3) Vuela a la racha de la cabecera y la hace latir.
    const badge = document.querySelector('[data-streak]');
    const r = badge?.getBoundingClientRect();
    if (r && r.width) {
      tl.to(chip, { x: r.left + r.width / 2 - x, y: r.top + r.height / 2 - y, scale: 0.35, autoAlpha: 0.2, duration: 0.55, ease: 'power3.in' }, '+=0.35')
        .fromTo(badge, { scale: 1.3 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)', clearProps: 'transform' });
    } else {
      tl.to(chip, { y: -120, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '+=0.4');
    }
  }, { scope: ref });

  return (
    <div ref={ref} className={s.burst} style={{ left: x, top: y }} aria-live="polite">
      {Array.from({ length: SPARKS }, (_, i) => <span key={i} data-spark className={s.spark} />)}
      <span data-chip className={s.chip}>+{n}<small> pts</small></span>
    </div>
  );
}
