import { fmt } from "../economy";

export function BalanceTicket({ balance, claims, weeklyLimit }) {
  return (
    <div className="tn-card tn-balance">
      <div className="tn-balance__main">
        <div className="tn-label">SALDO PARA CANJEAR</div>
        <div className="tn-balance__value">{fmt(balance)} <span>pts</span></div>
        <div className="tn-xs tn-dim">Canjear no baja tu puesto en el ranking</div>
      </div>
      <div className="tn-balance__stub">
        <span className="tn-label">CANJES</span>
        <span className="tn-balance__claims">{claims}/{weeklyLimit}</span>
        <span className="tn-mono tn-xs tn-dim">esta semana</span>
      </div>
    </div>
  );
}
