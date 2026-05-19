"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import MuiIcon from "@/components/ui/MuiIcon";
import { useAppStore } from "@/components/providers/AppStoreProvider";
import { applyTheme, getStoredTheme, type ThemeMode } from "@/lib/theme";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function UserMenuDropdown() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const ref = useRef<HTMLDivElement>(null);
  const { teamMembers } = useAppStore();

  const user =
    teamMembers.find(
      (m) =>
        m.status === "ativo" &&
        (m.role === "Administrador" || m.email.includes("thais")),
    ) ??
    teamMembers.find((m) => m.role === "Administrador" && m.status === "ativo") ??
    teamMembers[0];

  const displayName = user?.name ?? "Usuário";
  const firstName = displayName.split(" ")[0] ?? displayName;
  const avatarLetters = initials(displayName);

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function toggleTheme() {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  return (
    <div className="user-menu-wrap" ref={ref}>
      <button
        type="button"
        className="user-menu-trigger"
        aria-label="Menu da conta"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="header-avatar">{avatarLetters}</span>
        <span className="user-menu-trigger__text">
          <span className="user-menu-trigger__line text-primary">
            Olá, <strong>{firstName}</strong>
          </span>
        </span>
        <MuiIcon
          icon={ExpandMoreOutlinedIcon}
          size={18}
          className={`user-menu-trigger__chevron${open ? " user-menu-trigger__chevron--open" : ""}`}
        />
      </button>

      {open && (
        <div className="user-menu-panel bg-card" role="menu">
          <div className="user-menu-panel__head">
            <span className="header-avatar header-avatar--lg">{avatarLetters}</span>
            <div>
              <p className="user-menu-panel__name text-primary">{displayName}</p>
              <p className="user-menu-panel__meta text-secondary">
                {user?.email ?? "contato@gestify.com.br"}
              </p>
              {user?.role && (
                <span className="user-menu-panel__role">{user.role}</span>
              )}
            </div>
          </div>

          <ul className="user-menu-list">
            <li>
              <Link
                href="/usuarios"
                className="user-menu-item"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <MuiIcon icon={PeopleOutlinedIcon} size={20} />
                Minha conta
              </Link>
            </li>
            <li>
              <Link
                href="/configuracoes"
                className="user-menu-item"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <MuiIcon icon={SettingsOutlinedIcon} size={20} />
                Configurações
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="user-menu-item"
                role="menuitem"
                onClick={toggleTheme}
              >
                <MuiIcon
                  icon={
                    theme === "dark" ? LightModeOutlinedIcon : DarkModeOutlinedIcon
                  }
                  size={20}
                />
                {theme === "dark" ? "Modo claro" : "Modo escuro"}
              </button>
            </li>
            <li className="user-menu-list__divider" />
            <li>
              <button
                type="button"
                className="user-menu-item user-menu-item--danger"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <MuiIcon icon={LogoutOutlinedIcon} size={20} />
                Sair
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
