'use client';
// Panel lateral con la ficha del título (no pierde el lugar en la pantalla de atrás).
// El contenido es TitleDetails; aquí solo va el contenedor: fondo, entrada animada y arrastrar para cerrar.
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap, useGSAP, Draggable, InertiaPlugin, DUR, motionOK } from '@/lib/motion';
import Button from '@/components/ui/Button/Button';
import TitleDetails from '@/components/title/TitleDetails/TitleDetails';
import { useUI } from '@/store/UIContext';
import { useKeyboard } from '@/hooks/useKeyboard';
import { ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';
import s from './TitleDetailSheet.module.css';

export default function TitleDetailSheet() {
  const ui = useUI();
  const item = ui.detail?.item;
  if (!item) return null;
  // key: al abrir otro título se reinicia el estado interno (temporada elegida, etc.).
  return <Sheet key={item.id} item={item} proposed={ui.detail.proposed} />;
}

function Sheet({ item, proposed }) {
  const ui = useUI();
  const router = useRouter();
  const sheetRef = useRef(null);
  const scrimRef = useRef(null);
  const heroRef = useRef(null);

  // Entrada: la ficha llega desde la derecha. Gesto: arrastrar la cabecera hacia la derecha la cierra.
  const { contextSafe } = useGSAP(() => {
    const sheet = sheetRef.current;
    const scrim = scrimRef.current;
    if (motionOK()) {
      gsap.from(scrim, { autoAlpha: 0, duration: DUR.base });
      gsap.from(sheet, { x: 80, autoAlpha: 0, scale: 0.98, duration: DUR.slow, ease: 'standard' });
    }
    Draggable.create(sheet, {
      type: 'x',
      trigger: heroRef.current,
      bounds: { minX: 0, maxX: window.innerWidth },
      edgeResistance: 0.9,
      onDrag() { gsap.set(scrim, { autoAlpha: 1 - this.x / sheet.offsetWidth }); },
      onRelease() {
        const fast = InertiaPlugin.getVelocity(sheet, 'x') > 700;
        if (this.x > sheet.offsetWidth * 0.3 || fast) close();
        else { gsap.to(sheet, { x: 0, duration: DUR.slow, ease: 'spring' }); gsap.to(scrim, { autoAlpha: 1, duration: DUR.base }); }
      },
    });
  });

  // Salida animada y luego se desmonta.
  const close = contextSafe(() => {
    if (!motionOK()) { ui.closeDetail(); return; }
    gsap.to(scrimRef.current, { autoAlpha: 0, duration: DUR.base });
    gsap.to(sheetRef.current, { x: sheetRef.current.offsetWidth + 40, autoAlpha: 0, duration: DUR.base, ease: 'power2.in', onComplete: ui.closeDetail });
  });
  useKeyboard({ Escape: close }, true);

  return (
    <>
      <div ref={scrimRef} className={s.scrim} onClick={close} />
      <aside ref={sheetRef} className={s.sheet} role="dialog" aria-modal="true" aria-label={item.title || copy.common.loading}>
        <span className={s.grip} aria-hidden="true" />
        <TitleDetails
          item={item}
          proposed={proposed}
          onBack={close}
          heroRef={heroRef}
          heroAction={<Button variant="media" size="sm" iconRight="expand" onClick={() => router.push(ROUTES.title(item.id))}>{copy.detail.openPage}</Button>}
        />
      </aside>
    </>
  );
}
