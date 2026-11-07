'use client';
// Ranking: tu racha (tira de película), tus puntos (boleto con tu puesto), cofres del día,
// top 50 (solo nombre de perfil y avatar) y el tarifario de puntos.
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap, useGSAP, DUR, motionOK } from '@/lib/motion';
import Avatar from '@/components/ui/Avatar/Avatar';
import Button from '@/components/ui/Button/Button';
import Status from '@/components/ui/Status/Status';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import { StreakCard } from '@/components/ui/Streak/Streak';
import Chests from '@/components/ui/Chests/Chests';
import { ItemArt } from '@/screens/Store/ItemArt';
import { shortName } from '@/screens/Store/cosmetics';
import { storage } from '@/services/storage';
import { useAsync } from '@/hooks/useAsync';
import { useLibrary } from '@/store/LibraryContext';
import { useSession } from '@/store/SessionContext';
import { CHESTS, DAILY_CAP, POINTS, TOP, entryId, todayPoints, topPlayers } from '@/services/ranking';
import { ROUTES, STATUS } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './RankingPage.module.css';

const RULES = [
  ['day', POINTS.day], ['week', POINTS.week], ['watched', POINTS.watched],
  ['want', POINTS[STATUS.WANT]], ['seen', POINTS[STATUS.SEEN]], ['dismissed', POINTS[STATUS.DISMISSED]],
  ['chest', CHESTS.daily.join('–')], ['rare', CHESTS.rare.join('–')],
];
const MEDALS = ['#f5c04a', '#cfd3da', '#d29a6a'];
const fmt = (n) => n.toLocaleString('es-CO');
const pad = (n) => String(n).padStart(2, '0');

