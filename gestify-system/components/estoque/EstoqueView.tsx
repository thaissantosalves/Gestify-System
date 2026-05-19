"use client";

import { useMemo, useState } from "react";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import PageToolbar from "@/components/admin/PageToolbar";
import MiniStats from "@/components/admin/MiniStats";
import StockModal from "@/components/modals/StockModal";
import { useAppStore } from "@/components/providers/AppStoreProvider";
import { formatCurrency, movementTypeLabel } from "@/lib/mock-data";

export default function EstoqueView() {
  const { products, stockMovements } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredMovements = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stockMovements;
    return stockMovements.filter(
      (m) =>
        m.product.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.user.toLowerCase().includes(q),
    );
  }, [stockMovements, search]);

  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;

  return (
    <div className="page">
      <StockModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <MiniStats
        items={[
          {
            label: "Unidades em estoque",
            value: `${totalUnits} un.`,
            hint: "Soma de todos os produtos",
            icon: InventoryOutlinedIcon,
          },
          {
            label: "Estoque baixo",
            value: String(lowStock),
            hint: `${outOfStock} esgotado(s)`,
            icon: WarningAmberOutlinedIcon,
          },
          {
            label: "Movimentações",
            value: String(stockMovements.length),
            hint: "Registros no histórico",
            icon: SwapHorizOutlinedIcon,
          },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Buscar produto ou movimentação..."
        searchValue={search}
        onSearchChange={setSearch}
        actionLabel="Registrar entrada"
        onAction={() => setModalOpen(true)}
      />

      <div className="page-grid-2">
        <article className="panel-card">
          <h2 className="panel-card__title">Saldo por produto</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>SKU</th>
                  <th>Qtd</th>
                  <th>Valor</th>
                  <th>Alerta</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="text-brand">{p.sku}</td>
                    <td>{p.stock} un.</td>
                    <td>{formatCurrency(p.price * p.stock)}</td>
                    <td>
                      {p.stock === 0 ? (
                        <span className="badge badge--danger">Esgotado</span>
                      ) : p.stock <= 10 ? (
                        <span className="badge badge--warning">Baixo</span>
                      ) : (
                        <span className="badge badge--success">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel-card">
          <h2 className="panel-card__title">Alertas</h2>
          <ul className="info-list">
            {outOfStock > 0 && (
              <li className="info-list__item info-list__item--danger">
                <span className="font-medium">
                  {outOfStock} produto(s) esgotado(s)
                </span>
              </li>
            )}
            {products
              .filter((p) => p.stock > 0 && p.stock <= 10)
              .map((p) => (
                <li key={p.id} className="info-list__item">
                  <span className="text-primary font-medium">{p.name}</span>
                  <span className="text-secondary text-sm">
                    {p.stock} un. restantes
                  </span>
                </li>
              ))}
          </ul>
        </article>
      </div>

      <article className="panel-card">
        <h2 className="panel-card__title">Histórico de movimentações</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Qtd</th>
                <th>Data</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.map((mov) => (
                <tr key={mov.id}>
                  <td className="text-brand">{mov.id}</td>
                  <td>{mov.product}</td>
                  <td>
                    <span
                      className={`badge badge--${
                        mov.type === "entrada"
                          ? "success"
                          : mov.type === "saída"
                            ? "warning"
                            : "danger"
                      }`}
                    >
                      {movementTypeLabel(mov.type)}
                    </span>
                  </td>
                  <td>
                    {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                  </td>
                  <td className="text-secondary">{mov.date}</td>
                  <td>{mov.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
