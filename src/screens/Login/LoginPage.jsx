'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import Poster from '@/components/ui/Poster/Poster';
import Logo from '@/components/ui/Logo/Logo';
import InstallPrompt from '@/components/ui/InstallPrompt/InstallPrompt';
import { useSession } from '@/store/SessionContext';
import { useToast } from '@/store/ToastContext';
import { useAsync } from '@/hooks/useAsync';
import { getTrending } from '@/services/catalog';
import { authErrorMessage } from '@/lib/firebase';
import { APP, ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './LoginPage.module.css';

const STEPS = 2;
const COLUMN_COUNT = 5;
const COLUMN_SPEEDS = [46, 58, 40, 64, 52]; // segundos por vuelta: lento y sin sincronizar

/** Reparte los pósters en columnas (con repetición si hay pocos). */
function columns(titles) {
  const withImage = titles.filter((t) => t.image);
  if (!withImage.length) return [];
  return Array.from({ length: COLUMN_COUNT }, (_, c) => Array.from({ length: 6 }, (_, r) => withImage[(c * 4 + r * 3) % withImage.length]));
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const session = useSession();
  const { show } = useToast();
  const router = useRouter();
  const mosaic = useAsync(() => getTrending(), 'login-mosaic');
  const [step, setStep] = useState(1); // 1: correo · 2: revisa tu correo · 'confirm': abriste el enlace en otro navegador
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Si ya hay sesión, a la app: a la pantalla de donde venía (?next=) o al inicio.
  // Solo rutas internas (“/algo”), nunca otra página web.
  const goBack = () => {
    const next = new URLSearchParams(window.location.search).get('next');
    const safe = next && /^\/(?![/\\])/.test(next);
    router.replace(safe ? next : ROUTES.home);
  };
  useEffect(() => {
    if (!session.loading && session.isAuthenticated) goBack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.loading, session.isAuthenticated]);

  // ¿Llegó desde el enlace del correo?
  useEffect(() => {
    const href = window.location.href;
    if (!session.isEmailLink(href)) return;
    const saved = session.storedEmail();
    if (!saved) { setStep('confirm'); return; }
    finishLink(saved, href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = async (fn) => {
    setBusy(true);
    setError('');
    try { await fn(); } catch (e) { setError(authErrorMessage(e)); } finally { setBusy(false); }
  };

  const finishLink = (address, href = window.location.href) => run(async () => {
    await session.completeEmailLink(address, href);
    window.history.replaceState(null, '', ROUTES.login);
    show(copy.toasts.welcome(APP.name));
  });

  const sendLink = (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) return setError(copy.auth.errors.contact);
    run(async () => {
      await session.sendEmailLink(value);
      setStep(2);
      show(copy.toasts.linkSent);
    });
  };

  const google = () => run(async () => {
    await session.signInWithGoogle();
    show(copy.toasts.welcome(APP.name));
  });

  const explore = () => { session.explore(); show(copy.toasts.explore); goBack(); };
  const dotStep = step === 1 ? 1 : 2;

  return (
    <div className={s.page}>
      <InstallPrompt placement="top" />
      {/* Muro de pósters en movimiento: columnas que suben y bajan a distinta velocidad. */}
      <div className={s.wall} aria-hidden="true">
        <div className={s.columns}>
          {columns(mosaic.data ?? []).map((col, i) => (
            <div key={i} className={s.column} style={{ '--speed': `${COLUMN_SPEEDS[i]}s` }} data-dir={i % 2 ? 'down' : 'up'}>
              {/* La columna va dos veces seguidas para que el bucle no tenga corte. */}
              {[...col, ...col].map((t, j) => <Poster key={`${t.id}-${j}`} title={t} size="fluid" />)}
            </div>
          ))}
        </div>
        <div className={s.fade} />
      </div>

      <Card className={s.card} padding={8} radius="2xl">
        <div className={s.top}>
          <Logo size="lg" />
          <span className="u-eyebrow">{copy.auth.step(dotStep, STEPS)}</span>
        </div>
        <h1 className={s.title}>{copy.app.tagline}</h1>

        {step === 1 && (
          <>
            <form className={s.form} onSubmit={sendLink} noValidate>
              <label htmlFor="email" className={s.label}>{copy.auth.contactLabel}</label>
              <input id="email" type="email" className={s.input} value={email} autoComplete="email" placeholder={copy.auth.contactPlaceholder} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
              {error && <span className={s.error} role="alert">{error}</span>}
              <Button type="submit" variant="primary" size="lg" block disabled={busy}>{busy ? copy.auth.signingIn : copy.auth.sendCode}</Button>
              <span className={s.hint}>{copy.auth.noPassword}</span>
            </form>
            <div className={s.social}>
              <Button size="lg" block disabled={busy} onClick={google}>{copy.auth.google}</Button>
            </div>
            <Button variant="link" iconRight="forward" className={s.explore} onClick={explore}>{copy.auth.explore}</Button>
          </>
        )}

        {step === 2 && (
          <div className={s.form}>
            <b className={s.label}>{copy.auth.checkInbox}</b>
            <span>{copy.auth.linkSentTo} <b>{email}</b></span>
            <span className={s.hint}>{copy.auth.linkHint}</span>
            {error && <span className={s.error} role="alert">{error}</span>}
            <div className={s.row}>
              <Button variant="link" disabled={busy} onClick={() => run(() => session.sendEmailLink(email.trim()).then(() => show(copy.toasts.linkSent)))}>{copy.auth.resend}</Button>
              <Button variant="link" onClick={() => { setStep(1); setError(''); }}>{copy.auth.change}</Button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <form className={s.form} onSubmit={(e) => { e.preventDefault(); if (EMAIL_RE.test(email.trim())) finishLink(email.trim()); else setError(copy.auth.errors.contact); }} noValidate>
            <label htmlFor="confirm" className={s.label}>{copy.auth.confirmEmail}</label>
            <input id="confirm" type="email" className={s.input} value={email} autoComplete="email" autoFocus placeholder={copy.auth.contactPlaceholder} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
            {error && <span className={s.error} role="alert">{error}</span>}
            <Button type="submit" variant="primary" size="lg" block disabled={busy}>{busy ? copy.auth.signingIn : copy.auth.enter}</Button>
          </form>
        )}

        <div className={s.dots}>
          {Array.from({ length: STEPS }, (_, i) => <span key={i} className={cx(s.dot, dotStep === i + 1 && s.dotOn)} />)}
        </div>
      </Card>
    </div>
  );
}
