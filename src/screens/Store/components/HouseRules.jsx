export function HouseRules({ weeklyLimit, incrementPct, weekMedian = "1.400" }) {
  const rules = [
    "Stock limitado. Cuando se acaba, no vuelve.",
    "Uno por persona por artículo.",
    `Máximo ${weeklyLimit} canjes por semana.`,
    `Tu precio sube +${incrementPct}% por cada pieza que ya tengas.`,
    "Lo legendario se sortea: mismo boleto, misma probabilidad.",
    "Canjear gasta saldo, pero tu puesto en el ranking no baja.",
  ];
  return (
    <aside className="tn-receipt">
      <div className="tn-receipt__head">
        <div className="tn-receipt__title">REGLAS DE LA CASA</div>
        <div className="tn-receipt__sub">CÓMO SE MANTIENE JUSTA</div>
      </div>
      <hr />
      {rules.map((r, i) => (
        <div key={i} className="tn-receipt__rule"><b>{String(i + 1).padStart(2, "0")}</b><span>{r}</span></div>
      ))}
      <hr />
      <div className="tn-receipt__line"><span>1 SEMANA (MEDIANA)</span><b>≈ {weekMedian} PTS</b></div>
      <p className="tn-receipt__note">PRECIOS RECALCULADOS CADA MES SEGÚN LO QUE GANA EL USUARIO MEDIO, NO EL QUE MÁS TIENE.</p>
    </aside>
  );
}
