"use client";

import { useEffect, useState } from "react";
import StatCards from "@/components/dashboard/StatCards";
import ChartsSection from "@/components/dashboard/ChartsSection";
import RecentTickets from "@/components/dashboard/RecentTickets";
import type { DashboardOverview } from "@/lib/dashboard/types";

export default function DashboardView() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dashboard/overview");
        const body = (await res.json()) as DashboardOverview & { error?: string };
        if (!res.ok) throw new Error(body.error ?? "Falha ao carregar dashboard");
        if (!cancelled) setOverview(body);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erro ao carregar dashboard");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="dashboard">
        <p className="form-error">{error}</p>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="dashboard">
        <p className="text-secondary">Carregando indicadores...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <StatCards stats={overview.stats} />
      <ChartsSection overview={overview} />
      <RecentTickets />
    </div>
  );
}
