'use client';
import { useEffect, useRef } from 'react';
import { gsap, useGSAP, DUR, motionOK } from '@/lib/motion';
import { usePathname } from 'next/navigation';
import NavBar from '../NavBar/NavBar';
import Ambient from '../Ambient/Ambient';
import TitleDetailSheet from '@/components/title/TitleDetailSheet/TitleDetailSheet';
import TrailerPlayer from '@/components/player/TrailerPlayer/TrailerPlayer';
import { useUI } from '@/store/UIContext';
import s from './AppLayout.module.css';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const ui = useUI();
  const mainRef = useRef(null);

  // Al cambiar de página, sus bloques entran en cascada desde abajo.
  useGSAP(() => {
    const page = mainRef.current?.firstElementChild;
    if (!page || !motionOK()) return;
    gsap.from(page.children, { y: 24, autoAlpha: 0, duration: DUR.slow, ease: 'standard', stagger: 0.06, clearProps: 'transform,opacity,visibility' });
  }, { dependencies: [pathname], scope: mainRef });

  // Un enlace compartido (?t=movie-550) abre la ficha directamente.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('t');
    if (id && /^(movie|tv)-\d+$/.test(id)) ui.openDetail({ id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ui.setMenuOpen(false);
    if (ui.detail) ui.closeDetail();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <Ambient />
      <NavBar />
      <main ref={mainRef} className={s.main}>{children}</main>
      <TitleDetailSheet />
      <TrailerPlayer />
    </>
  );
}
