import { ItemArt } from "../ItemArt";
import { fmt } from "../economy";

export function RaffleCard({ count, joined, cost, endsIn = "2d 14h", canAfford = true, onJoin }) {
  return (
    <div className="tn-raffle">
      <div className="tn-raffle__art"><ItemArt itemId="dorado" /></div>
      <div className="tn-raffle__body">
        <div className="tn-row-start">
          <span className="tn-chip" style={{ background: "#f5c04a", color: "#1c1408" }}>LEGENDARIO</span>
          <span className="tn-mono tn-xs" style={{ color: "#a8925a" }}>1 ganador por semana</span>
        </div>
        <h3 className="tn-raffle__title">Boleto Dorado</h3>
        <p className="tn-raffle__text">Lo legendario no se compra: se sortea. Un boleto por persona, mismo precio para todos, misma probabilidad.</p>
        <div className="tn-raffle__foot">
          <button className={"tn-raffle__btn" + (joined ? " is-joined" : "")} disabled={joined || !canAfford} onClick={onJoin}>
            {joined ? "Ya participas ✓" : `Participar · ${fmt(cost)} pts`}
          </button>
          <div className="tn-xs tn-muted">
            <b className="tn-white">{count}</b> participantes<br />Sorteo en <span className="tn-mono tn-white">{endsIn}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
