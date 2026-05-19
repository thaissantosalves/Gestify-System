export type ProductStatus = "ativo" | "inativo" | "esgotado";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
};

export type StockMovementType = "entrada" | "saída" | "ajuste";

export type StockMovement = {
  id: string;
  productId: string;
  product: string;
  type: StockMovementType;
  quantity: number;
  date: string;
  user: string;
};

export type OrderChannel =
  | "Loja física"
  | "E-commerce"
  | "WhatsApp"
  | "Marketplace";

export type OrderStatus = "pendente" | "pago" | "enviado" | "cancelado";

export type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  channel: OrderChannel;
  status: OrderStatus;
  date: string;
};

export type UserRole =
  | "Administrador"
  | "Gerente"
  | "Vendedor"
  | "Estoquista";

export type UserStatus = "ativo" | "inativo";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastAccess: string;
};

export type NotificationType =
  | "estoque"
  | "venda"
  | "usuario"
  | "sistema"
  | "integracao";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  href?: string;
};

export type StoreSettings = {
  storeName: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  openTime: string;
  closeTime: string;
  operatingDays: string;
};

export type CategorySummary = {
  name: string;
  count: number;
  revenue: number;
};

export type Database = {
  products: Product[];
  orders: Order[];
  teamMembers: TeamMember[];
  stockMovements: StockMovement[];
  notifications: Notification[];
  settings: StoreSettings;
  categories: CategorySummary[];
};
