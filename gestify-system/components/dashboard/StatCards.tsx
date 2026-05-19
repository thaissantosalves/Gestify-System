import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MuiIcon from "@/components/ui/MuiIcon";

const stats = [
  {
    variant: "stat-card--1" as const,
    label: "Vendas da semana",
    value: "R$ 12.450",
    trend: "+18% em relação à semana anterior",
    icon: TrendingUpOutlinedIcon,
  },
  {
    variant: "stat-card--2" as const,
    label: "Pedidos da semana",
    value: "328",
    trend: "+6% novos pedidos",
    icon: ShoppingCartOutlinedIcon,
  },
  {
    variant: "stat-card--3" as const,
    label: "Clientes ativos",
    value: "1.204",
    trend: "+12% visitantes online",
    icon: PeopleOutlinedIcon,
  },
];

export default function StatCards() {
  return (
    <section className="dashboard__stats" aria-label="Indicadores principais">
      {stats.map((stat) => (
        <article key={stat.label} className={`stat-card ${stat.variant}`}>
          <div className="stat-card__icon-wrap">
            <MuiIcon icon={stat.icon} size={28} />
          </div>
          <p className="stat-card__label">{stat.label}</p>
          <p className="stat-card__value">{stat.value}</p>
          <p className="stat-card__trend">{stat.trend}</p>
        </article>
      ))}
    </section>
  );
}
