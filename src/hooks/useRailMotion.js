'use client';
// Filas horizontales:
// - Entrada en cascada cuando la fila aparece (IntersectionObserver: funciona también dentro de la ficha,
//   que tiene su propio scroll; ScrollTrigger solo mira el scroll de la página).
// - Los pósters que llegan al cargar más entran deslizándose desde la derecha.
// - Con mouse: arrastrar con impulso.
import { useEffect, useRef } from 'react';
import { gsap, useGSAP, Draggable, DUR, motionOK, finePointer } from '@/lib/motion';

const CARDS = ':scope > :not([data-sentinel])';

export function useRailMotion(ref, count) {
  const shown = useRef(0);

  // Entrada y pósters nuevos.
  useEffect(() => {
    const rail = ref.current;
    if (!rail || !count) return undefined;
    const cards = [...rail.querySelectorAll(CARDS)];
    const fresh = cards.slice(shown.current);
    const first = shown.current === 0;
    shown.current = cards.length;
    if (!fresh.length || !motionOK()) return undefined;

    if (!first) {
      gsap.from(fresh, { x: 40, autoAlpha: 0, duration: DUR.slow, ease: 'standard', stagger: 0.04, clearProps: 'transform,opacity,visibility' });
      return undefined;
    }
    gsap.set(fresh, { y: 28, autoAlpha: 0 });
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      gsap.to(fresh, { y: 0, autoAlpha: 1, duration: DUR.slow, ease: 'standard', stagger: 0.04, clearProps: 'transform,opacity,visibility' });
    }, { threshold: 0.15 });
    io.observe(rail);
    return () => { io.disconnect(); gsap.set(fresh, { clearProps: 'transform,opacity,visibility' }); };
  }, [ref, count]);

  // Arrastre con impulso (solo con mouse; en táctil el scroll nativo ya se siente bien).
  useGSAP(() => {
    const rail = ref.current;
    if (!rail || !finePointer()) return undefined;
    // Draggable mueve un “proxy” invisible y copiamos ese movimiento al scroll de la fila.
    // (type: 'scrollLeft' envolvería el contenido en otro div y rompería el espaciado.)
    const proxy = document.createElement('div');
    let start = 0;
    let moved = false;
    const sync = function sync() { rail.scrollLeft = start - (this.x - this.startX); };
    const [drag] = Draggable.create(proxy, {
      trigger: rail,
      type: 'x',
      inertia: true,
      dragClickables: true,
      minimumMovement: 6,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onPress() { start = rail.scrollLeft; moved = false; gsap.killTweensOf(proxy); },
      onDrag() { moved = true; sync.call(this); },
      onThrowUpdate: sync,
    });
    // Después de arrastrar, el clic que suelta el mouse no debe abrir la ficha.
    const block = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    rail.addEventListener('click', block, true);
    return () => { rail.removeEventListener('click', block, true); drag.kill(); };
  }, { scope: ref });
}

/** Llama a onReach cuando el marcador del final de la fila se vuelve visible (al deslizar hasta el final). */
export function useEndReached(railRef, sentinelRef, onReach, enabled) {
  const cb = useRef(onReach);
  cb.current = onReach;
  useEffect(() => {
    if (!enabled || !sentinelRef.current) return undefined;
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) cb.current?.(); }, { root: railRef.current, rootMargin: '0px 600px 0px 0px' });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [railRef, sentinelRef, enabled]);
}
