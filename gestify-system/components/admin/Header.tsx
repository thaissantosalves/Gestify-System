"use client";

import { usePathname } from "next/navigation";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import NotificationsDropdown from "@/components/admin/NotificationsDropdown";
import UserMenuDropdown from "@/components/admin/UserMenuDropdown";
import MuiIcon from "@/components/ui/MuiIcon";
import { getNavItem } from "@/lib/navigation";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const section = getNavItem(pathname);

  return (
    <header className="admin-header">
      <button
        type="button"
        className="admin-header__menu-btn"
        aria-label="Abrir menu"
        onClick={onMenuClick}
      >
        <MuiIcon icon={MenuOutlinedIcon} size={24} />
      </button>

      <div className="admin-header__context">
        <p className="admin-header__eyebrow">Gestify</p>
        <h1 className="admin-header__title truncate">{section.label}</h1>
        <p className="admin-header__desc text-muted">{section.description}</p>
      </div>

      <div className="admin-header__actions">
        <div className="header-toolbar">
          <NotificationsDropdown />
          <span className="header-toolbar__divider" aria-hidden />
          <UserMenuDropdown />
        </div>
      </div>
    </header>
  );
}
