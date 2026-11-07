'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useIndicator } from '@/hooks/useIndicator';
import Logo from '@/components/ui/Logo/Logo';
import Icon from '@/components/ui/Icon/Icon';
import Avatar, { avatarSeed } from '@/components/ui/Avatar/Avatar';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import { StreakBadge } from '@/components/ui/Streak/Streak';
import { NAV_ITEMS } from '@/router/navigation';
import { ROUTES } from '@/config/app.config';
import { useSession } from '@/store/SessionContext';
import { useUI } from '@/store/UIContext';
import { useLibrary } from '@/store/LibraryContext';
import { lookOf } from '@/screens/Store/cosmetics';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './NavBar.module.css';

// Escritorio: isla flotante arriba con los enlaces. Celular: cabecera compacta (logo + avatar)
// arriba y barra de pestañas abajo, al alcance del pulgar.
export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = useSession();
  const lib = useLibrary();
  const ui = useUI();
  const ref = useRef(null);
  const navRef = useRef(null);
  const pillRef = useRef(null);
  const tabsRef = useRef(null);
  const tabPillRef = useRef(null);
  useIndicator(navRef, pillRef, '[aria-current="page"]', pathname);
  useIndicator(tabsRef, tabPillRef, '[aria-current="page"] [data-icon]', pathname);

  useEffect(() => {
    if (!ui.menuOpen) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) ui.setMenuOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [ui]);

  const isActive = (item) => (item.end ? pathname === item.to : pathname.startsWith(item.to));

  return (
    <>
      <div className={s.wrap} ref={ref}>
        <div className={`u-glass ${s.bar}`}>
          <Logo onClick={() => router.push(ROUTES.home)} />
          <nav ref={navRef} className={s.nav} aria-label="Principal">
            <span ref={pillRef} className={s.pill} aria-hidden="true" />
            {NAV_ITEMS.map((item) => (
              <Link key={item.key} href={item.to} aria-current={isActive(item) ? 'page' : undefined} className={cx(s.link, isActive(item) && s.active)}>
                <Icon name={item.icon} size="sm" />
                <span className={s.label}>{copy.nav[item.key]}</span>
              </Link>
            ))}
          </nav>
          {/* Celular: la tienda va al lado de la racha (en escritorio está en el menú). */}
          <Link href={ROUTES.store} className={cx(s.storeBtn, pathname.startsWith(ROUTES.store) && s.storeOn)} aria-label={copy.nav.store}>
            <Icon name="store" size="md" />
          </Link>
          <StreakBadge className={s.streak} onClick={() => router.push(ROUTES.ranking)} />
          <Avatar seed={avatarSeed(profile)} frame={lookOf(lib.store).frame} size="lg" label={copy.nav.menu} onClick={() => ui.setMenuOpen(!ui.menuOpen)} />
        </div>
        <ProfileMenu />
      </div>

      {/* Celular: pestañas abajo. */}
      <nav ref={tabsRef} className={`u-glass ${s.tabs}`} aria-label="Principal">
        <span ref={tabPillRef} className={s.tabPill} aria-hidden="true" />
        {NAV_ITEMS.filter((item) => !item.desktopOnly).map((item) => (
          <Link key={item.key} href={item.to} aria-current={isActive(item) ? 'page' : undefined} className={cx(s.tab, isActive(item) && s.tabOn)}>
            <span className={s.tabIcon} data-icon><Icon name={item.icon} size="md" /></span>
            <span className={s.tabLabel}>{copy.nav[item.key]}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
