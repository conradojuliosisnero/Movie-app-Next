'use client';
// Sugerencia para instalar PeliBox como app.
// - Android / Chrome / Edge: guarda el aviso nativo (beforeinstallprompt) y lo lanza con “Instalar”.
// - iPhone / iPad (Safari): no hay aviso nativo; se muestran los pasos (Compartir › Agregar a inicio).
// No aparece si ya está instalada. “Ahora no” la oculta DISMISS_DAYS días.
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import Logo from '@/components/ui/Logo/Logo';
import { storage } from '@/services/storage';
import { gsap, useGSAP, DUR, motionOK } from '@/lib/motion';
import { copy } from '@/i18n';
import s from './InstallPrompt.module.css';

const DISMISS_DAYS = 14;
const SHOW_AFTER_MS = 3500; // después de las intros

let deferredPrompt = null; // el aviso nativo llega una sola vez por carga: se guarda a nivel de módulo
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; window.dispatchEvent(new Event('pelibox:installable')); });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; });
}

const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const dismissed = () => Date.now() < (storage.get('installDismissedUntil', 0) ?? 0);

/** placement: 'bottom' (sobre las pestañas en celular) | 'top' (login: no tapa el formulario). */
export default function InstallPrompt({ placement = 'bottom' }) {
  const [mode, setMode] = useState(null); // null | 'native' | 'ios'
  const ref = useRef(null);

  useEffect(() => {
    if (isInstalled() || dismissed()) return undefined;
    const decide = () => setMode(deferredPrompt ? 'native' : isIOS() ? 'ios' : null);
    const timer = setTimeout(decide, SHOW_AFTER_MS);
    const onInstallable = () => setTimeout(decide, 0);
    window.addEventListener('pelibox:installable', onInstallable);
    return () => { clearTimeout(timer); window.removeEventListener('pelibox:installable', onInstallable); };
  }, []);

  useGSAP(() => {
    if (mode && motionOK()) gsap.from(ref.current, { y: placement === 'top' ? -40 : 40, autoAlpha: 0, duration: DUR.slow, ease: 'spring' });
  }, { dependencies: [mode] });

  if (!mode) return null;

  const later = () => { storage.set('installDismissedUntil', Date.now() + DISMISS_DAYS * 864e5); setMode(null); };
  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (outcome === 'accepted') setMode(null);
    else later();
  };

  return (
    <aside ref={ref} className={`u-glass ${s.prompt} ${placement === 'top' ? s.top : ''}`} role="dialog" aria-label={copy.install.title}>
      <img className={s.icon} src="/icons/icon-192.png" alt="" width="52" height="52" />
      <div className={s.text}>
        <b className={s.title}>{copy.install.title} <Logo size="sm" /></b>
        {mode === 'ios'
          ? <span className={s.body}>{copy.install.iosBefore} <Icon name="share" size="xs" className={s.inline} /> {copy.install.iosAfter}</span>
          : <span className={s.body}>{copy.install.body}</span>}
      </div>
      <div className={s.actions}>
        {mode === 'native' && <Button variant="primary" size="sm" icon="add" onClick={install}>{copy.install.cta}</Button>}
        <Button variant="ghost" size="sm" onClick={later}>{mode === 'ios' ? copy.install.gotIt : copy.install.later}</Button>
      </div>
    </aside>
  );
}
