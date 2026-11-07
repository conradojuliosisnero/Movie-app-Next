// Versión pública (sin sesión) de la portada, las fichas y las personas.
// Componentes de servidor: llegan como HTML completo, que es lo que Google lee y posiciona.
import Link from 'next/link';
import { ROUTES, SITE_URL, APP } from '@/config/app.config';
import { personPath, titlePath } from '@/services/tmdbServer';
import { formatRuntime } from '@/utils/format';
import { copy } from '@/i18n';
import s from './Public.module.css';

const JsonLd = ({ data }) => (
  // eslint-disable-next-line react/no-danger
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
);

export function PublicShell({ children }) {
  return (
    <div className={s.shell} data-public>
      <header className={s.header}>
        <Link href={ROUTES.home} className={s.brand}>{APP.nameParts[0]}<span>{APP.nameParts[1]}</span></Link>
        <Link href={ROUTES.login} className={s.cta}>{copy.seo.signIn}</Link>
      </header>
      <main className={s.main}>{children}</main>
      <footer className={s.footer}>
        <nav className={s.footNav}>
          <Link href={ROUTES.home}>{copy.seo.home}</Link>
          <Link href={ROUTES.login}>{copy.seo.signIn}</Link>
        </nav>
        <p>{copy.seo.attribution} <a href="https://www.themoviedb.org" rel="noopener noreferrer" target="_blank">themoviedb.org</a></p>
      </footer>
    </div>
  );
}

