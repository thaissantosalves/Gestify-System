"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { useAppStore } from "@/components/providers/AppStoreProvider";
import type { StockMovementType } from "@/lib/server/types";

type StockModalProps = {
  open: boolean;
  onClose: () => void;
};

const empty = {
  productId: "",
  type: "entrada" as StockMovementType,
  quantity: "",
  user: "Thais Admin",
};

export default function StockModal({ open, onClose }: StockModalProps) {
  const { products, addStockMovement } = useAppStore();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setForm(empty);
    setError("");
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.productId) {
      setError("Selecione um produto.");
      return;
    }
    const quantity = parseInt(form.quantity, 10);
    if (Number.isNaN(quantity) || quantity === 0) {
      setError("Informe uma quantidade válida.");
      return;
    }
    setSubmitting(true);
    try {
      await addStockMovement({
        productId: form.productId,
        type: form.type,
        quantity,
        user: form.user.trim() || "Thais Admin",
      });
      handleClose();
    } catch {
      setError("Não foi possível registrar a movimentação.");
    } finally {
      setSubmitting(false);
    }
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
          <button
            type="submit"
            form="stock-form"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? "Salvando..." : "Confirmar"}
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
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            required
          >
            <option value="">Selecione...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
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
                type: e.target.value as StockMovementType,
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
