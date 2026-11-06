'use client';
import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import SearchField from '@/components/ui/SearchField/SearchField';
import Card from '@/components/ui/Card/Card';
import Chip from '@/components/ui/Chip/Chip';
import Button from '@/components/ui/Button/Button';
import Icon from '@/components/ui/Icon/Icon';
import { useToast } from '@/store/ToastContext';
import { answerQuestion, visibleFaq } from '@/services/catalog';
import { FAQ, HELP_TOPICS } from '@/data/faq';
import { ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './HelpPage.module.css';

const FAQ_BY_ID = Object.fromEntries(FAQ.map((f) => [f.id, f]));

export default function HelpPage() {
  const { show } = useToast();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [open, setOpen] = useState(null);
  const done = (msg) => { show(msg); setAnswer(null); setQuestion(''); };

  return (
    <div className={s.page}>
      <PageHeader eyebrow={copy.help.eyebrow} title={copy.help.title} />
      <SearchField value={question} onChange={setQuestion} onSubmit={(v) => v.trim() && setAnswer(answerQuestion(v))} placeholder={copy.help.placeholder} submitLabel={copy.help.ask} />

      <div className={s.chips}>
        {HELP_TOPICS.map((t) => {
          const f = FAQ_BY_ID[t.faqId];
          return <Chip key={t.id} onClick={() => setAnswer({ q: f.q, a: f.a })}>{copy.help.topics[t.id]}</Chip>;
        })}
      </div>

      {answer && (
        <Card padding={6} radius="xl" className={s.answer}>
          <span className={s.answerLabel}>{copy.help.answer}</span>
          <h2 className={s.answerQ}>{answer.q}</h2>
          <p>{answer.a}</p>
          <div className={s.row}>
            <span className="u-muted">{copy.help.helpful}</span>
            <Button size="sm" onClick={() => done(copy.toasts.thanks)}>{copy.help.yes}</Button>
            <Button size="sm" onClick={() => done(copy.toasts.sorry)}>{copy.help.no}</Button>
          </div>
        </Card>
      )}

      <Card padding={0} radius="xl" className={s.faq}>
        <span className={cx('u-eyebrow', s.faqHead)}>{copy.help.faq}</span>
        {visibleFaq().map((f) => {
          const isOpen = open === f.id;
          return (
            <div key={f.id} className={s.faqItem}>
              <button type="button" aria-expanded={isOpen} className={s.faqQ} onClick={() => setOpen(isOpen ? null : f.id)}>
                {f.q}
                <Icon name={isOpen ? 'collapse' : 'expand'} size="md" className={s.faqIcon} />
              </button>
              {isOpen && <p className={s.faqA}>{f.a}</p>}
            </div>
          );
        })}
      </Card>

      <div className={s.contact}>
        <Link href={ROUTES.news}>{copy.help.news} ›</Link>
      </div>
    </div>
  );
}
