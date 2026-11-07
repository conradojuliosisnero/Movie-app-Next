'use client';
// Tienda de coleccionables (diseño de new-interface/tienda). Stock y compras en Firestore (services/store);
// lo que tiene el perfil y lo gastado, en su lista. Saldo = puntos ganados − gastado: el ranking no baja.
import { useRef, useState } from 'react';
import { gsap, useGSAP, DUR, motionOK } from '@/lib/motion';
import { celebrate } from '@/lib/confetti';
import { useAsync } from '@/hooks/useAsync';
import Status from '@/components/ui/Status/Status';
import { useLibrary } from '@/store/LibraryContext';
import { useSession } from '@/store/SessionContext';
import { useToast } from '@/store/ToastContext';
import { claimItem, joinRaffle, loadStock, raffleCount } from '@/services/store';
import { weekKey, todayKey } from '@/services/ranking';
import { CATALOG, CATEGORIES } from './catalog';
import { DEFAULTS, claimStatus, multiplier, priceFor } from './economy';
import { BalanceTicket } from './components/BalanceTicket';
import { RaffleCard } from './components/RaffleCard';
import { PriceMultiplier } from './components/PriceMultiplier';
import { CategoryTabs } from './components/CategoryTabs';
import { ItemCard } from './components/ItemCard';
import { HouseRules } from './components/HouseRules';
import { ClaimModal } from './components/ClaimModal';
import './store.css';

// “2d 14h” hasta una fecha.
const until = (date) => {
  const h = Math.max(0, Math.floor((date - Date.now()) / 36e5));
  return `${Math.floor(h / 24)}d ${h % 24}h`;
};

export default function StorePage() {
  const lib = useLibrary();
  const session = useSession();
  const { show } = useToast();
  const stock = useAsync(loadStock, 'store-stock');
  const raffle = useAsync(raffleCount, 'store-raffle');
  const [local, setLocal] = useState({ stock: {}, raffle: 0 }); // cambios de esta visita, sin volver a pedir
  const [filter, setFilter] = useState('Todos');
  const [pending, setPending] = useState(null);
  const rootRef = useRef(null);

  const now = new Date();
  const season = todayKey().slice(0, 7);
  const week = weekKey();
  const store = { owned: {}, spent: 0, raffleWeek: null, ...lib.store };
  const mine = Object.values(store.owned);
  const ownedCount = mine.filter((o) => o.season === season).length;
  const claims = mine.filter((o) => o.at >= week).length;
  const mult = multiplier(ownedCount);
  const balance = Math.max(0, lib.score - store.spent);
  const left = { ...stock.data, ...local.stock };
  const joined = store.raffleWeek === week;
  const guest = session.isGuest || !session.user;

  const ctx = { owned: store.owned, stock: left, claims, balance, mult, weeklyLimit: DEFAULTS.weeklyLimit, guest };
  const items = CATALOG.filter((it) => filter === 'Todos' || it.kind === filter);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7 - ((now.getDay() + 6) % 7));

  // Entrada en cascada (mismo lenguaje que el ranking).
  useGSAP(() => {
    if (!motionOK()) return;
    gsap.from('[data-block]', { y: 22, autoAlpha: 0, duration: DUR.slow, ease: 'standard', stagger: 0.07, clearProps: 'transform,opacity,visibility' });
  }, { scope: rootRef });
  useGSAP(() => {
    if (!motionOK() || !stock.data) return;
    gsap.from('.tn-item', { y: 18, scale: 0.97, autoAlpha: 0, duration: DUR.slow, ease: 'standard', stagger: 0.03, clearProps: 'transform,opacity,visibility' });
  }, { dependencies: [filter, !!stock.data], scope: rootRef });

  const claim = async (item) => {
    const price = priceFor(item.base, mult);
    try {
      await claimItem({ uid: session.user.uid, profileId: session.profile.id, itemId: item.id, price });
      lib.buyItem(item.id, price);
      setLocal((l) => ({ ...l, stock: { ...l.stock, [item.id]: (left[item.id] ?? 1) - 1 } }));
      celebrate();
      show(`¡${item.name} es tuyo!`);
    } catch (e) {
      if (e.message === 'soldout') setLocal((l) => ({ ...l, stock: { ...l.stock, [item.id]: 0 } }));
      show(e.message === 'owned' ? 'Tu cuenta ya lo tiene (en otro perfil).' : e.message === 'soldout' ? 'Se agotó justo ahora.' : 'No se pudo canjear. Intenta de nuevo.');
    }
  };

  const enterRaffle = async () => {
    try {
      await joinRaffle({ uid: session.user.uid, name: session.profile.name });
      lib.joinedRaffle(DEFAULTS.raffleCost);
      setLocal((l) => ({ ...l, raffle: l.raffle + 1 }));
      show('Estás dentro del sorteo del Boleto Dorado');
    } catch {
      show('No se pudo entrar al sorteo (¿ya participa tu cuenta esta semana?).');
    }
  };

  return (
    <div ref={rootRef} className="tn-page">
      <header className="tn-header" data-block>
        <div>
          <div className="tn-label">TIENDA · TEMPORADA {now.toLocaleDateString('es', { month: 'long' }).toUpperCase()}</div>
          <h1>Coleccionables</h1>
          <p className="tn-sm tn-soft">Stock limitado, uno por persona y precios anclados a lo que gana un usuario promedio. Nadie puede llevarse todo.</p>
          {guest && <p className="tn-sm tn-accent">En modo explorar puedes mirar; para canjear necesitas tu cuenta.</p>}
        </div>
        <BalanceTicket balance={balance} claims={claims} weeklyLimit={DEFAULTS.weeklyLimit} />
      </header>

      <section className="tn-hero" data-block>
        <RaffleCard
          count={(raffle.data ?? 0) + local.raffle}
          joined={joined}
          cost={DEFAULTS.raffleCost}
          endsIn={until(nextMonday)}
          canAfford={!guest && balance >= DEFAULTS.raffleCost}
          onJoin={enterRaffle}
        />
        <PriceMultiplier mult={mult} ownedCount={ownedCount} incrementPct={DEFAULTS.incrementPct} resetDate={`el ${nextMonth.toLocaleDateString('es', { day: 'numeric', month: 'long' })}`} />
      </section>

      <div className="tn-toolbar" data-block>
        <CategoryTabs categories={CATEGORIES} value={filter} onChange={setFilter} />
        <span className="tn-sm tn-muted">La temporada termina en <span className="tn-mono tn-white">{until(nextMonth)}</span></span>
      </div>

      <section className="tn-main">
        <Status skeleton="cards" loading={stock.loading} error={stock.error} onRetry={stock.retry}>
        <div className="tn-grid">
          {stock.data && items.map((it) => (
            <ItemCard key={it.id} item={it} left={left[it.id] ?? 0} mult={mult} status={claimStatus(it, ctx)} onClaim={setPending} />
          ))}
        </div>
        </Status>
        <HouseRules weeklyLimit={DEFAULTS.weeklyLimit} incrementPct={DEFAULTS.incrementPct} />
      </section>

      <ClaimModal
        item={pending}
        left={pending ? left[pending.id] : 0}
        balance={balance}
        mult={mult}
        ownedCount={ownedCount}
        incrementPct={DEFAULTS.incrementPct}
        claims={claims}
        weeklyLimit={DEFAULTS.weeklyLimit}
        onCancel={() => setPending(null)}
        onConfirm={(it) => { setPending(null); claim(it); }}
      />
    </div>
  );
}
