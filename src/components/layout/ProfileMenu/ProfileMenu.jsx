'use client';
import { useRouter } from 'next/navigation';
import Avatar, { avatarSeed } from '@/components/ui/Avatar/Avatar';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import { useUI } from '@/store/UIContext';
import { useSession } from '@/store/SessionContext';
import { useToast } from '@/store/ToastContext';
import { useTheme } from '@/theme/ThemeProvider';
import { useLanguage } from '@/i18n/LanguageProvider';
import { ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './ProfileMenu.module.css';

// Menú flotante del avatar: se abre con animación tipo resorte (isla iOS).
export default function ProfileMenu() {
  const ui = useUI();
  const session = useSession();
  const { show } = useToast();
  const { themes, themeId, setTheme } = useTheme();
  const { lang, languages, setLang } = useLanguage();
  const router = useRouter();
  const p = session.profile;

  const go = (to) => { ui.setMenuOpen(false); router.push(to); };
  const logout = async () => { ui.setMenuOpen(false); await session.logout(); router.replace(ROUTES.login); };

  return (
    <div className={cx('u-glass', s.menu, ui.menuOpen && s.open)} aria-hidden={!ui.menuOpen} inert={!ui.menuOpen}>
      <div className={s.head}>
        <Avatar seed={avatarSeed(p)} size="md" />
        <div className={s.who}>
          <b>{p?.name}</b>
          <span className="u-muted">{session.isGuest ? copy.menu.guest : p?.kids ? copy.menu.kids : copy.menu.main}</span>
        </div>
        {!session.isGuest && <Button size="sm" onClick={() => { session.clearProfile(); go(ROUTES.profiles); }}>{copy.menu.switch}</Button>}
      </div>
      <button type="button" className={s.item} onClick={() => go(ROUTES.profile)}>{copy.menu.settings}<Icon name="chevron" size="sm" /></button>
      <button type="button" className={s.item} onClick={() => go(ROUTES.news)}>{copy.menu.news}<Icon name="chevron" size="sm" /></button>
      <button type="button" className={s.item} onClick={() => go(ROUTES.help)}>{copy.menu.help}<Icon name="chevron" size="sm" /></button>
      <div className={s.row}>
        <span>{copy.menu.theme}</span>
        <div className={s.dots}>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              title={t.label}
              aria-label={t.label}
              aria-pressed={t.id === themeId}
              className={cx(s.dot, t.id === themeId && s.dotOn)}
              style={{ background: `linear-gradient(135deg, ${t.bg} 50%, ${t.accent} 50%)` }}
              onClick={() => { setTheme(t.id); show(copy.toasts.theme(t.label)); }}
            />
          ))}
        </div>
      </div>
      <div className={s.row}>
        <span>{copy.menu.language}</span>
        <div className={s.langs}>
          {languages.map((l) => (
            <button key={l.code} type="button" aria-pressed={l.code === lang} className={cx(s.lang, l.code === lang && s.langOn)} onClick={() => setLang(l.code)}>
              {l.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <hr className={s.hr} />
      <button type="button" className={cx(s.item, s.muted)} onClick={logout}>{session.isGuest ? copy.menu.createAccount : copy.menu.logout}</button>
    </div>
  );
}
