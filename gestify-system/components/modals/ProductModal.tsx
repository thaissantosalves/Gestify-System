"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { useAppStore } from "@/components/providers/AppStoreProvider";
import type { Product } from "@/lib/mock-data";

const CATEGORIES = ["Vestuário", "Calçados", "Acessórios", "Eletrônicos"];

type ProductModalProps = {
  open: boolean;
  onClose: () => void;
};

const empty = {
  name: "",
  sku: "",
  category: CATEGORIES[0],
  price: "",
  stock: "",
  status: "ativo" as Product["status"],
};

export default function ProductModal({ open, onClose }: ProductModalProps) {
  const { addProduct } = useAppStore();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  function handleClose() {
    setForm(empty);
    setError("");
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.sku.trim()) {
      setError("Nome e SKU são obrigatórios.");
      return;
    }
    const price = parseFloat(form.price.replace(",", "."));
    const stock = parseInt(form.stock, 10);
    if (Number.isNaN(price) || price < 0) {
      setError("Informe um preço válido.");
      return;
    }
    if (Number.isNaN(stock) || stock < 0) {
      setError("Informe um estoque válido.");
      return;
    }
    let status = form.status;
    if (stock === 0) status = "esgotado";
    try {
      await addProduct({
        name: form.name.trim(),
        sku: form.sku.trim().toUpperCase(),
        category: form.category,
        price,
        stock,
        status,
      });
      handleClose();
    } catch {
      setError("Não foi possível salvar o produto.");
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Novo produto"
      description="Cadastre um item no catálogo da loja."
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={handleClose}>
            Cancelar
          </button>
          <button type="submit" form="product-form" className="btn-primary">
            Salvar produto
          </button>
        </>
      }
    >
      <form id="product-form" className="form-grid" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <label className="form-field form-field--full">
          <span className="form-field__label text-secondary">Nome do produto</span>
          <input
            className="form-field__input bg-input text-primary"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Camiseta Premium"
            required
          />
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">SKU</span>
          <input
            className="form-field__input bg-input text-primary"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            placeholder="CAM-PRE-M"
            required
          />
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">Categoria</span>
          <select
            className="form-field__input bg-input text-primary"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">Preço (R$)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-field__input bg-input text-primary"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="59.90"
            required
          />
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">Estoque inicial</span>
          <input
            type="number"
            min="0"
            className="form-field__input bg-input text-primary"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="0"
            required
          />
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">Status</span>
          <select
            className="form-field__input bg-input text-primary"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as Product["status"] })
            }
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="esgotado">Esgotado</option>
          </select>
        </label>
      </form>
    </Modal>
  );
}
