'use client';
// Cofres del día: 3 por día (50–100 pts) y, a veces, un cofre especial semanal (100–500 pts).
// Al tocar: el cofre tiembla, la tapa salta con un destello y los números giran como una ruleta
// hasta frenar en el premio. Luego la lista suma los puntos y sale el “+N pts” de siempre.
import { useRef, useState } from 'react';
import { gsap, useGSAP, DUR, motionOK } from '@/lib/motion';
import { celebrate } from '@/lib/confetti';
import { playChestOpen, playTick } from '@/lib/sfx';
import { useLibrary } from '@/store/LibraryContext';
import { CHESTS, DAILY_CAP, chestsOpenedToday, rareReady, rollChest, todayPoints } from '@/services/ranking';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './Chests.module.css';

export default function Chests() {
  const lib = useLibrary();
  const openedToday = chestsOpenedToday(lib.chests);
  // El cofre especial sigue a la vista después de abrirlo (para ver el premio) hasta salir de la página.
  const [rareOpened, setRareOpened] = useState(false);
  const rare = rareReady(lib.chests) || rareOpened;
  const left = CHESTS.perDay - openedToday;
  // Tope diario: el premio no pasa de lo que queda hoy; con el tope lleno, los cofres esperan a mañana.
  const remaining = Math.max(0, DAILY_CAP - todayPoints(lib));
  const full = remaining === 0;
  const rootRef = useRef(null);

  // Entrada en cascada, como el resto de las tarjetas.
  useGSAP(() => {
    if (!motionOK()) return;
    gsap.from('[data-chest]', { y: 24, scale: 0.8, autoAlpha: 0, duration: DUR.slow, ease: 'spring', stagger: 0.08, clearProps: 'transform,opacity,visibility' });
  }, { scope: rootRef });

  return (
    <div ref={rootRef} className={s.wrap}>
      <div className={s.head}>
        <h2 className={s.title}>{copy.chests.title}</h2>
        <span className={s.sub}>{full ? copy.chests.capFull : left ? copy.chests.openHint : copy.chests.allOpen(CHESTS.perDay)}</span>
        {rare && !rareOpened && <span className={s.rareHint}>{copy.chests.rareHint}</span>}
      </div>
      <div className={s.row}>
        {rare && <ChestButton kind="rare" locked={full && !rareOpened} remaining={remaining} onOpen={(n) => { setRareOpened(true); lib.openChest('rare', n); }} />}
        {Array.from({ length: CHESTS.perDay }, (_, i) => (
          <ChestButton key={i} n={i + 1} kind="daily" opened={i < openedToday} locked={full} remaining={remaining} onOpen={(n) => lib.openChest('daily', n)} />
        ))}
      </div>
    </div>
  );
}

