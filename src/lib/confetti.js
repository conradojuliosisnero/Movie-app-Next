'use client';
// Confeti con GSAP (Physics2DPlugin): sale desde donde hiciste clic y cae con gravedad.
// Toma el acento del tema activo; se apaga con “reducir movimiento”.
import { gsap, motionOK } from './motion';

const PIECES = 80;
let lastPointer = null;

// Recordar el último clic para que el confeti salga de ahí (botón “Ya la vi”, episodio, etc.).
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', (e) => { lastPointer = { x: e.clientX, y: e.clientY }; }, true);
}

export function celebrate(origin = lastPointer) {
  if (typeof document === 'undefined' || !motionOK()) return;
  const root = getComputedStyle(document.documentElement);
  const accent = root.getPropertyValue('--color-accent').trim() || '#f0805a';
  const colors = [accent, accent, root.getPropertyValue('--color-fg').trim() || '#fff', '#ffd23f', '#4de8ff', '#b388ff'];
  const { x, y } = origin ?? { x: window.innerWidth / 2, y: window.innerHeight * 0.6 };

  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '300', overflow: 'hidden' });
  document.body.appendChild(layer);

  const tl = gsap.timeline({ onComplete: () => layer.remove() });
  for (let i = 0; i < PIECES; i++) {
    const piece = document.createElement('i');
    const w = gsap.utils.random(6, 11);
    Object.assign(piece.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${w * gsap.utils.random(0.4, 1.6)}px`,
      background: colors[i % colors.length],
      borderRadius: i % 3 === 0 ? '50%' : '2px',
    });
    layer.appendChild(piece);
    tl.to(piece, {
      duration: gsap.utils.random(1.6, 2.6),
      physics2D: { velocity: gsap.utils.random(450, 950), angle: gsap.utils.random(-140, -40), gravity: 1100 },
      rotation: gsap.utils.random(-720, 720),
      rotationX: gsap.utils.random(-360, 360),
      opacity: 0,
      ease: 'none',
    }, 0);
  }
}
