"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { useAppStore } from "@/components/providers/AppStoreProvider";
import type { Order } from "@/lib/mock-data";

const CHANNELS: Order["channel"][] = [
  "Loja física",
  "E-commerce",
  "WhatsApp",
  "Marketplace",
];

type OrderModalProps = {
  open: boolean;
  onClose: () => void;
};

const empty = {
  customer: "",
  items: "1",
  total: "",
  channel: "E-commerce" as Order["channel"],
  status: "pendente" as Order["status"],
};

export default function OrderModal({ open, onClose }: OrderModalProps) {
  const { addOrder } = useAppStore();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  function handleClose() {
    setForm(empty);
    setError("");
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.customer.trim()) {
      setError("Nome do cliente é obrigatório.");
      return;
    }
    const items = parseInt(form.items, 10);
    const total = parseFloat(form.total.replace(",", "."));
    if (Number.isNaN(items) || items < 1) {
      setError("Informe a quantidade de itens.");
      return;
    }
    if (Number.isNaN(total) || total <= 0) {
      setError("Informe o valor total do pedido.");
      return;
    }
    try {
      await addOrder({
        customer: form.customer.trim(),
        items,
        total,
        channel: form.channel,
        status: form.status,
      });
      handleClose();
    } catch {
      setError("Não foi possível criar o pedido.");
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Novo pedido"
      description="Registre uma venda manualmente no sistema."
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={handleClose}>
            Cancelar
          </button>
          <button type="submit" form="order-form" className="btn-primary">
            Criar pedido
          </button>
        </>
      }
    >
      <form id="order-form" className="form-grid" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <label className="form-field form-field--full">
          <span className="form-field__label text-secondary">Cliente</span>
          <input
            className="form-field__input bg-input text-primary"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
            placeholder="Nome do cliente"
            required
          />
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">Qtd. itens</span>
          <input
            type="number"
            min="1"
            className="form-field__input bg-input text-primary"
            value={form.items}
            onChange={(e) => setForm({ ...form, items: e.target.value })}
            required
          />
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">Total (R$)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-field__input bg-input text-primary"
            value={form.total}
            onChange={(e) => setForm({ ...form, total: e.target.value })}
            placeholder="199.90"
            required
          />
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">Canal</span>
          <select
            className="form-field__input bg-input text-primary"
            value={form.channel}
            onChange={(e) =>
              setForm({ ...form, channel: e.target.value as Order["channel"] })
            }
          >
            {CHANNELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">Status</span>
          <select
            className="form-field__input bg-input text-primary"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as Order["status"] })
            }
          >
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="enviado">Enviado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </label>
      </form>
    </Modal>
  );
}
