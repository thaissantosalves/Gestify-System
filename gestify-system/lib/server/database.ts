import {
  mapCategory,
  mapNotification,
  mapOrder,
  mapProduct,
  mapSettings,
  mapStockMovement,
  mapTeamMember,
  publicId,
} from "./mappers";
import { buildDashboardOverview } from "@/lib/dashboard/build-overview";
import type { DashboardOverview } from "@/lib/dashboard/types";
import { isUuid } from "./resolve-id";
import { getSupabase } from "./supabase";
import type {
  CategorySummary,
  Database,
  Notification,
  Order,
  Product,
  StockMovementType,
  StoreSettings,
  TeamMember,
} from "./types";
import { nextId } from "./utils";

type CodeTable =
  | "products"
  | "orders"
  | "team_members"
  | "stock_movements"
  | "notifications";

async function nextCode(prefix: string, table: CodeTable): Promise<string> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from(table).select("code");
  if (error) throw error;
  const codes = (data ?? [])
    .map((row) => row.code as string | null)
    .filter((c): c is string => Boolean(c?.startsWith(`${prefix}-`)));
  return nextId(prefix, codes.map((code) => ({ id: code })));
}

async function resolveProductUuid(publicProductId: string): Promise<{
  uuid: string;
  name: string;
  code: string | null;
} | null> {
  const supabase = getSupabase();
  let query = supabase
    .from("products")
    .select("id, code, name");

  query = isUuid(publicProductId)
    ? query.or(`code.eq.${publicProductId},id.eq.${publicProductId}`)
    : query.eq("code", publicProductId);

  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return { uuid: data.id, name: data.name, code: data.code };
}

async function resolveRowUuid(
  table: "products" | "notifications",
  publicIdValue: string,
): Promise<string | null> {
  const supabase = getSupabase();
  let query = supabase.from(table).select("id");

  query = isUuid(publicIdValue)
    ? query.or(`code.eq.${publicIdValue},id.eq.${publicIdValue}`)
    : query.eq("code", publicIdValue);

  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}

async function createNotification(
  n: Omit<Notification, "id" | "read" | "createdAt">,
): Promise<Notification> {
  const supabase = getSupabase();
  const code = await nextCode("NTF", "notifications");
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      code,
      title: n.title,
      message: n.message,
      type: n.type,
      read: false,
      href: n.href ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapNotification(data);
}

function filterProducts(products: Product[], search?: string) {
  if (!search?.trim()) return products;
  const q = search.trim().toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
  );
}

function filterOrders(orders: Order[], search?: string) {
  if (!search?.trim()) return orders;
  const q = search.trim().toLowerCase();
  return orders.filter(
    (o) =>
      o.customer.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.channel.toLowerCase().includes(q),
  );
}

function filterUsers(users: TeamMember[], search?: string) {
  if (!search?.trim()) return users;
  const q = search.trim().toLowerCase();
  return users.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q),
  );
}

function filterMovements(
  movements: ReturnType<typeof mapStockMovement>[],
  search?: string,
) {
  if (!search?.trim()) return movements;
  const q = search.trim().toLowerCase();
  return movements.filter(
    (m) =>
      m.product.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.user.toLowerCase().includes(q),
  );
}

