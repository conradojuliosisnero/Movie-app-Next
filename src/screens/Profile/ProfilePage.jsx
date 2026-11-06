'use client';
import { useMemo, useRef, useState } from 'react';
import { gsap, useGSAP, motionOK } from '@/lib/motion';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import Switch from '@/components/ui/Switch/Switch';
import Chip from '@/components/ui/Chip/Chip';
import Poster from '@/components/ui/Poster/Poster';
import Avatar, { avatarSeed } from '@/components/ui/Avatar/Avatar';
import Status from '@/components/ui/Status/Status';
import { useLibrary } from '@/store/LibraryContext';
import { useSession } from '@/store/SessionContext';
import { useToast } from '@/store/ToastContext';
import { useUI } from '@/store/UIContext';
import { useTheme } from '@/theme/ThemeProvider';
import { useLanguage } from '@/i18n/LanguageProvider';
import Segmented from '@/components/ui/Segmented/Segmented';
import { usePlatforms } from '@/hooks/useCatalogData';
import { computeStats } from '@/services/catalog';
import { genreLabel } from '@/data/genres';
import { titleMeta } from '@/utils/format';
import { APP, ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './ProfilePage.module.css';

const AVATAR_OPTIONS = 11;

export default function ProfilePage() {
  const lib = useLibrary();
  const session = useSession();
  const theme = useTheme();
  const language = useLanguage();
  const ui = useUI();
  const platforms = usePlatforms();
  const { show } = useToast();
  const router = useRouter();
  const stats = useMemo(() => computeStats(lib), [lib]);
  const max = stats.topGenres[0]?.[1] || 1;
  const [avatarPage, setAvatarPage] = useState(0);
  const hoursRef = useRef(null);
  useGSAP(() => {
    if (!motionOK() || !stats.hours) return;
    const counter = { v: 0 };
    gsap.to(counter, { v: stats.hours, duration: 1.4, ease: 'power3.out', onUpdate: () => { if (hoursRef.current) hoursRef.current.textContent = Math.round(counter.v); } });
  }, { dependencies: [stats.hours] });
  const current = avatarSeed(session.profile);
  // Opciones de avatar: semillas distintas a partir del perfil; “Otras opciones” pasa a la siguiente tanda.
  const options = Array.from({ length: AVATAR_OPTIONS }, (_, i) => `${session.profile.id}-${avatarPage}-${i}`);
  const chooseAvatar = (seed) => { session.updateProfile(session.profile.id, { avatar: seed }); show(copy.toasts.avatar); };

  const settings = [
    { key: 'bigText', checked: theme.bigText, toggle: () => theme.setBigText(!theme.bigText) },
    { key: 'onlyMine', checked: lib.settings.onlyMine, toggle: () => lib.toggleSetting('onlyMine') },
  ];

  const shareYear = async () => {
    const text = copy.profile.shareText(stats.hours, stats.titles, APP.name);
    try {
      if (navigator.share) await navigator.share({ title: APP.name, text, url: window.location.origin });
      else { await navigator.clipboard.writeText(`${text} ${window.location.origin}`); show(copy.toasts.shared); }
    } catch { /* la persona canceló */ }
  };

  const logout = async () => { await session.logout(); router.replace(ROUTES.login); };

  return (
    <div className={s.page}>
      <Card padding={8} radius="2xl" className={s.stats}>
        <div className={s.glow} aria-hidden="true" />
        <span className="u-eyebrow">{copy.profile.yearIn(new Date().getFullYear(), APP.name, session.profile.name)}</span>
        <div className={s.hours}><span ref={hoursRef}>{stats.hours}</span><span className={s.unit}> {copy.profile.hoursUnit}</span></div>
        <p className="u-muted">{copy.profile.summary(stats.days, stats.titles, stats.streakWeeks)}</p>
        <div className={s.bars}>
          {stats.topGenres.map(([g, n]) => (
            <div key={g} className={s.bar}>
              <span className={s.barLabel}>{genreLabel(g)}</span>
              <div className={s.barTrack}><div className={s.barFill} style={{ width: `${(n / max) * 100}%` }} /></div>
              <span className={s.barN}>{n}</span>
            </div>
          ))}
        </div>
        {stats.favorite && (
          <div className={s.fav}>
            <Poster title={stats.favorite} size="xs" onClick={() => ui.openDetail(stats.favorite)} />
            <div className={s.favInfo}>
              <span className={s.favLabel}>{copy.profile.favorite}</span>
              <b>{stats.favorite.title}</b>
              <span className="u-muted">{titleMeta(stats.favorite)}</span>
            </div>
          </div>
        )}
        <Button variant="primary" size="lg" iconRight="share" className={s.share} onClick={shareYear}>{copy.profile.share}</Button>
      </Card>

      <div className={s.side}>
        <Card padding={6} radius="xl" className={s.flat}>
          <div className={s.avatarHead}>
            <Avatar seed={current} size="xl" animate="always" />
            <div className={s.settingText}>
              <h3 className={s.h3}>{copy.profile.avatar}</h3>
              <span className="u-muted">{copy.profile.avatarSub}</span>
            </div>
          </div>
          <div className={s.avatarGrid} role="radiogroup" aria-label={copy.profile.avatar}>
            {[current, ...options.filter((o) => o !== current)].slice(0, AVATAR_OPTIONS + 1).map((seed) => (
              <button key={seed} type="button" role="radio" aria-checked={seed === current} className={cx(s.avatarOption, seed === current && s.avatarOn)} onClick={() => chooseAvatar(seed)}>
                <Avatar seed={seed} size="md" />
              </button>
            ))}
          </div>
          <Button size="sm" icon="replay" className={s.moreAvatars} onClick={() => setAvatarPage((n) => n + 1)}>{copy.profile.moreAvatars}</Button>
        </Card>

        <Card padding={6} radius="xl" className={s.flat}>
          <h3 className={s.h3}>{copy.profile.theme}</h3>
          <div className={s.themes}>
            {theme.themes.map((t) => (
              <button key={t.id} type="button" aria-pressed={t.id === theme.themeId} className={cx(s.themeCard, t.id === theme.themeId && s.themeOn)} onClick={() => { theme.setTheme(t.id); show(copy.toasts.theme(t.label)); }}>
                <span className={s.swatch} style={{ background: t.bg }}><span className={s.swatchAccent} style={{ background: t.accent }} /></span>
                <b>{t.label}</b>
                <span className={s.themeDesc}>{t.description}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card padding={6} radius="xl" className={s.flat}>
          <div className={s.setting}>
            <span className={s.settingLabel}>{copy.profile.language}</span>
            <Segmented label={copy.profile.language} value={language.lang} onChange={language.setLang} options={language.languages.map((l) => ({ value: l.code, label: l.label }))} />
          </div>
          {settings.map((x) => (
            <div key={x.key} className={s.setting}>
              <div className={s.settingText}>
                <span className={s.settingLabel}>{copy.profile.settings[x.key].label}</span>
                <span className="u-muted">{copy.profile.settings[x.key].sub}</span>
              </div>
              <Switch checked={x.checked} onChange={x.toggle} label={copy.profile.settings[x.key].label} />
            </div>
          ))}
          <div className={s.platforms}>
            <span className={s.settingLabel}>{copy.profile.platforms}</span>
            <Status skeleton="chips" loading={platforms.loading} error={platforms.error} onRetry={platforms.retry}>
              <div className={s.chips}>
                {(platforms.data ?? []).map((p) => <Chip key={p.id} active={lib.myPlatforms.includes(p.id)} onClick={() => lib.togglePlatform(p.id)}>{p.name}</Chip>)}
              </div>
            </Status>
          </div>
        </Card>

        <div className={s.chips}>
          {!session.isGuest && <Button onClick={() => { session.clearProfile(); router.push(ROUTES.profiles); }}>{copy.profile.switchProfile}</Button>}
          <Button variant="ghost" onClick={logout}>{session.isGuest ? copy.menu.createAccount : copy.profile.logout}</Button>
        </div>
      </div>
    </div>
  );
}
