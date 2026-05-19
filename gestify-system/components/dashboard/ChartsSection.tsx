const barData = [
  { label: "Jan", values: [40, 55, 35, 48] },
  { label: "Fev", values: [52, 42, 60, 38] },
  { label: "Mar", values: [48, 65, 45, 55] },
  { label: "Abr", values: [70, 50, 58, 62] },
  { label: "Mai", values: [55, 72, 50, 68] },
  { label: "Jun", values: [65, 58, 72, 60] },
];

const donutLegend = [
  { label: "Loja física", color: "var(--chart-donut-1)" },
  { label: "E-commerce", color: "var(--chart-donut-2)" },
  { label: "Marketplace", color: "var(--chart-donut-3)" },
  { label: "WhatsApp", color: "var(--chart-donut-4)" },
];

export default function ChartsSection() {
  return (
    <section className="dashboard__charts">
      <article className="panel-card">
        <h2 className="panel-card__title">Visitas e estatísticas de vendas</h2>
        <div className="bar-chart" role="img" aria-label="Gráfico de barras mensal">
          {barData.map((month) => (
            <div key={month.label} className="bar-chart__group">
              <div className="bar-chart__bars">
                {month.values.map((height, i) => (
                  <span
                    key={i}
                    className={`bar-chart__bar bar-chart__bar--${i + 1}`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <span className="bar-chart__label">{month.label}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="panel-card">
        <h2 className="panel-card__title">Fontes de tráfego</h2>
        <div className="donut-wrap">
          <div className="donut-chart">
            <span className="donut-chart__hole bg-card" />
          </div>
          <ul className="donut-legend">
            {donutLegend.map((item) => (
              <li key={item.label} className="donut-legend__item">
                <span
                  className="donut-legend__dot"
                  style={{ background: item.color }}
                />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  );
}
