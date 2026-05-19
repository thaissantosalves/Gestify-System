"use client";

import { Line } from "react-chartjs-2";
import type { SalesDayPoint } from "@/lib/dashboard/types";
import { CHART_COLORS, baseChartOptions, readChartTheme } from "./chart-config";
import "./chart-config";

type SalesLineChartProps = {
  data: SalesDayPoint[];
};

export default function SalesLineChart({ data }: SalesLineChartProps) {
  const theme = readChartTheme();
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.total);
  const primary = CHART_COLORS[0];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Faturamento (R$)",
        data: values,
        borderColor: primary,
        backgroundColor: (context: {
          chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } };
        }) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "rgba(124, 58, 237, 0.2)";
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, "rgba(124, 58, 237, 0.35)");
          gradient.addColorStop(1, "rgba(124, 58, 237, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: primary,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    ...baseChartOptions(),
    plugins: {
      ...baseChartOptions().plugins,
      legend: { display: false },
      tooltip: {
        ...baseChartOptions().plugins?.tooltip,
        callbacks: {
          label: (ctx: { parsed: { y: number | null } }) =>
            `R$ ${(ctx.parsed.y ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: theme.text, font: { size: 11 } },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: theme.grid },
        ticks: {
          color: theme.text,
          font: { size: 11 },
          callback: (v: number | string) =>
            typeof v === "number"
              ? `R$ ${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
              : v,
        },
        border: { display: false },
      },
    },
  };

  if (values.every((v) => v === 0)) {
    return (
      <p className="chart-empty text-secondary">
        Sem vendas nos últimos 7 dias. Os pedidos pagos aparecerão aqui.
      </p>
    );
  }

  return (
    <div className="chart-canvas-wrap">
      <Line data={chartData} options={options} />
    </div>
  );
}
