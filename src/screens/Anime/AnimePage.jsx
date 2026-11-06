'use client';
// Pantalla de Animé: paleta, tipografía y entorno propios (solo en esta pantalla).
import { useRef, useState } from 'react';
import Segmented from '@/components/ui/Segmented/Segmented';
import BrandIntro from '@/components/ui/BrandIntro/BrandIntro';
import Button from '@/components/ui/Button/Button';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import Status from '@/components/ui/Status/Status';
import PosterRail from '@/components/title/PosterRail/PosterRail';
import { useSession } from '@/store/SessionContext';
import { useUI } from '@/store/UIContext';
import { useTitleActions } from '@/hooks/useTitleActions';
import { useKeyboard } from '@/hooks/useKeyboard';
import { usePaged } from '@/hooks/usePaged';
import { gsap, useGSAP, DUR, motionOK } from '@/lib/motion';
import { getAnime } from '@/services/catalog';
import { ANIME_SECTIONS, ANIME_VIBES } from '@/data/anime';
import { titleGenres } from '@/utils/format';
import { STATUS } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './AnimePage.module.css';

const FEATURED = 5;

function Section({ id, vibe, profile }) {
  const data = usePaged((page) => getAnime(id, { vibe, profile }, page), `${id}|${vibe}|${profile.kids}`);
  const text = copy.anime.sections[id];
  return (
    <section className={s.section}>
      <header className={s.sectionHead}>
        <h2 className={s.sectionTitle}>{text.title}</h2>
        <span className={s.kanaTag} lang="ja">{text.kana}</span>
      </header>
      <Status rail loading={data.loading && !data.items.length} error={!data.items.length && data.error} onRetry={data.retry}>
        {data.items.length
          ? <PosterRail titles={data.items} withSave onLoadMore={data.loadMore} hasMore={!data.done} loadingMore={data.loading} />
          : <EmptyState>{copy.anime.empty}</EmptyState>}
      </Status>
    </section>
  );
}

export default function AnimePage({ fontClass }) {
  const { profile } = useSession();
  const ui = useUI();
  const act = useTitleActions();
  const [vibe, setVibe] = useState('all');
  const [index, setIndex] = useState(0);
  const root = useRef(null);
  const heroRef = useRef(null);

  const popular = usePaged((page) => getAnime('popular', { profile }, page), `hero|${profile.kids}`);
  const featured = popular.items.filter((t) => t.backdrop).slice(0, FEATURED);
  const hero = featured[index % (featured.length || 1)];
  const go = (step) => featured.length && setIndex((i) => (i + step + featured.length) % featured.length);
  useKeyboard({ ArrowLeft: () => go(-1), ArrowRight: () => go(1) }, !!hero && !ui.detail && !ui.player);

  // Entorno: el kanji gigante se desplaza más lento que la página (parallax).
  useGSAP(() => {
    if (!motionOK()) return;
    gsap.to('[data-kana]', { yPercent: -18, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
  }, { scope: root });

  // Portada: al cambiar de destacado, la imagen entra con zoom y el título letra por letra.
  useGSAP(() => {
    if (!hero || !motionOK()) return;
    const tl = gsap.timeline();
    tl.from('[data-hero-bg]', { scale: 1.12, autoAlpha: 0, duration: DUR.slow * 2, ease: 'standard' })
      .from('[data-char]', { yPercent: 110, rotate: 8, duration: DUR.slow, ease: 'spring', stagger: 0.018 }, '<0.1')
      .from('[data-hero-fade]', { y: 16, autoAlpha: 0, duration: DUR.slow, ease: 'standard', stagger: 0.06 }, '<0.15');
  }, { dependencies: [hero?.id], scope: heroRef, revertOnUpdate: true });

  const saved = hero && act.statusOf(hero) === STATUS.WANT;

  return (
    <div ref={root} className={cx(s.page, fontClass)}>
      <BrandIntro variant="anime" fontClass={fontClass} />
      <div className={s.backdrop} aria-hidden="true">
        <span className={s.kana} data-kana lang="ja">{copy.anime.kana}</span>
      </div>

      <Status loading={popular.loading && !popular.items.length} error={!popular.items.length && popular.error} onRetry={popular.retry}>
        {hero && (
          <section ref={heroRef} className={s.hero} aria-roledescription="carrusel" aria-label={copy.anime.featured}>
            <div className={s.heroBg} data-hero-bg style={{ backgroundImage: `url(${hero.backdrop.replace('/w780/', '/w1280/')})` }} />
            <div className={s.heroShade} />
            <div className={s.heroBody}>
              <span className={s.eyebrow} data-hero-fade>{copy.anime.eyebrow}</span>
              <h1 className={s.heroTitle} aria-label={hero.title}>
                {hero.title.split(' ').map((word, w) => (
                  <span key={w} className={s.word} aria-hidden="true">
                    {[...word].map((ch, i) => <span key={i} className={s.char} data-char>{ch}</span>)}
                  </span>
                ))}
              </h1>
              <span className={s.meta} data-hero-fade>{[titleGenres(hero), hero.year, hero.rating && copy.detail.rating(hero.rating)].filter(Boolean).join(' · ')}</span>
              {hero.synopsis && <p className={s.synopsis} data-hero-fade>{hero.synopsis}</p>}
              <div className={s.actions} data-hero-fade>
                <Button variant="primary" size="lg" icon="play" onClick={() => ui.openPlayer(hero)}>{copy.common.trailer}</Button>
                <Button size="lg" variant="media" icon="save" active={saved} onClick={() => act.save(hero)}>{saved ? copy.common.saved : copy.common.save}</Button>
                <Button size="lg" variant="media" iconRight="forward" onClick={() => ui.openDetail(hero)}>{copy.anime.openDetail}</Button>
              </div>
            </div>
            <div className={s.thumbs} role="tablist" aria-label={copy.anime.featured}>
              {featured.map((t, i) => (
                <button key={t.id} type="button" role="tab" aria-selected={t.id === hero.id} aria-label={t.title} className={cx(s.thumb, t.id === hero.id && s.thumbOn)} style={{ backgroundImage: `url(${t.backdrop})` }} onClick={() => setIndex(i)}>
                  <span className={s.thumbNum}>{String(i + 1).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </Status>

      <div className={s.intro}>
        <div>
          <h2 className={s.title}>{copy.anime.title}<span className={s.titleKana} lang="ja">{copy.anime.kana}</span></h2>
          <p className={s.tagline}>{copy.anime.tagline}</p>
        </div>
        <Segmented label={copy.anime.title} value={vibe} onChange={setVibe} options={ANIME_VIBES.map((v) => ({ value: v.id, label: copy.anime.vibes[v.id] }))} />
      </div>

      {/* Enfoque: al pasar sobre una fila, las demás se atenúan (CSS :has). */}
      <div className={s.sections}>
        {ANIME_SECTIONS.map((x) => <Section key={`${x.id}-${vibe}`} id={x.id} vibe={vibe} profile={profile} />)}
      </div>
    </div>
  );
}
