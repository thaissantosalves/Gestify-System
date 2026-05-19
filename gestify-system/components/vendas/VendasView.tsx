"use client";

import { useMemo, useState } from "react";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import PageToolbar from "@/components/admin/PageToolbar";
import MiniStats from "@/components/admin/MiniStats";
import OrderModal from "@/components/modals/OrderModal";
import { useAppStore } from "@/components/providers/AppStoreProvider";
import { formatCurrency, orderStatusBadge } from "@/lib/mock-data";

const statusLabels = {
  pendente: "Pendente",
  pago: "Pago",
  enviado: "Enviado",
  cancelado: "Cancelado",
} as const;

export default function VendasView() {
  const { orders } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.customer.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.channel.toLowerCase().includes(q),
    );
  }, [orders, search]);

  const totalSales = orders
    .filter((o) => o.status !== "cancelado")
    .reduce((acc, o) => acc + o.total, 0);
  const pending = orders.filter((o) => o.status === "pendente").length;
  const completed = orders.filter(
    (o) => o.status === "pago" || o.status === "enviado",
  ).length;

  const byChannel = orders.reduce(
    (acc, o) => {
      if (o.status === "cancelado") return acc;
      acc[o.channel] = (acc[o.channel] || 0) + o.total;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="page">
      <OrderModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <MiniStats
        items={[
          {
            label: "Faturamento",
            value: formatCurrency(totalSales),
            hint: `${orders.length} pedidos`,
            icon: PaidOutlinedIcon,
          },
          {
            label: "Concluídos",
            value: String(completed),
            icon: PointOfSaleOutlinedIcon,
          },
          {
            label: "Pendentes",
            value: String(pending),
            icon: PendingActionsOutlinedIcon,
          },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Buscar pedido ou cliente..."
        searchValue={search}
        onSearchChange={setSearch}
        actionLabel="Novo pedido"
        onAction={() => setModalOpen(true)}
      />

      <article className="panel-card">
        <h2 className="panel-card__title">Pedidos</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Canal</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td className="text-brand">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.items}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td className="text-secondary">{order.channel}</td>
                  <td>
                    <span
                      className={`badge badge--${orderStatusBadge(order.status)}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="text-secondary">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <div className="page-grid-2">
        <article className="panel-card">
          <h2 className="panel-card__title">Faturamento por canal</h2>
          <ul className="info-list">
            {Object.entries(byChannel).map(([channel, total]) => (
              <li key={channel} className="info-list__item">
                <span className="text-primary font-medium">{channel}</span>
                <span className="text-secondary text-sm">
                  {formatCurrency(total)}
                </span>
              </li>
            ))}
          </ul>
        </article>
        <article className="panel-card">
          <h2 className="panel-card__title">Resumo</h2>
          <dl className="summary-dl">
            <div className="summary-dl__row">
              <dt className="text-secondary">Ticket médio</dt>
              <dd className="text-primary font-semibold">
                {formatCurrency(totalSales / Math.max(orders.length, 1))}
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </div>
  );
}
