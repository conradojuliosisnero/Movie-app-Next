'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SwipeCard from './SwipeCard';
import Logo from '@/components/ui/Logo/Logo';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Chip from '@/components/ui/Chip/Chip';
import Splash from '@/components/ui/Splash/Splash';
import Status from '@/components/ui/Status/Status';
import { useLibrary } from '@/store/LibraryContext';
import { useSession } from '@/store/SessionContext';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useAsync } from '@/hooks/useAsync';
import { usePlatforms } from '@/hooks/useCatalogData';
import { getTrending } from '@/services/catalog';
import { posterBackground } from '@/utils/poster';
import { APP, ROUTES, STATUS } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './OnboardingPage.module.css';

const DECISION = { right: STATUS.WANT, left: STATUS.DISMISSED, up: STATUS.SEEN };
const ACTIONS = [
  { dir: 'left', icon: 'dismiss', label: () => copy.onboarding.no, variant: 'secondary' },
  { dir: 'up', icon: 'seen', label: () => copy.onboarding.seen, variant: 'secondary' },
  { dir: 'right', icon: 'save', label: () => copy.onboarding.want, variant: 'primary' },
];

export default function OnboardingPage() {
  const lib = useLibrary();
  const session = useSession();
  const router = useRouter();
  const trending = useAsync(() => getTrending(), 'onboarding-deck');
  const platforms = usePlatforms();
  const deck = (trending.data ?? []).slice(0, APP.onboardingDeckSize);
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState(null);
  const card = deck[index];
  const next = deck[index + 1];

  // La primera vez se usa el perfil principal de la cuenta.
  useEffect(() => {
    if (!session.profile && session.profiles[0]) session.selectProfile(session.profiles[0].id);
  }, [session]);

  useEffect(() => {
    if (session.onboarded) router.replace(ROUTES.profiles);
  }, [session.onboarded, router]);

  const decide = (dir) => {
    if (exit || !card) return;
    lib.setStatus(card, DECISION[dir]);
    setExit(dir);
    setTimeout(() => { setExit(null); setIndex((i) => i + 1); }, 300);
  };

  useKeyboard({ ArrowLeft: () => decide('left'), ArrowRight: () => decide('right'), ArrowUp: () => decide('up') }, !!card);

  const finish = async () => { await session.completeOnboarding(); router.replace(ROUTES.profiles); };

  if (!lib.ready || trending.loading) return <Splash />;

  return (
    <div className={s.page}>
      <div className={s.top}>
        <Logo />
        <div className={s.progress}>
          {[...deck, null].map((_, i) => <span key={i} className={cx(s.seg, (i < index || !card) && s.segOn)} />)}
        </div>
      </div>

      {card ? (
        <>
          <div className={s.head}>
            <h1 className={s.title}>{copy.onboarding.title}</h1>
            <p className="u-muted">{copy.onboarding.subtitle(deck.length)}</p>
          </div>
          <div className={s.stack}>
            {next && <div className={s.behind} style={{ background: next.image ? `url(${next.image}) center / cover` : posterBackground(next.hues) }} />}
            <SwipeCard key={card.id} title={card} exit={exit} onDecide={decide} />
          </div>
          <div className={s.actions}>
            {ACTIONS.map((a) => (
              <div key={a.dir} className={s.action}>
                <Button variant={a.variant} size="xl" icon={a.icon} aria-label={a.label()} onClick={() => decide(a.dir)} />
                <span className={s.actionLabel}>{a.label()}</span>
              </div>
            ))}
          </div>
          <Button variant="link" onClick={() => setIndex(deck.length)}>{copy.onboarding.skip}</Button>
        </>
      ) : (
        <Card className={s.platforms} padding={8} radius="2xl">
          <h1 className={s.title}>{copy.onboarding.platformsTitle}</h1>
          <p className="u-muted">{copy.onboarding.platformsSubtitle}</p>
          <Status skeleton="chips" loading={platforms.loading} error={platforms.error} onRetry={platforms.retry}>
            <div className={s.chips}>
              {(platforms.data ?? []).map((p) => <Chip key={p.id} active={lib.myPlatforms.includes(p.id)} onClick={() => lib.togglePlatform(p.id)}>{p.name}</Chip>)}
            </div>
          </Status>
          <Button variant="primary" size="lg" block iconRight="forward" onClick={finish}>{copy.onboarding.done}</Button>
        </Card>
      )}
    </div>
  );
}
