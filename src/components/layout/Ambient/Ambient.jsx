'use client';
// Fondo vivo de PeliBox: tres manchas de luz muy suaves que derivan despacio.
// Usan el acento del tema y los tonos del título en foco (o del perfil).
import { useRef } from 'react';
import { useUI } from '@/store/UIContext';
import { useSession } from '@/store/SessionContext';
import { gsap, useGSAP, motionOK } from '@/lib/motion';
import s from './Ambient.module.css';

// Recorridos lentos (segundos) para que nunca se sincronicen y no se note el ciclo.
const DRIFT = [
  { x: '14vw', y: '10vh', scale: 1.25, duration: 26 },
  { x: '-12vw', y: '-12vh', scale: 1.18, duration: 31 },
  { x: '8vw', y: '-9vh', scale: 1.3, duration: 22 },
];

export default function Ambient({ hues }) {
  const ui = useUI();
  const { profile } = useSession();
  const ref = useRef(null);
  const focus = ui.player?.item ?? ui.detail?.item;
  const [a, b] = hues ?? focus?.hues ?? profile?.hues ?? [35, 300];

  useGSAP(() => {
    if (!motionOK() || document.documentElement.dataset.section === 'anime') return;
    gsap.utils.toArray('[data-blob]').forEach((el, i) => {
      gsap.to(el, { ...DRIFT[i], ease: 'sine.inOut', repeat: -1, yoyo: true, delay: -i * 7 });
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={s.root} aria-hidden="true">
      <div data-blob className={`${s.blob} ${s.a}`} style={{ '--blob': 'var(--color-accent)' }} />
      <div data-blob className={`${s.blob} ${s.b}`} style={{ '--blob': `oklch(0.6 0.17 ${b})` }} />
      <div data-blob className={`${s.blob} ${s.c}`} style={{ '--blob': `oklch(0.6 0.17 ${a})` }} />
    </div>
  );
}