function PosterGrid({ items }) {
  return (
    <ul className={s.grid}>
      {items.map((t) => (
        <li key={t.id}>
          <Link href={titlePath(t)} className={s.card}>
            <img src={t.image} alt={`${copy.seo.posterOf} ${t.title}`} loading="lazy" decoding="async" width="342" height="513" />
            <span className={s.cardTitle}>{t.title}</span>
            <span className={s.cardMeta}>{[t.type === 'series' ? copy.seo.series : copy.seo.movie, t.year].filter(Boolean).join(' · ')}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const Section = ({ title, items }) => (items?.length ? (
  <section className={s.section}>
    <h2 className={s.h2}>{title}</h2>
    <PosterGrid items={items} />
  </section>
) : null);

function SignInCta({ title, body }) {
  return (
    <aside className={s.ctaBox}>
      <div>
        <h2 className={s.h2}>{title}</h2>
        <p className={s.muted}>{body}</p>
      </div>
      <Link href={ROUTES.login} className={s.cta}>{copy.seo.signIn}</Link>
    </aside>
  );
}

export function Landing({ data }) {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: APP.name, url: SITE_URL, inLanguage: 'es', description: copy.seo.landingLead }} />
      <section className={s.landingHero}>
        <span className={s.eyebrow}>{APP.name}</span>
        <h1 className={s.h1}>{copy.seo.landingTitle}</h1>
        <p className={s.lead}>{copy.seo.landingLead}</p>
        <div className={s.actions}>
          <Link href={ROUTES.login} className={s.cta}>{copy.seo.signIn}</Link>
          <Link href={ROUTES.login} className={s.ghost}>{copy.seo.explore}</Link>
        </div>
        <ul className={s.features}>
          {copy.seo.features.map((f) => <li key={f.t}><b>{f.t}</b><span>{f.d}</span></li>)}
        </ul>
      </section>
      <Section title={copy.seo.trending} items={data.trending} />
      <Section title={copy.seo.popularMovies} items={data.movies} />
      <Section title={copy.seo.popularSeries} items={data.series} />
      <Section title={copy.seo.anime} items={data.anime} />
    </>
  );
}

export function PublicTitle({ t }) {
  if (!t) return <p className={s.lead}>{copy.seo.noData}</p>;
  if (t.adult) {
    return (
      <section className={s.restricted}>
        <span className={s.adultTag}>+18</span>
        <h1 className={s.h1}>{t.title}</h1>
        <p className={s.lead}>{copy.seo.adultBody}</p>
        <Link href={ROUTES.login} className={s.cta}>{copy.seo.signIn}</Link>
      </section>
    );
  }
  const isSeries = t.type === 'series';
  const url = `${SITE_URL}${titlePath(t)}`;
  const facts = [
    isSeries ? copy.seo.series : copy.seo.movie,
    t.year,
    t.genreNames.join(', '),
    t.minutes && formatRuntime(t.minutes),
    isSeries && t.seasonCount && copy.seo.seasons(t.seasonCount),
    t.rating && `★ ${t.rating}`,
  ].filter(Boolean);
  const ld = {
    '@context': 'https://schema.org',
    '@type': isSeries ? 'TVSeries' : 'Movie',
    name: t.title,
    alternateName: t.originalTitle !== t.title ? t.originalTitle : undefined,
    url,
    image: t.image?.replace('/w342/', '/w780/'),
    description: t.synopsis || undefined,
    datePublished: t.releaseDate || undefined,
    genre: t.genreNames,
    duration: t.minutes ? `PT${t.minutes}M` : undefined,
    numberOfSeasons: isSeries ? t.seasonCount : undefined,
    [isSeries ? 'creator' : 'director']: t.makers.map((m) => ({ '@type': 'Person', name: m.name, url: `${SITE_URL}${personPath(m)}` })),
    actor: t.cast.slice(0, 8).map((c) => ({ '@type': 'Person', name: c.name, url: `${SITE_URL}${personPath(c)}` })),
  };
  return (
    <article className={s.title}>
      <JsonLd data={ld} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: APP.name, item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: t.title, item: url },
        ],
      }} />
      <div className={s.hero}>
        {t.backdropLarge && <img className={s.heroBg} src={t.backdropLarge} alt="" fetchPriority="high" />}
        <div className={s.heroInner}>
          {t.image && <img className={s.poster} src={t.image} alt={`${copy.seo.posterOf} ${t.title}`} width="342" height="513" />}
          <div className={s.heroText}>
            <h1 className={s.h1}>{t.title}{t.year ? <span className={s.year}> ({t.year})</span> : null}</h1>
            <p className={s.facts}>{facts.join(' · ')}</p>
            {t.tagline && <p className={s.tagline}>“{t.tagline}”</p>}
            {t.makers.length > 0 && (
              <p className={s.muted}>
                {isSeries ? copy.seo.createdBy : copy.seo.directedBy}{' '}
                {t.makers.map((m, i) => <span key={m.id}>{i > 0 && ', '}<Link href={personPath(m)}>{m.name}</Link></span>)}
              </p>
            )}
            <Link href={ROUTES.login} className={s.cta}>{copy.seo.watchCta}</Link>
          </div>
        </div>
      </div>

      {t.synopsis && (
        <section className={s.section}>
          <h2 className={s.h2}>{copy.seo.synopsis}</h2>
          <p className={s.body}>{t.synopsis}</p>
        </section>
      )}

      {t.cast.length > 0 && (
        <section className={s.section}>
          <h2 className={s.h2}>{copy.seo.cast}</h2>
          <ul className={s.cast}>
            {t.cast.map((c) => (
              <li key={c.id}>
                <Link href={personPath(c)} className={s.person}>
                  {c.photo ? <img src={c.photo} alt={c.name} loading="lazy" width="185" height="278" /> : <span className={s.noPhoto}>{c.name[0]}</span>}
                  <b>{c.name}</b>
                  {c.role && <span className={s.muted}>{c.role}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SignInCta title={copy.seo.ctaTitle(t.title)} body={copy.seo.ctaBody} />
      <Section title={copy.seo.similar} items={t.similar} />
    </article>
  );
}

export function PublicPerson({ p }) {
  if (!p) return <p className={s.lead}>{copy.seo.noData}</p>;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    url: `${SITE_URL}${personPath(p)}`,
    image: p.photo || undefined,
    description: p.bio ? p.bio.slice(0, 300) : undefined,
    birthDate: p.birthday || undefined,
    birthPlace: p.place || undefined,
  };
  return (
    <article className={s.title}>
      <JsonLd data={ld} />
      <div className={s.personHead}>
        {p.photo && <img className={s.poster} src={p.photo} alt={p.name} width="342" height="513" />}
        <div className={s.heroText}>
          <h1 className={s.h1}>{p.name}</h1>
          <p className={s.facts}>{[p.knownForDept, p.birthday && copy.seo.born(p.birthday, p.place)].filter(Boolean).join(' · ')}</p>
          {p.bio && <p className={s.body}>{p.bio}</p>}
        </div>
      </div>
      <Section title={copy.seo.knownFor} items={p.knownFor} />
      <SignInCta title={copy.seo.personCtaTitle} body={copy.seo.ctaBody} />
    </article>
  );
}
