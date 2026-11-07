import { useEffect } from "react";
import { createPortal } from "react-dom";
import { fmt, formatMult, multiplier, priceFor } from "../economy";

export function ClaimModal({ item, left, balance, mult, ownedCount, incrementPct, claims, weeklyLimit, onCancel, onConfirm }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  if (!item) return null;
  const price = priceFor(item.base, mult);
  // Sobre <body>: dentro de <main> quedaría por debajo de la barra de navegación.
  return createPortal(
    <div className="tn-overlay" onClick={onCancel}>
      <div className="tn-receipt tn-modal" role="dialog" aria-modal="true" aria-label={item.name} onClick={(e) => e.stopPropagation()}>
        <div className="tn-receipt__head">
          <div className="tn-modal__name">{item.name}</div>
          <div className="tn-receipt__sub">{item.rarity} · QUEDAN {left}</div>
        </div>
        <hr />
        <div className="tn-receipt__line"><span>Precio base</span><span>{fmt(item.base)}</span></div>
        <div className="tn-receipt__line"><span>Tu multiplicador</span><span>{formatMult(mult)}</span></div>
        <div className="tn-receipt__line tn-modal__total"><b>TOTAL</b><b>{fmt(price)} pts</b></div>
        <hr />
        <div className="tn-receipt__line tn-modal__meta"><span>Saldo después</span><span>{fmt(balance - price)} pts</span></div>
        <div className="tn-receipt__line tn-modal__meta"><span>Canjes esta semana</span><span>{claims + 1} / {weeklyLimit}</span></div>
        <div className="tn-receipt__line tn-modal__meta"><span>Tu próximo multiplicador</span><span>{formatMult(multiplier(ownedCount + 1, incrementPct))}</span></div>
        <div className="tn-modal__actions">
          <button className="tn-modal__cancel" onClick={onCancel}>Cancelar</button>
          <button className="tn-modal__ok" onClick={() => onConfirm(item)}>Canjear</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
