"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { useAppStore } from "@/components/providers/AppStoreProvider";
import type { StockMovement } from "@/lib/mock-data";

type StockModalProps = {
  open: boolean;
  onClose: () => void;
};

const empty = {
  productName: "",
  type: "entrada" as StockMovement["type"],
  quantity: "",
  user: "Thais Admin",
};

export default function StockModal({ open, onClose }: StockModalProps) {
  const { products, addStockMovement } = useAppStore();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  function handleClose() {
    setForm(empty);
    setError("");
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.productName) {
      setError("Selecione um produto.");
      return;
    }
    const quantity = parseInt(form.quantity, 10);
    if (Number.isNaN(quantity) || quantity === 0) {
      setError("Informe uma quantidade válida.");
      return;
    }
    addStockMovement({
      productName: form.productName,
      type: form.type,
      quantity,
      user: form.user.trim() || "Thais Admin",
    });
    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Registrar movimentação"
      description="Entrada, saída ou ajuste de estoque."
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={handleClose}>
            Cancelar
          </button>
          <button type="submit" form="stock-form" className="btn-primary">
            Confirmar
          </button>
        </>
      }
    >
      <form id="stock-form" className="form-grid" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <label className="form-field form-field--full">
          <span className="form-field__label text-secondary">Produto</span>
          <select
            className="form-field__input bg-input text-primary"
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            required
          >
            <option value="">Selecione...</option>
            {products.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} ({p.stock} un.)
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">Tipo</span>
          <select
            className="form-field__input bg-input text-primary"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as StockMovement["type"],
              })
            }
          >
            <option value="entrada">Entrada</option>
            <option value="saída">Saída</option>
            <option value="ajuste">Ajuste (+/-)</option>
          </select>
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">Quantidade</span>
          <input
            type="number"
            className="form-field__input bg-input text-primary"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            placeholder={form.type === "ajuste" ? "-1 ou 10" : "10"}
            required
          />
        </label>
        <label className="form-field form-field--full">
          <span className="form-field__label text-secondary">Responsável</span>
          <input
            className="form-field__input bg-input text-primary"
            value={form.user}
            onChange={(e) => setForm({ ...form, user: e.target.value })}
          />
        </label>
      </form>
    </Modal>
  );
}
