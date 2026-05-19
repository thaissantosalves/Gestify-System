"use client";

import type { DashboardOverview } from "@/lib/dashboard/types";
import SalesLineChart from "@/components/dashboard/charts/SalesLineChart";
import ChannelDoughnutChart from "@/components/dashboard/charts/ChannelDoughnutChart";
import StockBarChart from "@/components/dashboard/charts/StockBarChart";

type ChartsSectionProps = {
  overview: Pick<
    DashboardOverview,
    "salesLast7Days" | "ordersByChannel" | "stockByCategory"
  >;
};

export default function ChartsSection({ overview }: ChartsSectionProps) {
  return (
    <section className="dashboard__charts">
      <article className="panel-card">
        <h2 className="panel-card__title">Faturamento — últimos 7 dias</h2>
        <SalesLineChart data={overview.salesLast7Days} />
      </article>

      <article className="panel-card">
        <h2 className="panel-card__title">Pedidos por canal</h2>
        <ChannelDoughnutChart data={overview.ordersByChannel} />
      </article>

      <article className="panel-card panel-card--full">
        <h2 className="panel-card__title">Estoque por categoria</h2>
        <StockBarChart data={overview.stockByCategory} />
      </article>
    </section>
  );
}
