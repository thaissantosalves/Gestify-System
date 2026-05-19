"use client";

import { useMemo, useState } from "react";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import PageToolbar from "@/components/admin/PageToolbar";
import MiniStats from "@/components/admin/MiniStats";
import UserModal from "@/components/modals/UserModal";
import { useAppStore } from "@/components/providers/AppStoreProvider";

const roleBadge: Record<string, "success" | "warning" | "danger"> = {
  Administrador: "success",
  Gerente: "warning",
  Vendedor: "warning",
  Estoquista: "warning",
};

export default function UsuariosView() {
  const { teamMembers } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teamMembers;
    return teamMembers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [teamMembers, search]);

  const active = teamMembers.filter((u) => u.status === "ativo").length;
  const inactive = teamMembers.filter((u) => u.status === "inativo").length;
  const admins = teamMembers.filter((u) => u.role === "Administrador").length;

  return (
    <div className="page">
      <UserModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <MiniStats
        items={[
          {
            label: "Usuários ativos",
            value: String(active),
            hint: `${teamMembers.length} no total`,
            icon: PeopleOutlinedIcon,
          },
          {
            label: "Administradores",
            value: String(admins),
            icon: AdminPanelSettingsOutlinedIcon,
          },
          {
            label: "Inativos",
            value: String(inactive),
            icon: PersonOffOutlinedIcon,
          },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Buscar por nome ou e-mail..."
        searchValue={search}
        onSearchChange={setSearch}
        actionLabel="Convidar usuário"
        onAction={() => setModalOpen(true)}
      />

      <article className="panel-card">
        <h2 className="panel-card__title">Equipe da loja</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Último acesso</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td>
                    <span className="user-cell">
                      <span className="user-cell__avatar">{user.name[0]}</span>
                      {user.name}
                    </span>
                  </td>
                  <td className="text-secondary">{user.email}</td>
                  <td>
                    <span className={`badge badge--${roleBadge[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge badge--${user.status === "ativo" ? "success" : "danger"}`}
                    >
                      {user.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="text-secondary">{user.lastAccess}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
