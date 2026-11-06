'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, DUR, motionOK } from '@/lib/motion';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon/Icon';
import BrandIntro from '@/components/ui/BrandIntro/BrandIntro';
import Ambient from '@/components/layout/Ambient/Ambient';
import Avatar, { avatarSeed } from '@/components/ui/Avatar/Avatar';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import Switch from '@/components/ui/Switch/Switch';
import { useSession } from '@/store/SessionContext';
import { useToast } from '@/store/ToastContext';
import { useKeyboard } from '@/hooks/useKeyboard';
import { APP, ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './ProfilesPage.module.css';

export default function ProfilesPage() {
  const session = useSession();
  const { show } = useToast();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [kids, setKids] = useState(false);
  const [error, setError] = useState('');
  const { profiles } = session;
  const pageRef = useRef(null);

  useGSAP(() => {
    if (!motionOK()) return;
    gsap.from('[data-profile]', { y: 40, scale: 0.85, autoAlpha: 0, duration: DUR.slow, ease: 'spring', stagger: 0.08 });
  }, { scope: pageRef });

  useEffect(() => {
    if (!session.onboarded) router.replace(ROUTES.onboarding);
  }, [session.onboarded, router]);

  const pick = (p) => { session.selectProfile(p.id); show(copy.toasts.hello(p.name)); router.push(ROUTES.home); };
  useKeyboard(Object.fromEntries(profiles.map((p, i) => [String(i + 1), () => pick(p)])), !creating);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError(copy.profiles.nameError);
    const p = await session.createProfile({ name: name.trim(), kids });
    if (!p) return setError(copy.profiles.limit(APP.maxProfiles));
    show(copy.toasts.profileCreated(p.name));
    setCreating(false);
    setName('');
    setKids(false);
  };

  return (
    <div ref={pageRef} className={s.page}>
      <Ambient />
      <BrandIntro variant="brand" />
      <h1 className={s.title}>{copy.profiles.title}</h1>
      <div className={s.grid}>
        {profiles.map((p, i) => (
          <button key={p.id} type="button" className={s.profile} data-profile onClick={() => pick(p)}>
            <span className={cx(s.ring, p.kids && s.kids)}><Avatar seed={avatarSeed(p)} size="profile" animate="hover" /></span>
            <span className={s.name}><kbd className={s.kbd}>{i + 1}</kbd><span className={s.nameText}>{p.name}</span></span>
            <span className={s.sub}>{p.kids ? copy.profiles.kidsTag : p.last ? `${copy.profiles.last}: ${p.last}` : ' '}</span>
          </button>
        ))}
        {profiles.length < APP.maxProfiles && (
          <button type="button" className={s.profile} data-profile onClick={() => setCreating(true)}>
            <span className={cx(s.ring, s.add)}><Icon name="add" size="xl" /></span>
            <span className={cx(s.name, 'u-muted')}><span className={s.nameText}>{copy.profiles.add}</span></span>
            <span className={s.sub}>{' '}</span>
          </button>
        )}
      </div>

      {creating && (
        <Card as="form" padding={6} radius="xl" className={s.form} onSubmit={create}>
          <b>{copy.profiles.newTitle}</b>
          <input className={s.input} value={name} autoFocus maxLength={20} placeholder={copy.profiles.namePlaceholder} aria-label={copy.profiles.namePlaceholder} onChange={(e) => { setName(e.target.value); setError(''); }} />
          <label className={s.switchRow}>
            <span><b>{copy.profiles.kidsLabel}</b><br /><span className="u-muted">{copy.profiles.kidsSub}</span></span>
            <Switch checked={kids} onChange={setKids} label={copy.profiles.kidsLabel} />
          </label>
          {error && <span className={s.error} role="alert">{error}</span>}
          <div className={s.actions}>
            <Button variant="ghost" onClick={() => { setCreating(false); setError(''); }}>{copy.profiles.cancel}</Button>
            <Button type="submit" variant="primary">{copy.profiles.create}</Button>
          </div>
        </Card>
      )}

      <p className={s.hint}>{copy.profiles.hint(profiles.length)}</p>
    </div>
  );
}
