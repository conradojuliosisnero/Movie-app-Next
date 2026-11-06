'use client';
// Intro de marca a pantalla completa. Una vez por sesión, se salta con clic o tecla.
// variant="brand": estilo “tipo Netflix” (logo + franjas de luz hacia la cámara).
// variant="anime": líneas de velocidad, corte de katana, sello アニメ y sonido.
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap, useGSAP, motionOK } from '@/lib/motion';
import { playAnimeSting } from '@/lib/sfx';
import { APP } from '@/config/app.config';
import { cx } from '@/utils/cx';
import s from './BrandIntro.module.css';

const STRIPES = 9;
const seenKey = (variant) => `${APP.storageKey}:intro:${variant}`;

/** Las intros salen una vez por inicio de sesión: al entrar o salir se vuelven a habilitar. */
export function resetIntros() {
  try { ['brand', 'anime'].forEach((v) => sessionStorage.removeItem(seenKey(v))); } catch { /* modo privado */ }
}

function alreadySeen(variant) {
  try { return sessionStorage.getItem(seenKey(variant)) === '1'; } catch { return false; }
}

export default function BrandIntro({ variant = 'brand', fontClass }) {
  // Solo se monta en el cliente (las pantallas que la usan están detrás de Guard).
  const [show, setShow] = useState(() => !alreadySeen(variant) && motionOK());
  const ref = useRef(null);
  const tl = useRef(null);
  const [a, b] = APP.nameParts;

  const finish = () => {
    try { sessionStorage.setItem(seenKey(variant), '1'); } catch { /* modo privado */ }
    setShow(false);
  };

  useGSAP(() => {
    if (!show) return;
    const t = gsap.timeline({ onComplete: finish });
    tl.current = t;
    if (variant === 'anime') {
      playAnimeSting({ offset: 0.55 });
      t.from('[data-lines]', { scale: 2.2, rotate: 25, autoAlpha: 0, duration: 0.6, ease: 'power3.out' })
        .from('[data-letter]', { yPercent: 120, skewX: -20, autoAlpha: 0, duration: 0.35, ease: 'power3.out', stagger: 0.03 }, 0.15)
        .fromTo('[data-slash]', { scaleX: 0 }, { scaleX: 1, duration: 0.18, ease: 'power4.in' }, 0.55)
        .to('[data-half="top"]', { x: -18, y: -8, duration: 0.25, ease: 'power3.out' }, 0.75)
        .to('[data-half="bottom"]', { x: 18, y: 8, duration: 0.25, ease: 'power3.out' }, 0.75)
        .to('[data-slash]', { autoAlpha: 0, duration: 0.3 }, 0.85)
        .fromTo('[data-flash]', { autoAlpha: 0.9 }, { autoAlpha: 0, duration: 0.35 }, 0.73)
        .from('[data-stamp]', { scale: 3, rotate: -25, autoAlpha: 0, duration: 0.3, ease: 'back.out(2)' }, 0.87)
        .to('[data-half]', { x: 0, y: 0, duration: 0.4, ease: 'spring' }, 1.4)
        .to(ref.current, { autoAlpha: 0, scale: 1.08, duration: 0.45, ease: 'power2.in' }, 2.15);
    } else {
      t.from('[data-letter]', { yPercent: 60, autoAlpha: 0, filter: 'blur(12px)', duration: 0.55, ease: 'power3.out', stagger: 0.06 })
        .fromTo('[data-glow]', { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.35)
        .to('[data-logo]', { scale: 1.06, duration: 0.6, ease: 'sine.inOut' }, 0.6)
        // “Entrar” al logo: crece rápido mientras las franjas de luz cruzan la pantalla.
        .to('[data-logo]', { scale: 9, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, 1.25)
        .fromTo('[data-stripe]', { scaleY: 0, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 1, duration: 0.35, ease: 'power2.out', stagger: { each: 0.03, from: 'center' } }, 1.3)
        .to('[data-stripes]', { scaleX: 6, duration: 0.6, ease: 'power3.in' }, 1.55)
        .to(ref.current, { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, 1.95);
    }
  }, { dependencies: [show], scope: ref });

  // Saltar con cualquier tecla.
  useEffect(() => {
    if (!show) return undefined;
    const skip = () => tl.current?.progress(1);
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, [show]);

  if (!show) return null;

  const letters = (text, cls) => [...text].map((ch, i) => <span key={i} data-letter className={cls}>{ch}</span>);

  // Portal a <body>: por encima de todo, aunque se monte dentro de <main> (que tiene su propio z-index).
  return createPortal(
    <div ref={ref} className={cx(s.intro, s[variant], fontClass)} role="presentation" aria-hidden="true" onClick={() => tl.current?.progress(1)}>
      {variant === 'anime' ? (
        <>
          <div data-lines className={s.lines} />
          <div className={s.animeLogo}>
            {['top', 'bottom'].map((half) => (
              <span key={half} data-half={half} className={cx(s.half, s[half])}>
                {letters(a, s.letter)}<span className={s.accent}>{letters(b, s.letter)}</span>
              </span>
            ))}
            <span data-slash className={s.slash} />
            <span data-stamp className={s.stamp} lang="ja">アニメ</span>
          </div>
          <div data-flash className={s.flash} />
        </>
      ) : (
        <>
          <div data-glow className={s.glow} />
          <div data-logo className={s.logo}>
            {letters(a, s.letter)}<span className={s.accent}>{letters(b, s.letter)}</span>
          </div>
          <div data-stripes className={s.stripes}>
            {Array.from({ length: STRIPES }, (_, i) => <span key={i} data-stripe className={s.stripe} style={{ '--i': i }} />)}
          </div>
        </>
      )}
    </div>,
    document.body
  );
}
