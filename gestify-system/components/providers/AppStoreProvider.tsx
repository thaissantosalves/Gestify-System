"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  products as initialProducts,
  orders as initialOrders,
  teamMembers as initialTeam,
  stockMovements as initialMovements,
  type Product,
  type Order,
  type TeamMember,
  type StockMovement,
} from "@/lib/mock-data";
import {
  initialNotifications,
  type AppNotification,
  type NotificationType,
} from "@/lib/notifications";

type AppStoreContextValue = {
  products: Product[];
  orders: Order[];
  teamMembers: TeamMember[];
  stockMovements: StockMovement[];
  notifications: AppNotification[];
  unreadCount: number;
  addProduct: (data: Omit<Product, "id">) => void;
  addOrder: (data: Omit<Order, "id" | "date">) => void;
  addTeamMember: (data: Omit<TeamMember, "id" | "lastAccess">) => void;
  addStockMovement: (data: {
    productName: string;
    type: StockMovement["type"];
    quantity: number;
    user: string;
  }) => void;
  pushNotification: (
    n: Omit<AppNotification, "id" | "read" | "createdAt">,
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
};

const AppStoreContext = createContext<AppStoreContextValue | null>(null);

function nowBr(): string {
  return new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function nextId(prefix: string, list: { id: string }[]): string {
  const nums = list
    .map((x) => parseInt(x.id.replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}-${String(next).padStart(4, "0")}`;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [teamMembers, setTeamMembers] = useState(initialTeam);
  const [stockMovements, setStockMovements] = useState(initialMovements);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const pushNotification = useCallback(
    (n: Omit<AppNotification, "id" | "read" | "createdAt">) => {
      setNotifications((prev) => {
        const item: AppNotification = {
          ...n,
          id: nextId("NTF", prev),
          read: false,
          createdAt: nowBr(),
        };
        return [item, ...prev];
      });
    },
    [],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addProduct = useCallback(
    (data: Omit<Product, "id">) => {
      const product: Product = {
        ...data,
        id: nextId("PRD", products),
      };
      setProducts((prev) => [product, ...prev]);
      pushNotification({
        title: "Produto cadastrado",
        message: `${product.name} foi adicionado ao catálogo.`,
        type: "sistema",
        href: "/produtos",
      });
    },
    [products, pushNotification],
  );

  const addOrder = useCallback(
    (data: Omit<Order, "id" | "date">) => {
      const order: Order = {
        ...data,
        id: nextId("PED", orders),
        date: nowBr(),
      };
      setOrders((prev) => [order, ...prev]);
      pushNotification({
        title: "Novo pedido",
        message: `${order.id} — ${order.customer} (${order.status}).`,
        type: "venda",
        href: "/vendas",
      });
    },
    [orders, pushNotification],
  );

  const addTeamMember = useCallback(
    (data: Omit<TeamMember, "id" | "lastAccess">) => {
      const member: TeamMember = {
        ...data,
        id: nextId("USR", teamMembers),
        lastAccess: "—",
      };
      setTeamMembers((prev) => [member, ...prev]);
      pushNotification({
        title: "Usuário convidado",
        message: `${member.name} foi adicionado como ${member.role}.`,
        type: "usuario",
        href: "/usuarios",
      });
    },
    [teamMembers, pushNotification],
  );

  const addStockMovement = useCallback(
    (data: {
      productName: string;
      type: StockMovement["type"];
      quantity: number;
      user: string;
    }) => {
      const mov: StockMovement = {
        id: nextId("MOV", stockMovements),
        product: data.productName,
        type: data.type,
        quantity: data.type === "saída" ? -Math.abs(data.quantity) : data.quantity,
        date: nowBr(),
        user: data.user,
      };
      setStockMovements((prev) => [mov, ...prev]);

      setProducts((prev) =>
        prev.map((p) => {
          if (p.name !== data.productName) return p;
          const delta =
            data.type === "entrada"
              ? Math.abs(data.quantity)
              : data.type === "saída"
                ? -Math.abs(data.quantity)
                : data.quantity;
          const stock = Math.max(0, p.stock + delta);
          return {
            ...p,
            stock,
            status: stock === 0 ? "esgotado" : "ativo",
          };
        }),
      );

      pushNotification({
        title: "Movimentação registrada",
        message: `${movementTypeLabel(data.type)} de ${Math.abs(data.quantity)} un. — ${data.productName}.`,
        type: "estoque",
        href: "/estoque",
      });
    },
    [stockMovements, pushNotification],
  );

  const value = useMemo(
    () => ({
      products,
      orders,
      teamMembers,
      stockMovements,
      notifications,
      unreadCount,
      addProduct,
      addOrder,
      addTeamMember,
      addStockMovement,
      pushNotification,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      products,
      orders,
      teamMembers,
      stockMovements,
      notifications,
      unreadCount,
      addProduct,
      addOrder,
      addTeamMember,
      addStockMovement,
      pushNotification,
      markNotificationRead,
      markAllNotificationsRead,
    ],
  );

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
}

function movementTypeLabel(type: StockMovement["type"]): string {
  const labels = { entrada: "Entrada", saída: "Saída", ajuste: "Ajuste" };
  return labels[type];
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore deve ser usado dentro de AppStoreProvider");
  }
  return ctx;
}
