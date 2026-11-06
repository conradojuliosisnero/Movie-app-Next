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

  // Escritorio: panel que entra por la derecha y se cierra arrastrando la cabecera a la derecha.
  // Celular: hoja que sube desde abajo y se cierra deslizándola hacia abajo.
  const axis = () => (window.matchMedia('(max-width: 760px)').matches ? 'y' : 'x');
  const { contextSafe } = useGSAP(() => {
    const sheet = sheetRef.current;
    const scrim = scrimRef.current;
    const a = axis();
    const size = () => (a === 'y' ? sheet.offsetHeight : sheet.offsetWidth);
    if (motionOK()) {
      gsap.from(scrim, { autoAlpha: 0, duration: DUR.base });
      gsap.from(sheet, a === 'y'
        ? { yPercent: 100, duration: DUR.slow, ease: 'standard' }
        : { x: 80, autoAlpha: 0, scale: 0.98, duration: DUR.slow, ease: 'standard' });
    }
    Draggable.create(sheet, {
      type: a,
      trigger: heroRef.current,
      bounds: a === 'y' ? { minY: 0, maxY: window.innerHeight } : { minX: 0, maxX: window.innerWidth },
      edgeResistance: 0.9,
      onDrag() { gsap.set(scrim, { autoAlpha: 1 - this[a] / size() }); },
      onRelease() {
        const fast = InertiaPlugin.getVelocity(sheet, a) > 700;
        if (this[a] > size() * 0.25 || fast) close();
        else { gsap.to(sheet, { [a]: 0, duration: DUR.slow, ease: 'spring' }); gsap.to(scrim, { autoAlpha: 1, duration: DUR.base }); }
      },
    });
  });

  // Salida animada y luego se desmonta.
  const close = contextSafe(() => {
    if (!motionOK()) { ui.closeDetail(); return; }
    const sheet = sheetRef.current;
    const a = axis();
    gsap.to(scrimRef.current, { autoAlpha: 0, duration: DUR.base });
    gsap.to(sheet, { [a]: (a === 'y' ? sheet.offsetHeight : sheet.offsetWidth) + 40, autoAlpha: a === 'y' ? 1 : 0, duration: DUR.base, ease: 'power2.in', onComplete: ui.closeDetail });
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
