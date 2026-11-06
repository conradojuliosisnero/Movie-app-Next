'use client';
// Isla flotante tipo iOS: avisos breves y acceso rápido a la sala activa.
import { useToast } from '@/store/ToastContext';
import { useUI } from '@/store/UIContext';
import { useSession } from '@/store/SessionContext';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './ToastIsland.module.css';

export default function ToastIsland() {
  const { toast } = useToast();
  const ui = useUI();
  const { profile } = useSession();
  const partyMini = !toast && ui.party.active && !ui.player && !!profile;
  const open = !!toast || partyMini;
  const message = toast?.message ?? (partyMini ? copy.toasts.partyMini(profile.name) : '');

  return (
    <div
      role="status"
      aria-live="polite"
      className={cx(s.island, open && s.open, partyMini && s.clickable)}
      onClick={partyMini ? ui.reopenPlayer : undefined}
    >
      <span className={cx(s.dot, partyMini && s.live)} />
      <span>{message}</span>
    </div>
  );
}
