"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api/client";
import type {
  Order,
  Product,
  StockMovement,
  StockMovementType,
  TeamMember,
} from "@/lib/server/types";
import type { AppNotification, NotificationType } from "@/lib/notifications";

type AppStoreContextValue = {
  isLoading: boolean;
  products: Product[];
  orders: Order[];
  teamMembers: TeamMember[];
  stockMovements: StockMovement[];
  notifications: AppNotification[];
  unreadCount: number;
  addProduct: (data: Omit<Product, "id">) => Promise<void>;
  addOrder: (data: Omit<Order, "id" | "date">) => Promise<void>;
  addTeamMember: (data: Omit<TeamMember, "id" | "lastAccess">) => Promise<void>;
  addStockMovement: (data: {
    productId: string;
    type: StockMovementType;
    quantity: number;
    user: string;
  }) => Promise<void>;
  pushNotification: (
    n: Omit<AppNotification, "id" | "read" | "createdAt">,
  ) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
};

const AppStoreContext = createContext<AppStoreContextValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshNotifications = useCallback(async () => {
    const data = await api.fetchNotifications();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.bootstrap();
        if (cancelled) return;
        setProducts(data.products);
        setOrders(data.orders);
        setTeamMembers(data.teamMembers);
        setStockMovements(data.stockMovements);
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (err) {
        console.error("Falha ao carregar dados:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pushNotification = useCallback(
    async (n: Omit<AppNotification, "id" | "read" | "createdAt">) => {
      await api.createNotification({
        title: n.title,
        message: n.message,
        type: n.type as NotificationType,
        href: n.href,
      });
      await refreshNotifications();
    },
    [refreshNotifications],
  );

  const markNotificationRead = useCallback(
    async (id: string) => {
      const data = await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount(data.unreadCount);
    },
    [],
  );

  const markAllNotificationsRead = useCallback(async () => {
    const data = await api.markAllNotificationsRead();
    setNotifications(data.notifications);
    setUnreadCount(0);
  }, []);

  const addProduct = useCallback(
    async (data: Omit<Product, "id">) => {
      const product = await api.createProduct(data);
      setProducts((prev) => [product, ...prev]);
      await refreshNotifications();
    },
    [refreshNotifications],
  );

  const addOrder = useCallback(
    async (data: Omit<Order, "id" | "date">) => {
      const order = await api.createOrder(data);
      setOrders((prev) => [order, ...prev]);
      await refreshNotifications();
    },
    [refreshNotifications],
  );

  const addTeamMember = useCallback(
    async (data: Omit<TeamMember, "id" | "lastAccess">) => {
      const member = await api.createUser(data);
      setTeamMembers((prev) => [member, ...prev]);
      await refreshNotifications();
    },
    [refreshNotifications],
  );

  const addStockMovement = useCallback(
    async (data: {
      productId: string;
      type: StockMovementType;
      quantity: number;
      user: string;
    }) => {
      const result = await api.createStockMovement(data);
      setStockMovements((prev) => [result.movement, ...prev]);
      setProducts((prev) =>
        prev.map((p) => (p.id === result.product.id ? result.product : p)),
      );
      await refreshNotifications();
    },
    [refreshNotifications],
  );

  const value = useMemo(
    () => ({
      isLoading,
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
      isLoading,
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

  if (isLoading) {
    return (
      <div className="app-loading" role="status" aria-live="polite">
        <p className="text-secondary">Carregando Gestify...</p>
      </div>
    );
  }

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore deve ser usado dentro de AppStoreProvider");
  }
  return ctx;
}