function ChestButton({ kind, n, opened = false, locked = false, remaining, onOpen }) {
  const ref = useRef(null);
  const [state, setState] = useState(opened ? 'opened' : 'closed'); // closed | opening | won | opened
  const [won, setWon] = useState(null);
  const isRare = kind === 'rare';
  const { contextSafe } = useGSAP({ scope: ref });

  const open = contextSafe(() => {
    if (state !== 'closed' || locked) return;
    const prize = Math.min(rollChest(kind), remaining);
    const [min, max] = CHESTS[kind];
    setState('opening');
    const finish = () => {
      setWon(prize);
      setState('won');
      onOpen(prize); // suma los puntos → sale el “+N pts” que vuela a la racha
      if (isRare) celebrate();
    };

    if (!motionOK()) { finish(); return; }

    const num = ref.current.querySelector('[data-num]');
    const reel = { v: 0 };
    let last = -1;
    const STEPS = isRare ? 26 : 18;
    gsap.timeline({ onComplete: finish })
      // 1) Tiembla.
      .to('[data-box]', { rotation: 7, duration: 0.06, yoyo: true, repeat: 7, ease: 'none', transformOrigin: '50% 90%' })
      .to('[data-box]', { rotation: 0, scale: 1.08, duration: 0.12 })
      // 2) La tapa salta y sale el destello.
      .add(() => playChestOpen({ rare: isRare }))
      .to('[data-lid]', { y: -10, rotation: -28, svgOrigin: '8 24', duration: 0.35, ease: 'back.out(3)' })
      .fromTo('[data-glow]', { scale: 0.2, autoAlpha: 0 }, { scale: 1.6, autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, '<')
      .fromTo(num, { y: 12, autoAlpha: 0, scale: 0.6 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.25 }, '<0.1')
      // 3) Ruleta: los números pasan rápido y van frenando hasta el premio.
      .to(reel, {
        v: STEPS,
        duration: isRare ? 1.9 : 1.3,
        ease: 'power3.out',
        onUpdate: () => {
          const step = Math.floor(reel.v);
          if (step === last) return;
          last = step;
          num.textContent = step >= STEPS ? `+${prize}` : `+${min + Math.floor(Math.random() * (max - min + 1))}`;
          playTick({ pitch: 1 + step / STEPS / 2 });
        },
      })
      // 4) Frena en el premio con un golpe.
      .add(() => { num.textContent = `+${prize}`; })
      .fromTo(num, { scale: 1.6 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.45)' })
      .to('[data-glow]', { autoAlpha: 0.35, scale: 1.2, duration: 0.4 }, '<');
  });

  const label = state === 'closed' ? (isRare ? copy.chests.openRare : copy.chests.open) : copy.chests.opened;
  const redeemed = state === 'opened' || state === 'won';
  // Boleto: cofre a la izquierda; a la derecha el número (Nº 001) y “Abrir” → ruleta → sello “CANJEADO”.
  return (
    <button
      ref={ref}
      type="button"
      data-chest
      className={cx(s.ticket, isRare && s.rare, state === 'closed' && !locked && s.idle, (redeemed || (locked && state === 'closed')) && s.done)}
      onClick={open}
      disabled={state !== 'closed' || locked}
      aria-label={label}
    >
      <span data-glow className={s.glow} aria-hidden="true" />
      <span data-box className={s.box}>
        <ChestArt rare={isRare} open={state === 'opened'} />
      </span>
      <span className={s.info}>
        <span className={s.no}>{isRare ? copy.chests.rare : `Nº ${String(n).padStart(3, '0')}`}</span>
        {state === 'closed' && <span className={s.open}>{locked ? copy.chests.tomorrow : copy.chests.tapOpen}</span>}
        <span data-num className={s.num} aria-live="polite">{state === 'won' ? `+${won}` : ''}</span>
        {redeemed && <span className={s.stamp}>{copy.chests.redeemed}</span>}
      </span>
    </button>
  );
}

function ChestArt({ rare, open }) {
  const g = rare ? ['#ffe27a', '#c27bff', '#5b2bb5'] : ['#ffb36b', '#c9682f', '#7a3a17'];
  const id = rare ? 'chest-rare' : 'chest-daily';
  return (
    <svg viewBox="0 0 64 60" className={s.art} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={g[1]} />
          <stop offset="1" stopColor={g[2]} />
        </linearGradient>
        <linearGradient id={`${id}-lid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={g[0]} />
          <stop offset="1" stopColor={g[1]} />
        </linearGradient>
      </defs>
      <rect x="8" y="26" width="48" height="28" rx="5" fill={`url(#${id}-body)`} />
      <rect x="8" y="34" width="48" height="4" fill="rgba(0,0,0,.18)" />
      <g data-lid style={open ? { transform: 'translate(0,-14px) rotate(-28deg)', transformOrigin: '8px 24px' } : undefined}>
        <path d="M8 26 C8 12 18 8 32 8 C46 8 56 12 56 26 Z" fill={`url(#${id}-lid)`} />
        <rect x="8" y="22" width="48" height="4" fill="rgba(0,0,0,.15)" />
      </g>
      <rect x="28" y="22" width="8" height="12" rx="2" fill="#ffd23f" stroke="#7a4a00" strokeWidth="1" />
    </svg>
  );
}
