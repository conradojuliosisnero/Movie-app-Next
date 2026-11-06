'use client';
import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import SectionHeader from '@/components/ui/SectionHeader/SectionHeader';
import Status from '@/components/ui/Status/Status';
import Avatar from '@/components/ui/Avatar/Avatar';
import PosterRail from '@/components/title/PosterRail/PosterRail';
import { useAsync } from '@/hooks/useAsync';
import { getPerson } from '@/services/catalog';
import { longDate } from '@/utils/format';
import { copy } from '@/i18n';
import s from './PersonPage.module.css';

const BIO_PREVIEW = 600;

export default function PersonPage({ id }) {
  const person = useAsync(() => getPerson(id), id);
  const [expanded, setExpanded] = useState(false);
  const p = person.data;

  return (
    <Status skeleton="person" loading={person.loading} error={person.error} onRetry={person.retry}>
      {p && (
        <div className={s.page}>
          <Card padding={6} radius="2xl" className={s.hero}>
            {p.photo ? <img className={s.photo} src={p.photo} alt={p.name} /> : <Avatar name={p.name} hue={(p.id * 37) % 360} size="lg" />}
            <div className={s.info}>
              <PageHeader eyebrow={p.department} title={p.name} />
              {(p.birthday || p.place) && <span className="u-muted">{copy.person.born(longDate(p.birthday), p.place)}</span>}
              {p.deathday && <span className="u-muted">{copy.person.died(longDate(p.deathday))}</span>}
              <p className={s.bio}>
                {p.bio ? (expanded || p.bio.length <= BIO_PREVIEW ? p.bio : `${p.bio.slice(0, BIO_PREVIEW)}…`) : copy.person.noBio}
              </p>
              {p.bio.length > BIO_PREVIEW && <Button variant="link" onClick={() => setExpanded(!expanded)}>{expanded ? copy.person.less : copy.person.more}</Button>}
            </div>
          </Card>

          {p.knownFor.length > 0 && (
            <section className={s.section}>
              <SectionHeader title={copy.person.knownFor} />
              <PosterRail titles={p.knownFor} withSave />
            </section>
          )}
        </div>
      )}
    </Status>
  );
}
