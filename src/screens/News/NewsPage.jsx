import PageHeader from '@/components/ui/PageHeader/PageHeader';
import Card from '@/components/ui/Card/Card';
import { UPDATES } from '@/data/updates';
import { longDate } from '@/utils/format';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './NewsPage.module.css';

export default function NewsPage() {
  return (
    <div className={s.page}>
      <PageHeader eyebrow={copy.news.eyebrow} title={copy.news.title} />
      <Card padding={2} radius="xl" className={s.list}>
        {UPDATES.map((u) => (
          <article key={u.id} className={s.item}>
            <div className={s.head}>
              <span className={cx(s.badge, s[u.type])}>{copy.news.types[u.type]}</span>
              <time className="u-eyebrow" dateTime={u.date}>{longDate(u.date)}</time>
            </div>
            <p>{u.content}</p>
          </article>
        ))}
      </Card>
    </div>
  );
}
