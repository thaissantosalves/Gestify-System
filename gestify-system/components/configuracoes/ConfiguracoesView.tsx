"use client";

import { useState } from "react";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import MiniStats from "@/components/admin/MiniStats";
import { useAppStore } from "@/components/providers/AppStoreProvider";

export default function ConfiguracoesView() {
  const { pushNotification } = useAppStore();
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await pushNotification({
      title: "Configurações salvas",
      message: "Os dados da loja foram atualizados com sucesso.",
      type: "sistema",
      href: "/configuracoes",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="page">
      {saved && (
        <p className="toast-success" role="status">
          Alterações salvas com sucesso!
        </p>
      )}

      <MiniStats
        items={[
          {
            label: "Loja",
            value: "Gestify Store",
            hint: "CNPJ 00.000.000/0001-00",
            icon: StoreOutlinedIcon,
          },
          {
            label: "Horário",
            value: "Seg–Sáb",
            hint: "09h às 21h",
            icon: ScheduleOutlinedIcon,
          },
          {
            label: "Pagamentos",
            value: "4 ativos",
            hint: "Pix, cartão, boleto, dinheiro",
            icon: PaymentOutlinedIcon,
          },
        ]}
      />

      <div className="page-grid-2">
        <article className="panel-card">
          <h2 className="panel-card__title">Dados da loja</h2>
          <form
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <label className="form-field form-field--full">
              <span className="form-field__label text-secondary">
                Nome fantasia
              </span>
              <input
                type="text"
                className="form-field__input bg-input text-primary"
                defaultValue="Gestify Store"
              />
            </label>
            <label className="form-field">
              <span className="form-field__label text-secondary">CNPJ</span>
              <input
                type="text"
                className="form-field__input bg-input text-primary"
                defaultValue="00.000.000/0001-00"
              />
            </label>
            <label className="form-field">
              <span className="form-field__label text-secondary">Telefone</span>
              <input
                type="tel"
                className="form-field__input bg-input text-primary"
                defaultValue="(11) 99999-0000"
              />
            </label>
            <label className="form-field form-field--full">
              <span className="form-field__label text-secondary">E-mail</span>
              <input
                type="email"
                className="form-field__input bg-input text-primary"
                defaultValue="contato@gestify.com.br"
              />
            </label>
            <button type="submit" className="btn-primary form-field--full">
              Salvar alterações
            </button>
          </form>
        </article>

        <article className="panel-card">
          <h2 className="panel-card__title">Horário de funcionamento</h2>
          <form className="form-grid">
            <label className="form-field">
              <span className="form-field__label text-secondary">Abertura</span>
              <input
                type="time"
                className="form-field__input bg-input text-primary"
                defaultValue="09:00"
              />
            </label>
            <label className="form-field">
              <span className="form-field__label text-secondary">Fechamento</span>
              <input
                type="time"
                className="form-field__input bg-input text-primary"
                defaultValue="21:00"
              />
            </label>
          </form>
        </article>
      </div>

      <article className="panel-card">
        <h2 className="panel-card__title">Formas de pagamento</h2>
        <div className="payment-grid">
          {[
            { name: "Pix", active: true, fee: "0%" },
            { name: "Cartão de crédito", active: true, fee: "2,99%" },
            { name: "Cartão de débito", active: true, fee: "1,49%" },
            { name: "Boleto", active: true, fee: "R$ 2,50" },
            { name: "Dinheiro", active: true, fee: "—" },
            { name: "Marketplace", active: false, fee: "—" },
          ].map((pay) => (
            <div
              key={pay.name}
              className={`payment-card bg-elevated ${pay.active ? "" : "payment-card--off"}`}
            >
              <span className="text-primary font-medium">{pay.name}</span>
              <span className="text-secondary text-sm">Taxa: {pay.fee}</span>
              <span
                className={`badge ${pay.active ? "badge--success" : "badge--danger"}`}
              >
                {pay.active ? "Ativo" : "Inativo"}
              </span>
            </div>
          ))}
        </div>
      </article>

      <article className="panel-card">
        <h2 className="panel-card__title">Integrações</h2>
        <ul className="info-list">
          <li className="info-list__item">
            <span className="text-primary font-medium">Mercado Livre</span>
            <span className="badge badge--success">Conectado</span>
          </li>
          <li className="info-list__item">
            <span className="text-primary font-medium">Shopify</span>
            <span className="badge badge--warning">Pendente</span>
          </li>
          <li className="info-list__item">
            <span className="text-primary font-medium">WhatsApp Business</span>
            <span className="badge badge--success">Conectado</span>
          </li>
        </ul>
      </article>
    </div>
  );
}
