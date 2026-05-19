"use client";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ThemeToggle from "@/components/admin/ThemeToggle";
import MuiIcon from "@/components/ui/MuiIcon";

export default function Header() {
  return (
    <header className="admin-header">
      <label className="admin-header__search">
        <MuiIcon icon={SearchOutlinedIcon} size={20} className="opacity-60" />
        <input type="search" placeholder="Buscar produtos, vendas..." />
      </label>

      <div className="admin-header__actions">
        <button type="button" className="admin-header__icon-btn" aria-label="Notificações">
          <MuiIcon icon={NotificationsOutlinedIcon} />
        </button>
        <button type="button" className="admin-header__icon-btn" aria-label="Configurações">
          <MuiIcon icon={SettingsOutlinedIcon} />
        </button>
        <ThemeToggle />
        <div className="admin-header__user">
          <span className="admin-header__avatar">TA</span>
          <span className="text-primary hidden text-sm font-medium sm:inline">
            Thais Admin
          </span>
        </div>
      </div>
    </header>
  );
}
