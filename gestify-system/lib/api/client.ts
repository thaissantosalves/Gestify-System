import type {
  Notification,
  Order,
  Product,
  StockMovement,
  StockMovementType,
  TeamMember,
} from "@/lib/server/types";

async function parseJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
    };
    throw new Error(
      body.error ?? body.message ?? `Erro HTTP ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}

export const api = {
  bootstrap() {
    return parseJson<{
      products: Product[];
      orders: Order[];
      teamMembers: TeamMember[];
      stockMovements: StockMovement[];
      notifications: Notification[];
      unreadCount: number;
    }>("/api/bootstrap");
  },

  createProduct(data: Omit<Product, "id">) {
    return parseJson<Product>("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  createOrder(data: Omit<Order, "id" | "date">) {
    return parseJson<Order>("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  createUser(data: Omit<TeamMember, "id" | "lastAccess">) {
    return parseJson<TeamMember>("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  createStockMovement(data: {
    productId: string;
    type: StockMovementType;
    quantity: number;
    user: string;
  }) {
    return parseJson<{ movement: StockMovement; product: Product }>(
      "/api/stock-movements",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
  },

  fetchNotifications() {
    return parseJson<{ notifications: Notification[]; unreadCount: number }>(
      "/api/notifications",
    );
  },

  createNotification(
    data: Omit<Notification, "id" | "read" | "createdAt">,
  ) {
    return parseJson<Notification>("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  markNotificationRead(id: string) {
    return parseJson<{ unreadCount: number }>(
      `/api/notifications/${id}/read`,
      { method: "PATCH" },
    );
  },

  markAllNotificationsRead() {
    return parseJson<{ notifications: Notification[]; unreadCount: number }>(
      "/api/notifications/read-all",
      { method: "PATCH" },
    );
  },
};