export const db = {
  async getAll(): Promise<Database> {
    const [
      products,
      orders,
      teamMembers,
      stockMovements,
      notifications,
      settings,
      categories,
    ] = await Promise.all([
      db.listProducts(),
      db.listOrders(),
      db.listUsers(),
      db.listStockMovements(),
      db.listNotifications(),
      db.getSettings(),
      db.getCategories(),
    ]);

    return {
      products,
      orders,
      teamMembers,
      stockMovements,
      notifications,
      settings,
      categories,
    };
  },

  async listProducts(search?: string): Promise<Product[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return filterProducts((data ?? []).map(mapProduct), search);
  },

  async getProduct(id: string): Promise<Product | null> {
    const supabase = getSupabase();
    let query = supabase.from("products").select("*");

    query = isUuid(id)
      ? query.or(`code.eq.${id},id.eq.${id}`)
      : query.eq("code", id);

    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    return data ? mapProduct(data) : null;
  },

  async createProduct(data: Omit<Product, "id">): Promise<Product> {
    const supabase = getSupabase();
    let status = data.status;
    if (data.stock === 0) status = "esgotado";

    const code = await nextCode("PRD", "products");
    const { data: row, error } = await supabase
      .from("products")
      .insert({
        code,
        name: data.name,
        sku: data.sku,
        category: data.category,
        price: data.price,
        stock: data.stock,
        status,
      })
      .select()
      .single();

    if (error) throw error;
    const product = mapProduct(row);

    await createNotification({
      title: "Produto cadastrado",
      message: `${product.name} foi adicionado ao catálogo.`,
      type: "sistema",
      href: "/produtos",
    });

    return product;
  },

  async updateProduct(
    id: string,
    data: Partial<Omit<Product, "id">>,
  ): Promise<Product | null> {
    const uuid = await resolveRowUuid("products", id);
    if (!uuid) return null;

    const supabase = getSupabase();
    const patch = { ...data };
    if (patch.stock === 0) patch.status = "esgotado";

    const { data: row, error } = await supabase
      .from("products")
      .update(patch)
      .eq("id", uuid)
      .select()
      .single();

    if (error) throw error;
    return mapProduct(row);
  },

  async deleteProduct(id: string): Promise<boolean> {
    const uuid = await resolveRowUuid("products", id);
    if (!uuid) return false;

    const supabase = getSupabase();
    const { error, count } = await supabase
      .from("products")
      .delete({ count: "exact" })
      .eq("id", uuid);

    if (error) throw error;
    return (count ?? 0) > 0;
  },

  async listOrders(search?: string): Promise<Order[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("ordered_at", { ascending: false });

    if (error) throw error;
    return filterOrders((data ?? []).map(mapOrder), search);
  },

  async createOrder(data: Omit<Order, "id" | "date">): Promise<Order> {
    const supabase = getSupabase();
    const code = await nextCode("PED", "orders");
    const { data: row, error } = await supabase
      .from("orders")
      .insert({
        code,
        customer: data.customer,
        items: data.items,
        total: data.total,
        channel: data.channel,
        status: data.status,
      })
      .select()
      .single();

    if (error) throw error;
    const order = mapOrder(row);

    await createNotification({
      title: "Novo pedido",
      message: `${order.id} — ${order.customer} (${order.status}).`,
      type: "venda",
      href: "/vendas",
    });

    return order;
  },

  async listUsers(search?: string): Promise<TeamMember[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return filterUsers((data ?? []).map(mapTeamMember), search);
  },

  async createUser(
    data: Omit<TeamMember, "id" | "lastAccess">,
  ): Promise<TeamMember> {
    const supabase = getSupabase();
    const code = await nextCode("USR", "team_members");
    const { data: row, error } = await supabase
      .from("team_members")
      .insert({
        code,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
      })
      .select()
      .single();

    if (error) throw error;
    const member = mapTeamMember(row);

    await createNotification({
      title: "Usuário convidado",
      message: `${member.name} foi adicionado como ${member.role}.`,
      type: "usuario",
      href: "/usuarios",
    });

    return member;
  },

  async listStockMovements(search?: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("stock_movements")
      .select(
        "id, code, product_id, type, quantity, moved_at, user_name, products ( name, code )",
      )
      .order("moved_at", { ascending: false });

    if (error) throw error;

    const movements = (data ?? []).map((row) => {
      const joined = Array.isArray(row.products) ? row.products[0] : row.products;
      return mapStockMovement(
        row,
        joined?.name,
        publicId(joined?.code ?? null, row.product_id),
      );
    });

    return filterMovements(movements, search);
  },

  async createStockMovement(input: {
    productId: string;
    type: StockMovementType;
    quantity: number;
    user: string;
  }) {
    const product = await resolveProductUuid(input.productId);
    if (!product) return null;

    let delta = input.quantity;
    if (input.type === "saída") delta = -Math.abs(input.quantity);
    if (input.type === "entrada") delta = Math.abs(input.quantity);

    const current = await db.getProduct(input.productId);
    if (!current) return null;

    const stock = Math.max(0, current.stock + delta);
    const status = stock === 0 ? "esgotado" : "ativo";

    const supabase = getSupabase();
    const { error: updateError } = await supabase
      .from("products")
      .update({ stock, status })
      .eq("id", product.uuid);

    if (updateError) throw updateError;

    const code = await nextCode("MOV", "stock_movements");
    const { data: movRow, error: movError } = await supabase
      .from("stock_movements")
      .insert({
        code,
        product_id: product.uuid,
        type: input.type,
        quantity: delta,
        user_name: input.user,
      })
      .select("id, code, product_id, type, quantity, moved_at, user_name")
      .single();

    if (movError) throw movError;

    const updatedProduct: Product = { ...current, stock, status };

    const movement = mapStockMovement(
      movRow,
      product.name,
      publicId(product.code, product.uuid),
    );

    const labels = { entrada: "Entrada", saída: "Saída", ajuste: "Ajuste" };
    await createNotification({
      title: "Movimentação registrada",
      message: `${labels[input.type]} de ${Math.abs(delta)} un. — ${product.name}.`,
      type: "estoque",
      href: "/estoque",
    });

    if (stock > 0 && stock <= 10) {
      await createNotification({
        title: "Estoque baixo",
        message: `${product.name} está com apenas ${stock} unidades.`,
        type: "estoque",
        href: "/estoque",
      });
    }

    return { movement, product: updatedProduct };
  },

  async listNotifications(): Promise<Notification[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(mapNotification);
  },

  async markNotificationRead(id: string): Promise<Notification | null> {
    const uuid = await resolveRowUuid("notifications", id);
    if (!uuid) return null;

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", uuid)
      .select()
      .single();

    if (error) throw error;
    return mapNotification(data);
  },

  async markAllNotificationsRead(): Promise<Notification[]> {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("read", false);

    if (error) throw error;
    return db.listNotifications();
  },

  async createNotification(
    data: Omit<Notification, "id" | "read" | "createdAt">,
  ): Promise<Notification> {
    return createNotification(data);
  },

  async getSettings(): Promise<StoreSettings> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return {
        storeName: "Gestify Store",
        cnpj: "",
        address: "",
        phone: "",
        email: "",
        openTime: "09:00",
        closeTime: "21:00",
        operatingDays: "",
      };
    }
    return mapSettings(data);
  },

  async updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    const supabase = getSupabase();
    const current = await db.getSettings();
    const merged = { ...current, ...data };

    const patch = {
      store_name: merged.storeName,
      cnpj: merged.cnpj,
      address: merged.address,
      phone: merged.phone,
      email: merged.email,
      open_time: merged.openTime,
      close_time: merged.closeTime,
      operating_days: merged.operatingDays,
    };

    const { data: existing } = await supabase
      .from("store_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { data: row, error } = await supabase
        .from("store_settings")
        .update(patch)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      await createNotification({
        title: "Configurações salvas",
        message: "Os dados da loja foram atualizados.",
        type: "sistema",
        href: "/configuracoes",
      });
      return mapSettings(row);
    }

    const { data: row, error } = await supabase
      .from("store_settings")
      .insert(patch)
      .select()
      .single();

    if (error) throw error;
    return mapSettings(row);
  },

  async getCategories(): Promise<CategorySummary[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("category_stats")
      .select("*")
      .order("name");

    if (error) throw error;
    return (data ?? []).map(mapCategory);
  },

  async getDashboardStats() {
    const overview = await db.getDashboardOverview();
    const notifications = await db.listNotifications();
    return {
      ...overview.stats,
      unreadNotifications: notifications.filter((n) => !n.read).length,
    };
  },

  async getDashboardOverview(): Promise<DashboardOverview> {
    const supabase = getSupabase();
    const [{ data: orders, error: ordersError }, { data: products, error: productsError }] =
      await Promise.all([
        supabase
          .from("orders")
          .select("total, channel, status, ordered_at"),
        supabase.from("products").select("category, stock, status"),
      ]);

    if (ordersError) throw ordersError;
    if (productsError) throw productsError;

    return buildDashboardOverview(orders ?? [], products ?? []);
  },
};
