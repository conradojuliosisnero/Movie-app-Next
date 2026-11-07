'use client';
// Panel superpuesto reutilizable (ficha de títulos, filtros…).
// Escritorio: panel que entra por la derecha y se cierra arrastrando su cabecera a la derecha.
// Celular: hoja que sube desde abajo y se cierra deslizándola hacia abajo.
// children es una función ({ close, dragRef }) → contenido: close cierra con animación;
// dragRef se pone en la zona que sirve de asa para arrastrar (por ejemplo la cabecera).
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap, useGSAP, Draggable, InertiaPlugin, DUR, motionOK } from '@/lib/motion';
import { useKeyboard } from '@/hooks/useKeyboard';
import { cx } from '@/utils/cx';
import s from './Sheet.module.css';

const isPhone = () => window.matchMedia('(max-width: 760px)').matches;

/** size: lg (ficha) | sm (filtros) */
export default function Sheet({ label, onClose, size = 'lg', children }) {
  const sheetRef = useRef(null);
  const scrimRef = useRef(null);
  const dragRef = useRef(null);

  const { contextSafe } = useGSAP(() => {
    const sheet = sheetRef.current;
    const scrim = scrimRef.current;
    const a = isPhone() ? 'y' : 'x';
    const length = () => (a === 'y' ? sheet.offsetHeight : sheet.offsetWidth);
    if (motionOK()) {
      gsap.from(scrim, { autoAlpha: 0, duration: DUR.base });
      gsap.from(sheet, a === 'y'
        ? { yPercent: 100, duration: DUR.slow, ease: 'standard' }
        : { x: 80, autoAlpha: 0, scale: 0.98, duration: DUR.slow, ease: 'standard' });
    }
    Draggable.create(sheet, {
      type: a,
      trigger: dragRef.current ?? sheet.querySelector('[data-grip]'),
      bounds: a === 'y' ? { minY: 0, maxY: window.innerHeight } : { minX: 0, maxX: window.innerWidth },
      edgeResistance: 0.9,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onDrag() { gsap.set(scrim, { autoAlpha: 1 - this[a] / length() }); },
      onRelease() {
        const fast = InertiaPlugin.getVelocity(sheet, a) > 700;
        if (this[a] > length() * 0.25 || fast) close();
        else { gsap.to(sheet, { [a]: 0, duration: DUR.slow, ease: 'spring' }); gsap.to(scrim, { autoAlpha: 1, duration: DUR.base }); }
      },
    });
  });

  // Salida animada y luego se desmonta (onClose).
  const close = contextSafe(() => {
    if (!motionOK()) { onClose(); return; }
    const sheet = sheetRef.current;
    const a = isPhone() ? 'y' : 'x';
    gsap.to(scrimRef.current, { autoAlpha: 0, duration: DUR.base });
    gsap.to(sheet, { [a]: (a === 'y' ? sheet.offsetHeight : sheet.offsetWidth) + 40, autoAlpha: a === 'y' ? 1 : 0, duration: DUR.base, ease: 'power2.in', onComplete: onClose });
  });
  useKeyboard({ Escape: close }, true);

  // Portal a <body>: queda por encima de las barras aunque se abra desde dentro de <main>.
  return createPortal(
    <>
      <div ref={scrimRef} className={s.scrim} onClick={close} />
      <aside ref={sheetRef} className={cx(s.sheet, s[size])} role="dialog" aria-modal="true" aria-label={label}>
        <span className={s.grip} data-grip aria-hidden="true" />
        {children({ close, dragRef })}
      </aside>
    </>,
    document.body
  );
}
