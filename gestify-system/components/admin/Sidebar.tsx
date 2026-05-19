"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MuiIcon from "@/components/ui/MuiIcon";
import { navItems } from "@/lib/navigation";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarProps = {
  mobileOpen?: boolean;
  onNavigate?: () => void;
};

export default function Sidebar({ mobileOpen = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`admin-sidebar bg-sidebar${mobileOpen ? " admin-sidebar--open" : ""}`}
      aria-label="Menu principal"
      aria-hidden={false}
    >
      <Link
        href="/"
        className="admin-sidebar__brand"
        title="Gestify"
        onClick={onNavigate}
      >
        <Image
          src="/logomini.png"
          alt="Gestify"
          width={40}
          height={40}
          className="admin-sidebar__logo admin-sidebar__logo--mini"
          priority
        />
        <Image
          src="/logo.png"
          alt="Gestify"
          width={200}
          height={48}
          className="admin-sidebar__logo admin-sidebar__logo--full"
          priority
        />
      </Link>

      <nav className="admin-sidebar__nav">
        <p className="admin-sidebar__nav-label">Navegação</p>
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar__link ${
                active ? "admin-sidebar__link--active" : ""
              }`}
              title={item.label}
              onClick={onNavigate}
            >
              <span className="admin-sidebar__icon">
                <MuiIcon icon={item.icon} size={22} />
              </span>
              <span className="admin-sidebar__label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <footer className="admin-sidebar__footer">
        <div className="admin-sidebar__status">
          <span className="admin-sidebar__status-dot" aria-hidden />
          <span className="text-sidebar-muted text-xs">Loja online · v0.1</span>
        </div>
      </footer>
    </aside>
  );
}
