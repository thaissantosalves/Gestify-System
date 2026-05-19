"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { useAppStore } from "@/components/providers/AppStoreProvider";
import type { TeamMember } from "@/lib/mock-data";

type UserModalProps = {
  open: boolean;
  onClose: () => void;
};

const empty = {
  name: "",
  email: "",
  role: "Vendedor" as TeamMember["role"],
  status: "ativo" as TeamMember["status"],
};

export default function UserModal({ open, onClose }: UserModalProps) {
  const { addTeamMember } = useAppStore();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  function handleClose() {
    setForm(empty);
    setError("");
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Nome e e-mail são obrigatórios.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("E-mail inválido.");
      return;
    }
    addTeamMember({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      status: form.status,
    });
    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Convidar usuário"
      description="Adicione um membro à equipe com perfil de acesso."
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={handleClose}>
            Cancelar
          </button>
          <button type="submit" form="user-form" className="btn-primary">
            Enviar convite
          </button>
        </>
      }
    >
      <form id="user-form" className="form-grid" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <label className="form-field form-field--full">
          <span className="form-field__label text-secondary">Nome completo</span>
          <input
            className="form-field__input bg-input text-primary"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Maria Silva"
            required
          />
        </label>
        <label className="form-field form-field--full">
          <span className="form-field__label text-secondary">E-mail</span>
          <input
            type="email"
            className="form-field__input bg-input text-primary"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="maria@gestify.com.br"
            required
          />
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">Perfil</span>
          <select
            className="form-field__input bg-input text-primary"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as TeamMember["role"] })
            }
          >
            <option value="Administrador">Administrador</option>
            <option value="Gerente">Gerente</option>
            <option value="Vendedor">Vendedor</option>
            <option value="Estoquista">Estoquista</option>
          </select>
        </label>
        <label className="form-field">
          <span className="form-field__label text-secondary">Status</span>
          <select
            className="form-field__input bg-input text-primary"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as TeamMember["status"],
              })
            }
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </label>
      </form>
    </Modal>
  );
}
