'use client';
// Ranking: top 50 por puntaje (solo nombre de perfil y avatar), tu racha y cómo ganar puntos.
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap, useGSAP, DUR, motionOK } from '@/lib/motion';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import Card from '@/components/ui/Card/Card';
import Avatar from '@/components/ui/Avatar/Avatar';
import Button from '@/components/ui/Button/Button';
import Status from '@/components/ui/Status/Status';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import { StreakCard } from '@/components/ui/Streak/Streak';
import Chests from '@/components/ui/Chests/Chests';
import { useAsync } from '@/hooks/useAsync';
import { useLibrary } from '@/store/LibraryContext';
import { useSession } from '@/store/SessionContext';
import { CHESTS, DAILY_CAP, POINTS, TOP, entryId, todayPoints, topPlayers } from '@/services/ranking';
import { ROUTES, STATUS } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './RankingPage.module.css';

const HOW = [
  ['day', POINTS.day], ['week', POINTS.week], ['watched', POINTS.watched],
  ['want', POINTS[STATUS.WANT]], ['seen', POINTS[STATUS.SEEN]], ['dismissed', POINTS[STATUS.DISMISSED]],
  ['chest', CHESTS.daily.join('–')], ['rare', CHESTS.rare.join('–')],
];
const fmt = (n) => n.toLocaleString('es-CO');

export default function RankingPage() {
  const session = useSession();
  const lib = useLibrary();
  const router = useRouter();
  const top = useAsync(topPlayers, 'ranking');
  const listRef = useRef(null);
  const mine = session.user && session.profile ? entryId(session.user.uid, session.profile.id) : null;
  const players = top.data ?? [];
  const myPos = players.findIndex((p) => p.id === mine) + 1;

  // Las filas entran en cascada.
  useGSAP(() => {
    if (!players.length || !motionOK()) return;
    gsap.from('[data-row]', { y: 18, autoAlpha: 0, duration: DUR.slow, ease: 'standard', stagger: 0.03, clearProps: 'all' });
  }, { dependencies: [players.length], scope: listRef });

  let note = null;
  if (session.isGuest) note = copy.ranking.guest;
  else if (lib.settings.ranking === false) note = copy.ranking.hidden;
  else if (top.data && !myPos) note = copy.ranking.outOfTop;

  return (
    <div className={s.page}>
      <PageHeader eyebrow={copy.ranking.eyebrow(TOP)} title={copy.ranking.title} />

      <div className={s.top}>
        <Card padding={6} radius="xl" className={s.flat}><StreakCard /></Card>
        <Card padding={6} radius="xl" className={s.flat}>
          <span className="u-eyebrow">{copy.ranking.yourPoints}</span>
          <div className={s.score}><b>{fmt(lib.score)}</b> pts{myPos > 0 && <span className={s.pos}>#{myPos}</span>}</div>
          {/* Tope diario: barra de lo ganado hoy. */}
          <div className={s.today}>
            <span className={s.todayLabel}>{copy.ranking.today(todayPoints(lib), DAILY_CAP)}</span>
            <span className={s.todayTrack}><span className={s.todayFill} style={{ width: `${Math.min(100, (todayPoints(lib) / DAILY_CAP) * 100)}%` }} /></span>
          </div>
          {note && <p className="u-muted">{note}</p>}
          {session.isGuest && <Button variant="primary" onClick={async () => { await session.logout(); router.replace(ROUTES.login); }}>{copy.menu.createAccount}</Button>}
        </Card>
      </div>

      <Card padding={6} radius="xl" className={s.flat}><Chests /></Card>

      <div className={s.cols}>
        <section className={s.board} aria-label={copy.ranking.title}>
          <Status loading={top.loading} error={top.error} onRetry={top.retry} skeleton="cards">
            {players.length ? (
              <ol ref={listRef} className={s.list}>
                {players.map((p, i) => (
                  <li key={p.id} data-row className={cx(s.row, i < 3 && s[`medal${i + 1}`], p.id === mine && s.me)}>
                    <span className={s.rank}>{i + 1}</span>
                    <Avatar seed={p.avatar || p.id} size="md" />
                    <span className={s.name}>{p.name}{p.id === mine && <em className={s.you}>{copy.ranking.you}</em>}</span>
                    <b className={s.points}>{fmt(p.score)}</b>
                  </li>
                ))}
              </ol>
            ) : <EmptyState>{copy.ranking.empty}</EmptyState>}
          </Status>
        </section>

        <Card as="aside" padding={6} radius="xl" className={s.flat}>
          <h2 className={s.h2}>{copy.ranking.howTitle}</h2>
          <ul className={s.how}>
            {HOW.map(([k, n]) => <li key={k}><span>{copy.ranking.how[k]}</span><b>+{n}</b></li>)}
          </ul>
          <p className={cx('u-muted', s.small)}>{copy.ranking.capNote(DAILY_CAP)}</p>
          <p className={cx('u-muted', s.small)}>{copy.ranking.watchedNote}</p>
        </Card>
      </div>
    </div>
  );
}
