'use client';
import { useEffect, useRef } from 'react';
import { useIndicator } from '@/hooks/useIndicator';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo/Logo';
import Icon from '@/components/ui/Icon/Icon';
import Avatar, { avatarSeed } from '@/components/ui/Avatar/Avatar';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import { NAV_ITEMS } from '@/router/navigation';
import { ROUTES } from '@/config/app.config';
import { useSession } from '@/store/SessionContext';
import { useUI } from '@/store/UIContext';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './NavBar.module.css';

// Barra principal flotante (isla con glassmorphism).
export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = useSession();
  const ui = useUI();
  const ref = useRef(null);
  const navRef = useRef(null);
  const pillRef = useRef(null);
  useIndicator(navRef, pillRef, '[aria-current="page"]', pathname);

  useEffect(() => {
    if (!ui.menuOpen) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) ui.setMenuOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [ui]);

  return (
    <div className={s.wrap} ref={ref}>
      <div className={`u-glass ${s.bar}`}>
        <Logo onClick={() => router.push(ROUTES.home)} />
        <nav ref={navRef} className={s.nav} aria-label="Principal">
          <span ref={pillRef} className={s.pill} aria-hidden="true" />
          {NAV_ITEMS.map((item) => {
            const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link key={item.key} href={item.to} aria-current={active ? 'page' : undefined} className={cx(s.link, active && s.active)}>
                <Icon name={item.icon} size="sm" />
                <span className={s.label}>{copy.nav[item.key]}</span>
              </Link>
            );
          })}
        </nav>
        <Avatar seed={avatarSeed(profile)} size="lg" label={copy.nav.menu} onClick={() => ui.setMenuOpen(!ui.menuOpen)} />
      </div>
      <ProfileMenu />
    </div>
  );
}
