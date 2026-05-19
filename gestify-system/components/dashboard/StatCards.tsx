"use client";

import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import MuiIcon from "@/components/ui/MuiIcon";
import type { DashboardStats } from "@/lib/dashboard/types";
import { formatCurrency } from "@/lib/mock-data";

type StatCardsProps = {
  stats: DashboardStats;
};

export default function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      variant: "stat-card--revenue" as const,
      label: "Faturamento total",
      value: formatCurrency(stats.totalSales),
      trend:
        stats.ordersCount > 0
          ? `${stats.ordersCount} pedido${stats.ordersCount !== 1 ? "s" : ""} no sistema`
          : "Nenhum pedido ainda",
      icon: AttachMoneyOutlinedIcon,
    },
    {
      variant: "stat-card--orders" as const,
      label: "Pedidos",
      value: String(stats.ordersCount),
      trend:
        stats.pendingOrders > 0
          ? `${stats.pendingOrders} pendente${stats.pendingOrders !== 1 ? "s" : ""}`
          : "Nenhum pendente",
      icon: ShoppingCartOutlinedIcon,
    },
    {
      variant: "stat-card--stock" as const,
      label: "Estoque",
      value: String(stats.activeProducts),
      trend:
        stats.lowStock + stats.outOfStock > 0
          ? `${stats.lowStock} baixo · ${stats.outOfStock} esgotado`
          : `${stats.activeProducts} produto${stats.activeProducts !== 1 ? "s" : ""} ativos`,
      icon: InventoryOutlinedIcon,
    },
  ];

  return (
    <section className="dashboard__stats" aria-label="Indicadores principais">
      {cards.map((stat) => (
        <article key={stat.label} className={`stat-card ${stat.variant}`}>
          <div className="stat-card__head">
            <p className="stat-card__label">{stat.label}</p>
            <div className="stat-card__icon-wrap">
              <MuiIcon icon={stat.icon} size={22} />
            </div>
          </div>
          <p className="stat-card__value">{stat.value}</p>
          <p className="stat-card__trend">{stat.trend}</p>
        </article>
      ))}
    </section>
  );
}
