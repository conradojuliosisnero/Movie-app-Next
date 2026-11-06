'use client';
import { useEffect, useRef, useState } from 'react';
import Avatar, { avatarSeed } from '@/components/ui/Avatar/Avatar';
import Button from '@/components/ui/Button/Button';
import { useUI } from '@/store/UIContext';
import { useSession } from '@/store/SessionContext';
import { useToast } from '@/store/ToastContext';
import { PARTY_MEMBERS } from '@/store/UIContext';
import { APP } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './WatchParty.module.css';

// Panel de la sala “Ver juntos” con chat. Conectar a WebSocket en producción.
export default function WatchParty() {
  const ui = useUI();
  const { profile } = useSession();
  const { show } = useToast();
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [ui.party.messages.length]);

  const submit = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    ui.sendMessage(v);
    setText('');
  };

  return (
    <aside className={s.panel}>
      <header className={s.head}>
        <h3 className={s.name}>{copy.player.room(profile?.name ?? '')}</h3>
        <span className={s.status}><span className={s.live} />{copy.player.connected(APP.partyMembers)}</span>
        <div className={s.members}>
          <Avatar seed={avatarSeed(profile)} size="sm" />
          {PARTY_MEMBERS.map((m) => <Avatar key={m.name} name={m.name} hue={m.hue} size="sm" />)}
          <Button size="sm" variant="media" icon="add" onClick={() => show(copy.toasts.inviteCopied)}>{copy.player.invite}</Button>
        </div>
      </header>
      <div className={s.messages} ref={listRef}>
        {ui.party.messages.map((m, i) => (
          <div key={i} className={cx(s.msg, m.mine && s.mine)}>
            <b className={s.from}>{m.from}</b>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <form className={s.form} onSubmit={submit}>
        <input className={s.input} value={text} onChange={(e) => setText(e.target.value)} placeholder={copy.player.chatPlaceholder} />
        <Button type="submit" variant="primary" icon="send" aria-label={copy.player.send} />
      </form>
    </aside>
  );
}
