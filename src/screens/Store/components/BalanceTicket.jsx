import { fmt } from "../economy";

export function BalanceTicket({ balance, pieces }) {
  return (
    <div className="tn-card tn-balance">
      <div className="tn-balance__main">
        <div className="tn-label">SALDO PARA CANJEAR</div>
        <div className="tn-balance__value">{fmt(balance)} <span>pts</span></div>
        <div className="tn-xs tn-dim">Canjear no baja tu puesto en el ranking</div>
      </div>
      <div className="tn-balance__stub">
        <span className="tn-label">PIEZAS</span>
        <span className="tn-balance__claims">{pieces}</span>
        <span className="tn-mono tn-xs tn-dim">esta temporada</span>
      </div>
    </div>
  );
}
