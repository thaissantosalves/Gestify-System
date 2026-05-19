"use client";

import { Bar } from "react-chartjs-2";
import type { CategoryStock } from "@/lib/dashboard/types";
import { CHART_COLORS, baseChartOptions, readChartTheme } from "./chart-config";
import "./chart-config";

type StockBarChartProps = {
  data: CategoryStock[];
};

export default function StockBarChart({ data }: StockBarChartProps) {
  const theme = readChartTheme();

  if (data.length === 0) {
    return (
      <p className="chart-empty text-secondary">
        Cadastre produtos para ver o estoque por categoria.
      </p>
    );
  }

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        label: "Unidades em estoque",
        data: data.map((d) => d.units),
        backgroundColor: data.map(
          (_, i) => `${CHART_COLORS[i % CHART_COLORS.length]}cc`,
        ),
        borderColor: data.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    ...baseChartOptions(),
    indexAxis: "y" as const,
    plugins: {
      ...baseChartOptions().plugins,
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: theme.grid },
        ticks: { color: theme.text, font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { color: theme.text, font: { size: 11 } },
        border: { display: false },
      },
    },
  };

  return (
    <div className="chart-canvas-wrap">
      <Bar data={chartData} options={options} />
    </div>
  );
}
