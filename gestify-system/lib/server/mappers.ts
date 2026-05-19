import type {
  CategorySummary,
  Notification,
  Order,
  Product,
  StockMovement,
  StoreSettings,
  TeamMember,
} from "./types";
import { formatBrDateTime } from "./utils";

export function publicId(code: string | null | undefined, uuid: string): string {
  return code?.trim() || uuid;
}

export function mapProduct(row: {
  id: string;
  code: string | null;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: Product["status"];
}): Product {
  return {
    id: publicId(row.code, row.id),
    name: row.name,
    sku: row.sku,
    category: row.category,
    price: Number(row.price),
    stock: row.stock,
    status: row.status,
  };
}

export function mapOrder(row: {
  id: string;
  code: string | null;
  customer: string;
  items: number;
  total: number;
  channel: Order["channel"];
  status: Order["status"];
  ordered_at: string;
}): Order {
  return {
    id: publicId(row.code, row.id),
    customer: row.customer,
    items: row.items,
    total: Number(row.total),
    channel: row.channel,
    status: row.status,
    date: formatBrDateTime(row.ordered_at),
  };
}

export function mapTeamMember(row: {
  id: string;
  code: string | null;
  name: string;
  email: string;
  role: TeamMember["role"];
  status: TeamMember["status"];
  last_access: string | null;
}): TeamMember {
  return {
    id: publicId(row.code, row.id),
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    lastAccess: row.last_access ? formatBrDateTime(row.last_access) : "—",
  };
}

export function mapStockMovement(
  row: {
    id: string;
    code: string | null;
    product_id: string;
    type: StockMovement["type"];
    quantity: number;
    moved_at: string;
    user_name: string;
    products?: { name: string } | { name: string }[] | null;
  },
  productNameFallback?: string,
  productPublicId?: string,
): StockMovement {
  const joined = row.products;
  const productName = Array.isArray(joined)
    ? joined[0]?.name
    : joined?.name;

  return {
    id: publicId(row.code, row.id),
    productId: productPublicId ?? row.product_id,
    product: productName ?? productNameFallback ?? "",
    type: row.type,
    quantity: row.quantity,
    date: formatBrDateTime(row.moved_at),
    user: row.user_name,
  };
}

export function mapNotification(row: {
  id: string;
  code: string | null;
  title: string;
  message: string;
  type: Notification["type"];
  read: boolean;
  href: string | null;
  created_at: string;
}): Notification {
  return {
    id: publicId(row.code, row.id),
    title: row.title,
    message: row.message,
    type: row.type,
    read: row.read,
    href: row.href ?? undefined,
    createdAt: formatBrDateTime(row.created_at),
  };
}

export function mapSettings(row: {
  store_name: string;
  cnpj: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  open_time: string | null;
  close_time: string | null;
  operating_days: string | null;
}): StoreSettings {
  return {
    storeName: row.store_name,
    cnpj: row.cnpj ?? "",
    address: row.address ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    openTime: row.open_time?.slice(0, 5) ?? "09:00",
    closeTime: row.close_time?.slice(0, 5) ?? "21:00",
    operatingDays: row.operating_days ?? "",
  };
}

export function mapCategory(row: {
  name: string;
  product_count: number;
  revenue: number;
}): CategorySummary {
  return {
    name: row.name,
    count: row.product_count,
    revenue: Number(row.revenue),
  };
}
