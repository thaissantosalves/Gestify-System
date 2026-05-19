"use client";

import { useMemo, useState } from "react";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import PageToolbar from "@/components/admin/PageToolbar";
import MiniStats from "@/components/admin/MiniStats";
import ProductModal from "@/components/modals/ProductModal";
import { useAppStore } from "@/components/providers/AppStoreProvider";
import { categories, formatCurrency, productStatusBadge } from "@/lib/mock-data";

const statusLabels = {
  ativo: "Ativo",
  inativo: "Inativo",
  esgotado: "Esgotado",
} as const;

export default function ProdutosView() {
  const { products } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [products, search]);

  const activeCount = products.filter((p) => p.status === "ativo").length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  return (
    <div className="page">
      <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <MiniStats
        items={[
          {
            label: "Produtos ativos",
            value: String(activeCount),
            hint: `${products.length} cadastrados no total`,
            icon: InventoryOutlinedIcon,
          },
          {
            label: "Categorias",
            value: String(categories.length),
            hint: "Vestuário, calçados e mais",
            icon: CategoryOutlinedIcon,
          },
          {
            label: "Valor em estoque",
            value: formatCurrency(totalValue),
            hint: `${lowStock} com estoque baixo`,
            icon: AttachMoneyOutlinedIcon,
          },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Buscar por nome, SKU ou categoria..."
        searchValue={search}
        onSearchChange={setSearch}
        actionLabel="Novo produto"
        onAction={() => setModalOpen(true)}
      />

      <article className="panel-card">
        <h2 className="panel-card__title">Catálogo de produtos</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-muted text-center">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id}>
                    <td className="text-brand">{product.sku}</td>
                    <td>{product.name}</td>
                    <td className="text-secondary">{product.category}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>
                      <span
                        className={
                          product.stock <= 10 ? "text-accent font-medium" : ""
                        }
                      >
                        {product.stock} un.
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge--${productStatusBadge(product.status)}`}
                      >
                        {statusLabels[product.status]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
