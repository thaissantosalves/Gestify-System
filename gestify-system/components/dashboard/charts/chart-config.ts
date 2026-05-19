"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

export const CHART_COLORS = [
  "#8b7cf8",
  "#5eead4",
  "#e8a87c",
  "#f472b6",
  "#a599ff",
  "#2dd4bf",
  "#fb923c",
  "#c4b8ff",
];

export function readChartTheme() {
  if (typeof document === "undefined") {
    return {
      text: "#94a3b8",
      grid: "rgba(148, 163, 184, 0.12)",
      border: "#262626",
    };
  }
  const root = document.documentElement;
  const style = getComputedStyle(root);
  return {
    text: style.getPropertyValue("--color-text-secondary").trim() || "#94a3b8",
    grid: "rgba(148, 163, 184, 0.15)",
    border: style.getPropertyValue("--color-border").trim() || "#262626",
  };
}

export function baseChartOptions() {
  const theme = readChartTheme();
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme.text,
          usePointStyle: true,
          padding: 16,
          font: { family: "var(--font-body), system-ui, sans-serif", size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(20, 20, 20, 0.95)",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        borderColor: theme.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
  };
}
