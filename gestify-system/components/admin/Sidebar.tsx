"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MuiIcon from "@/components/ui/MuiIcon";
import { navItems } from "@/lib/navigation";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar bg-sidebar" aria-label="Menu principal">
      <div className="admin-sidebar__brand">
        <span className="admin-sidebar__logo text-inverse">G</span>
        <span className="admin-sidebar__title">
          <span className="text-brand block text-base font-bold leading-tight">
            Gestify
          </span>
          <span className="text-sidebar-muted block text-xs font-normal">
            Admin da loja
          </span>
        </span>
      </div>

      <nav className="admin-sidebar__nav">
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
            >
              <span className="admin-sidebar__icon">
                <MuiIcon icon={item.icon} size={22} />
              </span>
              <span className="admin-sidebar__label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <footer className="admin-sidebar__footer text-sidebar-muted text-xs">
        Gestify System v0.1
      </footer>
    </aside>
  );
}