export default function RankingPage() {
  const session = useSession();
  const lib = useLibrary();
  const router = useRouter();
  const top = useAsync(topPlayers, 'ranking');
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const mine = session.user && session.profile ? entryId(session.user.uid, session.profile.id) : null;
  const players = top.data ?? [];
  const myPos = players.findIndex((p) => p.id === mine) + 1;
  const today = todayPoints(lib);
  const pct = Math.min(100, Math.round((today / DAILY_CAP) * 100));
  // Efecto “Palomitas que saltan”: si subiste de puesto desde la última vez que viste el ranking.
  const [climbed, setClimbed] = useState(false);
  useEffect(() => {
    if (!myPos) return;
    const prev = storage.get('rankPos', 0);
    if (prev && myPos < prev) setClimbed(true);
    storage.set('rankPos', myPos);
  }, [myPos]);

  // Entrada: las tarjetas suben en cascada; el número del puesto cae como un sello.
  useGSAP(() => {
    if (!motionOK()) return;
    gsap.from('[data-block]', { y: 22, autoAlpha: 0, duration: DUR.slow, ease: 'standard', stagger: 0.07, clearProps: 'transform,opacity,visibility' });
  }, { scope: rootRef });
  useGSAP(() => {
    if (!motionOK()) return;
    if (players.length) gsap.from('[data-row]', { x: -16, autoAlpha: 0, duration: DUR.slow, ease: 'standard', stagger: 0.03, clearProps: 'all' });
    if (myPos) gsap.from('[data-pos]', { scale: 2.2, rotate: -12, autoAlpha: 0, duration: 0.6, ease: 'back.out(2.5)', delay: 0.3 });
  }, { dependencies: [players.length, myPos], scope: rootRef });

  let note = null;
  if (session.isGuest) note = copy.ranking.guest;
  else if (lib.settings.ranking === false) note = copy.ranking.hidden;
  else if (top.data && !myPos) note = copy.ranking.outOfTop;

  return (
    <div ref={rootRef} className={s.page}>
      <header className={s.header} data-block>
        <span className={s.label}>{copy.ranking.eyebrow(TOP)}</span>
        <h1 className={s.h1}>{copy.ranking.title}</h1>
      </header>

      <section className={s.top}>
        <div className={cx(s.card, s.streak)} data-block><StreakCard /></div>

        {/* Boleto: tus puntos y lo de hoy; en el talón, tu puesto. */}
        <div className={cx(s.card, s.ticket)} data-block>
          <div className={s.ticketMain}>
            <span className={s.label}>{copy.ranking.yourPoints}</span>
            <div className={s.points}>{fmt(lib.score)} <span>pts</span></div>
            {note && <p className={s.note}>{note}</p>}
            <Button size="sm" iconRight="forward" onClick={() => router.push(ROUTES.store)}>{copy.ranking.toStore}</Button>
            {session.isGuest && <Button size="sm" variant="primary" onClick={async () => { await session.logout(); router.replace(ROUTES.login); }}>{copy.menu.createAccount}</Button>}
            <div className={s.progress}>
              <div className={s.progressRow}>
                <span>{copy.ranking.todayLabel} <b>{today}</b> / {DAILY_CAP}</span>
                <span>{pct}%</span>
              </div>
              <div className={s.bar}><div style={{ width: `${pct}%` }} /></div>
            </div>
          </div>
          <div className={s.stub}>
            <span className={s.label}>{copy.ranking.position}</span>
            <span className={s.pos} data-pos>{myPos ? pad(myPos) : '—'}</span>
            <span className={s.of}>{copy.ranking.of(pad(players.length))}</span>
          </div>
        </div>
      </section>

      <div className={cx(s.card, s.chests)} data-block><Chests /></div>

      <section className={s.bottom}>
        <div aria-label={copy.ranking.title} data-block>
          <Status loading={top.loading} error={top.error} onRetry={top.retry} skeleton="cards">
            {players.length ? (
              <ol ref={listRef} className={s.board}>
                {players.map((p, i) => {
                  const look = p.look ?? {};
                  const isMe = p.id === mine;
                  return (
                    <li key={p.id} data-row className={cx(s.row, isMe && s.me, look.background && s.hasBg)}>
                      {/* Fondo equipado detrás de la fila. */}
                      {look.background && <span className={s.rowBg} aria-hidden="true"><ItemArt itemId={look.background} /></span>}
                      <span className={s.rank} style={{ color: MEDALS[i] }}>{pad(i + 1)}</span>
                      <Avatar seed={p.avatar || p.id} frame={look.frame} size="md" />
                      <span className={s.who}>
                        {/* Efecto “Créditos finales”: el nombre sube como créditos en el top 3. */}
                        <span className={cx(s.name, look.effect === 'creditos' && i < 3 && s.credits)}>
                          {p.name}{isMe && <em className={s.you}>{copy.ranking.you}</em>}
                          {(look.badges ?? []).map((b) => <span key={b} className={s.badge} title={shortName(b)}><ItemArt itemId={b} /></span>)}
                        </span>
                        {look.title && <span className={s.titleTag}>{shortName(look.title)}</span>}
                      </span>
                      <b className={s.rowPts}>{fmt(p.score)}</b>
                      {isMe && climbed && look.effect === 'saltan' && (
                        <span className={s.popcorn} aria-hidden="true">{Array.from({ length: 7 }, (_, k) => <i key={k} style={{ '--k': k }}>🍿</i>)}</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            ) : <EmptyState>{copy.ranking.empty}</EmptyState>}
          </Status>
        </div>

        {/* Tarifario: recibo de papel con los puntos por acción. */}
        <aside className={s.receipt} data-block>
          <div className={s.receiptHead}>
            <div className={s.receiptTitle}>{copy.ranking.receipt.title}</div>
            <div className={s.receiptSub}>{copy.ranking.receipt.sub}</div>
          </div>
          <hr />
          {RULES.map(([k, n]) => (
            <div key={k} className={s.line}>
              <span>{copy.ranking.rules[k]}</span>
              <span className={s.dots} />
              <b>+{n}</b>
            </div>
          ))}
          <hr />
          <p className={s.receiptNote}>{copy.ranking.receipt.note(DAILY_CAP)}</p>
        </aside>
      </section>
    </div>
  );
}
