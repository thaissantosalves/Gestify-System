"use client";

import { useAppStore } from "@/components/providers/AppStoreProvider";
import { formatCurrency, orderStatusBadge } from "@/lib/mock-data";

const statusLabels = {
  pendente: "Pendente",
  pago: "Pago",
  enviado: "Enviado",
  cancelado: "Cancelado",
} as const;

export default function RecentOrders() {
  const { orders } = useAppStore();

  return (
    <article className="panel-card">
      <h2 className="panel-card__title">Pedidos recentes</h2>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Canal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-secondary text-center">
                  Nenhum pedido cadastrado.
                </td>
              </tr>
            )}
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id}>
                <td className="text-brand">{order.id}</td>
                <td>{order.customer}</td>
                <td>{formatCurrency(order.total)}</td>
                <td className="text-secondary">{order.channel}</td>
                <td>
                  <span
                    className={`badge badge--${orderStatusBadge(order.status)}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
