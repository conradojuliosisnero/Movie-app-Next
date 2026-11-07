import { formatMult } from "../economy";

export function PriceMultiplier({ mult, ownedCount, incrementPct, resetDate = "el 1 de diciembre", segments = 10 }) {
  return (
    <div className="tn-card tn-mult">
      <div className="tn-row">
        <span className="tn-title">Tu precio</span>
        <span className="tn-mult__value">{formatMult(mult)}</span>
      </div>
      <div className="tn-mult__bar">
        {Array.from({ length: segments }, (_, i) => <span key={i} className={i < ownedCount ? "is-on" : ""} />)}
      </div>
      <p className="tn-sm tn-soft">
        Tienes <b className="tn-white">{ownedCount}</b> coleccionables esta temporada. Cada uno sube tu precio{" "}
        <b className="tn-accent">+{incrementPct}%</b>. Se reinicia {resetDate}.
      </p>
    </div>
  );
}
