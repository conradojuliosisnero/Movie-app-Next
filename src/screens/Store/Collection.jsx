'use client';
// “Mi colección” (en el perfil): lo canjeado en la tienda, para equipar o quitar.
// Marcos, títulos, fondos y efectos: uno a la vez. Insignias y pines: hasta 3. Pósters: se cuelgan solos.
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button/Button';
import { useLibrary } from '@/store/LibraryContext';
import { ROUTES } from '@/config/app.config';
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import { CATALOG, RARITY } from './catalog';
import { ItemArt } from './ItemArt';
import { MAX_BADGES, SLOT_OF, lookOf, shortName } from './cosmetics';
import s from './Collection.module.css';

export default function Collection() {
  const lib = useLibrary();
  const router = useRouter();
  const store = { owned: {}, ...lib.store };
  const look = lookOf(store);
  const owned = CATALOG.filter((it) => store.owned[it.id]);

  if (!owned.length) {
    return (
      <div className={s.empty}>
        <p className="u-muted">{copy.collection.empty}</p>
        <Button size="sm" iconRight="forward" onClick={() => router.push(ROUTES.store)}>{copy.collection.toStore}</Button>
      </div>
    );
  }

  return (
    <div className={s.grid}>
      {owned.map((it) => {
        const slot = SLOT_OF[it.kind];
        const on = slot === 'badges' ? look.badges.includes(it.id) : !!slot && look[slot] === it.id;
        const full = slot === 'badges' && !on && look.badges.length >= MAX_BADGES;
        return (
          <div key={it.id} className={cx(s.item, on && s.on)}>
            <div className={cx(s.art, slot === 'wall' && s.poster)}>
              <ItemArt itemId={it.id} />
              <span className={s.rarity} style={{ background: RARITY[it.rarity].color }}>{it.rarity}</span>
              {on && <span className={s.stamp}>{copy.collection.equipped}</span>}
            </div>
            <b className={s.name}>{shortName(it.id)}</b>
            <span className={s.kind}>{it.kind}</span>
            {slot === 'wall' && <span className={s.note}>{copy.collection.onWall}</span>}
            {!slot && <span className={s.note}>{copy.collection.soon}</span>}
            {slot && slot !== 'wall' && (
              <Button size="sm" variant={on ? 'primary' : 'secondary'} disabled={full} onClick={() => lib.equip(it.id)}>
                {on ? copy.collection.unequip : full ? copy.collection.maxBadges(MAX_BADGES) : copy.collection.equip}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
