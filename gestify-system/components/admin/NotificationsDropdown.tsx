"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import MuiIcon from "@/components/ui/MuiIcon";
import { useAppStore } from "@/components/providers/AppStoreProvider";
import { notificationTypeLabel } from "@/lib/notifications";

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAppStore();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="notifications-wrap" ref={ref}>
      <button
        type="button"
        className="admin-header__icon-btn notifications-trigger"
        aria-label="Notificações"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MuiIcon icon={NotificationsOutlinedIcon} />
        {unreadCount > 0 && (
          <span className="notifications-badge" aria-hidden>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notifications-panel bg-card">
          <header className="notifications-panel__header">
            <h3 className="text-primary font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notifications-mark-all text-brand"
                onClick={markAllNotificationsRead}
              >
                <MuiIcon icon={DoneAllOutlinedIcon} size={16} />
                Marcar todas
              </button>
            )}
          </header>

          <ul className="notifications-list">
            {notifications.length === 0 ? (
              <li className="notifications-empty text-muted">
                Nenhuma notificação
              </li>
            ) : (
              notifications.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href ?? "/"}
                    className={`notifications-item ${n.read ? "notifications-item--read" : ""}`}
                    onClick={() => {
                      markNotificationRead(n.id);
                      setOpen(false);
                    }}
                  >
                    <span className="notifications-item__type">
                      {notificationTypeLabel(n.type)}
                    </span>
                    <span className="notifications-item__title text-primary">
                      {n.title}
                    </span>
                    <span className="notifications-item__msg text-secondary">
                      {n.message}
                    </span>
                    <span className="notifications-item__time text-muted">
                      {n.createdAt}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
