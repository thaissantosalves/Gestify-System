import type {
  CategoryStock,
  ChannelSlice,
  DashboardOverview,
  DashboardStats,
  SalesDayPoint,
} from "./types";

type RawOrder = {
  total: number;
  channel: string;
  status: string;
  ordered_at: string;
};

type RawProduct = {
  category: string;
  stock: number;
  status: string;
};

const CHANNEL_ORDER = [
  "Loja física",
  "E-commerce",
  "WhatsApp",
  "Marketplace",
] as const;

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildSalesLast7Days(orders: RawOrder[]): SalesDayPoint[] {
  const today = startOfDay(new Date());
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  return days.map((day) => {
    const total = orders
      .filter((o) => o.status !== "cancelado")
      .filter((o) => isSameDay(new Date(o.ordered_at), day))
      .reduce((sum, o) => sum + Number(o.total), 0);

    const label = day.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
    });

    return { label, total };
  });
}

function buildOrdersByChannel(orders: RawOrder[]): ChannelSlice[] {
  const counts = new Map<string, number>();
  for (const o of orders) {
    counts.set(o.channel, (counts.get(o.channel) ?? 0) + 1);
  }

  const ordered: ChannelSlice[] = CHANNEL_ORDER.filter((ch) =>
    counts.has(ch),
  ).map((channel) => ({ channel, count: counts.get(channel)! }));

  for (const [channel, count] of counts) {
    if (!CHANNEL_ORDER.includes(channel as (typeof CHANNEL_ORDER)[number])) {
      ordered.push({ channel, count });
    }
  }

  return ordered;
}

function buildStockByCategory(products: RawProduct[]): CategoryStock[] {
  const map = new Map<string, number>();
  for (const p of products) {
    map.set(p.category, (map.get(p.category) ?? 0) + p.stock);
  }
  return [...map.entries()]
    .map(([category, units]) => ({ category, units }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 8);
}

function buildStats(
  orders: RawOrder[],
  products: RawProduct[],
): DashboardStats {
  const validOrders = orders.filter((o) => o.status !== "cancelado");
  return {
    totalSales: validOrders.reduce((acc, o) => acc + Number(o.total), 0),
    ordersCount: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pendente").length,
    activeProducts: products.filter((p) => p.status === "ativo").length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };
}

export function buildDashboardOverview(
  orders: RawOrder[],
  products: RawProduct[],
): DashboardOverview {
  return {
    stats: buildStats(orders, products),
    salesLast7Days: buildSalesLast7Days(orders),
    ordersByChannel: buildOrdersByChannel(orders),
    stockByCategory: buildStockByCategory(products),
  };
}
