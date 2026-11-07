import { ItemArt } from "../ItemArt";
import { RARITY } from "../catalog";
import { fmt, priceFor } from "../economy";

export function ItemCard({ item, left, mult, status, onClaim }) {
  const owned = status.reason === "owned";
  const soldOut = status.reason === "soldout";
  const price = owned ? item.base : priceFor(item.base, mult);
  const low = left > 0 && left / item.total <= 0.25;
  const stockColor = soldOut ? "#4a4744" : low ? "#ff6a3d" : "#8d8a84";

  return (
    <article className={"tn-card tn-item" + (soldOut ? " is-soldout" : "")}>
      <div className="tn-item__art">
        <ItemArt itemId={item.id} />
        <span className="tn-chip tn-item__rarity" style={{ background: RARITY[item.rarity].color }}>{item.rarity}</span>
        {status.stamp && <span className="tn-stamp tn-item__stamp">{status.stamp}</span>}
      </div>
      <div className="tn-item__body">
        <div>
          <h4 className="tn-item__name">{item.name}</h4>
          <p className="tn-item__desc">{item.desc}</p>
        </div>
        <div>
          <div className="tn-row tn-mono tn-xs tn-dim">
            <span>STOCK</span>
            <span style={{ color: stockColor }}>{soldOut ? "AGOTADO" : `${left} / ${item.total}`}</span>
          </div>
          <div className="tn-stock"><div style={{ width: (left / item.total) * 100 + "%", background: stockColor }} /></div>
        </div>
        <div className="tn-item__foot">
          <div>
            <div className="tn-item__base">{!owned && mult > 1 ? fmt(item.base) : ""}</div>
            <div className="tn-item__price">{fmt(price)} <span>pts</span></div>
          </div>
          <button className="tn-btn" disabled={!status.ok} onClick={() => onClaim(item)}>{status.label}</button>
        </div>
      </div>
    </article>
  );
}
