"use client";

import { Doughnut } from "react-chartjs-2";
import type { ChannelSlice } from "@/lib/dashboard/types";
import { CHART_COLORS, baseChartOptions, readChartTheme } from "./chart-config";
import "./chart-config";

type ChannelDoughnutChartProps = {
  data: ChannelSlice[];
};

export default function ChannelDoughnutChart({ data }: ChannelDoughnutChartProps) {
  const theme = readChartTheme();

  if (data.length === 0) {
    return (
      <p className="chart-empty text-secondary">
        Nenhum pedido cadastrado ainda.
      </p>
    );
  }

  const chartData = {
    labels: data.map((d) => d.channel),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: data.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
        borderColor: theme.border,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    ...baseChartOptions(),
    cutout: "68%",
    plugins: {
      ...baseChartOptions().plugins,
      legend: {
        ...baseChartOptions().plugins?.legend,
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="chart-canvas-wrap chart-canvas-wrap--compact">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
