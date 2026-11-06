'use client';
// Píldora que se desliza detrás del elemento activo (barra de navegación, pestañas).
import { useEffect, useRef } from 'react';
import { gsap, DUR, motionOK } from '@/lib/motion';

/**
 * container: ref del contenedor (position: relative) · indicator: ref de la píldora
 * activeSelector: cómo encontrar el elemento activo dentro del contenedor · key: cambia cuando cambia el activo
 */
export function useIndicator(container, indicator, activeSelector, key) {
  const placed = useRef(false);

  useEffect(() => {
    const box = container.current;
    const pill = indicator.current;
    if (!box || !pill) return undefined;

    const move = (animate) => {
      const el = box.querySelector(activeSelector);
      if (!el) { gsap.to(pill, { autoAlpha: 0, duration: DUR.fast }); return; }
      // Posición relativa al contenedor (sirve aunque el elemento activo esté anidado).
      const r = el.getBoundingClientRect();
      const c = box.getBoundingClientRect();
      const to = { x: r.left - c.left + box.scrollLeft - box.clientLeft, y: r.top - c.top + box.scrollTop - box.clientTop, width: r.width, height: r.height, autoAlpha: 1 };
      if (!animate || !placed.current || !motionOK()) gsap.set(pill, to);
      else gsap.to(pill, { ...to, duration: DUR.slow, ease: 'spring', overwrite: true });
      placed.current = true;
    };

    move(true);
    // Si cambia el tamaño (letra grande, ventana), se recoloca sin animar.
    const ro = new ResizeObserver(() => move(false));
    ro.observe(box);
    return () => ro.disconnect();
  }, [container, indicator, activeSelector, key]);
}
