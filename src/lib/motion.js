'use client';
// GSAP de la app: plugins registrados una sola vez y curvas sacadas de los tokens del tema.
// Todo lo que se mueve pasa por aquí, así el ritmo es el mismo en toda la interfaz.
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { motion as tokens } from '@/theme/tokens';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable, InertiaPlugin, CustomEase);
  // cubic-bezier(.2,.8,.2,1) → CustomEase('standard', '.2,.8,.2,1')
  Object.entries(tokens.easing).forEach(([name, value]) => {
    const m = /cubic-bezier\(([^)]+)\)/.exec(value);
    if (m) CustomEase.create(name, m[1]);
  });
}

const seconds = (ms) => parseFloat(ms) / 1000;

/** Duraciones en segundos (de tokens.motion.duration). */
export const DUR = Object.fromEntries(Object.entries(tokens.duration).map(([k, v]) => [k, seconds(v)]));

/** false si la persona pidió “reducir movimiento” en su sistema. */
export const motionOK = () => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** true en equipos con mouse (donde tiene sentido arrastrar filas). */
export const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export { gsap, useGSAP, ScrollTrigger, Draggable, InertiaPlugin };
