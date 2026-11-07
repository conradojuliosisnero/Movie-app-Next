'use client';
// Estado de capas superpuestas: ficha del título, reproductor y sala “Ver juntos”.
// La ficha abierta se refleja en la URL (?t=movie-550) para poder compartirla.
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useToast } from './ToastContext';
import { APP } from '@/config/app.config';
import { copy } from '@/i18n';

const UIContext = createContext(null);

// Demo de “Ver juntos” (APP.features.watchParty). Reemplazar por una sala real.
const PARTY_SEED = [{ from: 'Leo', text: '¿Listos? Le doy play en 3…' }, { from: 'Mia', text: '¡yaaa!' }];
const PARTY_REPLIES = ['jajaja', 'no puede ser', 'ESA PARTE', '10/10', 'shhh que empieza'];
export const PARTY_MEMBERS = [{ name: 'Leo', hue: 30 }, { name: 'Mia', hue: 140 }];

function setUrlTitle(id) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set('t', id);
  else url.searchParams.delete('t');
  window.history.replaceState(window.history.state, '', url);
}

export function UIProvider({ children }) {
  const { show } = useToast();
  const [detail, setDetail] = useState(null); // { item, proposed }
  const [player, setPlayer] = useState(null); // { item, mode: 'trailer' | 'full', season?, ep? }
  const [party, setParty] = useState({ active: false, messages: [] });
  const [menuOpen, setMenuOpen] = useState(false);
  const lastPlayer = useRef(null);
  const pickRun = useRef(0); // si cierras el panel antes de que llegue la sugerencia, se descarta

  const startParty = useCallback(() => {
    setParty((p) => ({ active: true, messages: p.messages.length ? p.messages : PARTY_SEED }));
    show(copy.toasts.partyCreated);
  }, [show]);

  const value = useMemo(
    () => ({
      detail,
      player,
      party,
      menuOpen,
      setMenuOpen,
      /** item puede ser un título completo o solo { id }; la ficha carga el resto. */
      openDetail: (item, opts = {}) => {
        setMenuOpen(false);
        setDetail({ item, proposed: !!opts.proposed });
        setUrlTitle(item.id);
      },
      closeDetail: () => { pickRun.current += 1; setDetail(null); setUrlTitle(null); },
      /** Abre el panel enseguida con esqueleto y lo llena cuando llega la sugerencia. */
      suggest: async (pick) => {
        const run = ++pickRun.current;
        setMenuOpen(false);
        setDetail({ item: null, proposed: true, loading: true });
        let t = null;
        let failed = false;
        try { t = await pick(); } catch { failed = true; }
        if (run !== pickRun.current) return;
        if (t) { setDetail({ item: t, proposed: true }); setUrlTitle(t.id); return; }
        setDetail(null);
        show(failed ? copy.common.error : copy.toasts.allSeen);
      },
      openPlayer: (item, opts = {}) => {
        const next = { item, mode: opts.mode ?? 'trailer', season: opts.season, ep: opts.ep };
        lastPlayer.current = next;
        setPlayer(next);
        if (opts.party && APP.features.watchParty && !party.active) startParty();
      },
      reopenPlayer: () => lastPlayer.current && setPlayer(lastPlayer.current),
      closePlayer: () => setPlayer(null),
      toggleParty: () => {
        if (party.active) { setParty((p) => ({ ...p, active: false })); show(copy.toasts.partyLeft); }
        else startParty();
      },
      sendMessage: (text) => {
        setParty((p) => ({ ...p, messages: [...p.messages, { from: copy.player.you, text, mine: true }] }));
        setTimeout(() => {
          const from = PARTY_MEMBERS[Math.floor(Math.random() * PARTY_MEMBERS.length)].name;
          const reply = PARTY_REPLIES[Math.floor(Math.random() * PARTY_REPLIES.length)];
          setParty((p) => ({ ...p, messages: [...p.messages, { from, text: reply }] }));
        }, 1300);
      },
    }),
    [detail, player, party, menuOpen, show, startParty]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export const useUI = () => useContext(UIContext);
