"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ThemeToggle from "@/components/admin/ThemeToggle";
import NotificationsDropdown from "@/components/admin/NotificationsDropdown";
import MuiIcon from "@/components/ui/MuiIcon";
import { getNavItem } from "@/lib/navigation";

export default function Header() {
  const pathname = usePathname();
  const section = getNavItem(pathname);

  return (
    <header className="admin-header">
      <div className="admin-header__context hidden min-w-0 flex-col justify-center lg:flex">
        <h1 className="text-primary truncate text-lg font-semibold leading-tight">
          {section.label}
        </h1>
        <p className="text-secondary truncate text-sm">{section.description}</p>
      </div>

      <label className="admin-header__search">
        <MuiIcon icon={SearchOutlinedIcon} size={20} className="opacity-60" />
        <input type="search" placeholder="Buscar produtos, vendas..." />
      </label>

      <div className="admin-header__actions">
        <NotificationsDropdown />
        <Link
          href="/configuracoes"
          className="admin-header__icon-btn"
          aria-label="Configurações"
          title="Configurações"
        >
          <MuiIcon icon={SettingsOutlinedIcon} />
        </Link>
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
