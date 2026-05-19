export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "ativo" | "inativo" | "esgotado";
};

export type StockMovement = {
  id: string;
  productId?: string;
  product: string;
  type: "entrada" | "saída" | "ajuste";
  quantity: number;
  date: string;
  user: string;
};

export type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  channel: "Loja física" | "E-commerce" | "WhatsApp" | "Marketplace";
  status: "pendente" | "pago" | "enviado" | "cancelado";
  date: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Administrador" | "Gerente" | "Vendedor" | "Estoquista";
  status: "ativo" | "inativo";
  lastAccess: string;
};

export const products: Product[] = [
  {
    id: "PRD-001",
    name: "Camiseta Básica Algodão",
    sku: "CAM-BAS-M",
    category: "Vestuário",
    price: 59.9,
    stock: 124,
    status: "ativo",
  },
  {
    id: "PRD-002",
    name: "Tênis Runner Pro",
    sku: "TEN-RUN-42",
    category: "Calçados",
    price: 289.9,
    stock: 18,
    status: "ativo",
  },
  {
    id: "PRD-003",
    name: "Mochila Urban 20L",
    sku: "MCH-URB-20",
    category: "Acessórios",
    price: 149.9,
    stock: 0,
    status: "esgotado",
  },
  {
    id: "PRD-004",
    name: "Relógio Digital Sport",
    sku: "REL-DIG-S",
    category: "Acessórios",
    price: 199.9,
    stock: 42,
    status: "ativo",
  },
  {
    id: "PRD-005",
    name: "Calça Jeans Slim",
    sku: "CAL-JEA-40",
    category: "Vestuário",
    price: 129.9,
    stock: 8,
    status: "ativo",
  },
  {
    id: "PRD-006",
    name: "Fone Bluetooth ANC",
    sku: "FON-BT-A",
    category: "Eletrônicos",
    price: 349.9,
    stock: 31,
    status: "ativo",
  },
];

export const stockMovements: StockMovement[] = [
  {
    id: "MOV-1042",
    product: "Camiseta Básica Algodão",
    type: "entrada",
    quantity: 50,
    date: "19/05/2026 09:14",
    user: "Carlos Estoque",
  },
  {
    id: "MOV-1041",
    product: "Tênis Runner Pro",
    type: "saída",
    quantity: 3,
    date: "19/05/2026 08:42",
    user: "Ana Vendas",
  },
  {
    id: "MOV-1040",
    product: "Mochila Urban 20L",
    type: "saída",
    quantity: 2,
    date: "18/05/2026 17:20",
    user: "Ana Vendas",
  },
  {
    id: "MOV-1039",
    product: "Calça Jeans Slim",
    type: "ajuste",
    quantity: -1,
    date: "18/05/2026 11:05",
    user: "Carlos Estoque",
  },
  {
    id: "MOV-1038",
    product: "Fone Bluetooth ANC",
    type: "entrada",
    quantity: 15,
    date: "17/05/2026 14:30",
    user: "Carlos Estoque",
  },
];

export const orders: Order[] = [
  {
    id: "PED-5024",
    customer: "Maria Silva",
    items: 3,
    total: 449.7,
    channel: "E-commerce",
    status: "pago",
    date: "19/05/2026 10:32",
  },
  {
    id: "PED-5023",
    customer: "João Santos",
    items: 1,
    total: 289.9,
    channel: "Loja física",
    status: "enviado",
    date: "19/05/2026 09:15",
  },
  {
    id: "PED-5022",
    customer: "Ana Costa",
    items: 2,
    total: 209.8,
    channel: "WhatsApp",
    status: "pendente",
    date: "18/05/2026 16:48",
  },
  {
    id: "PED-5021",
    customer: "Pedro Lima",
    items: 4,
    total: 679.6,
    channel: "Marketplace",
    status: "cancelado",
    date: "18/05/2026 11:22",
  },
  {
    id: "PED-5020",
    customer: "Fernanda Rocha",
    items: 2,
    total: 499.8,
    channel: "E-commerce",
    status: "enviado",
    date: "17/05/2026 15:10",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "USR-01",
    name: "Thais Admin",
    email: "thais@gestify.com.br",
    role: "Administrador",
    status: "ativo",
    lastAccess: "19/05/2026 11:20",
  },
  {
    id: "USR-02",
    name: "Carlos Estoque",
    email: "carlos@gestify.com.br",
    role: "Estoquista",
    status: "ativo",
    lastAccess: "19/05/2026 09:14",
  },
  {
    id: "USR-03",
    name: "Ana Vendas",
    email: "ana@gestify.com.br",
    role: "Vendedor",
    status: "ativo",
    lastAccess: "19/05/2026 08:42",
  },
  {
    id: "USR-04",
    name: "Ricardo Gerente",
    email: "ricardo@gestify.com.br",
    role: "Gerente",
    status: "ativo",
    lastAccess: "18/05/2026 18:00",
  },
  {
    id: "USR-05",
    name: "Julia Suporte",
    email: "julia@gestify.com.br",
    role: "Vendedor",
    status: "inativo",
    lastAccess: "10/05/2026 14:30",
  },
];

export const categories = [
  { name: "Vestuário", count: 48, revenue: 12450 },
  { name: "Calçados", count: 22, revenue: 18900 },
  { name: "Acessórios", count: 35, revenue: 8320 },
  { name: "Eletrônicos", count: 18, revenue: 15600 },
];

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function productStatusBadge(
  status: Product["status"],
): "success" | "warning" | "danger" {
  if (status === "ativo") return "success";
  if (status === "esgotado") return "danger";
  return "warning";
}

export function orderStatusBadge(
  status: Order["status"],
): "success" | "warning" | "danger" {
  if (status === "pago" || status === "enviado") return "success";
  if (status === "pendente") return "warning";
  return "danger";
}

export function movementTypeLabel(type: StockMovement["type"]): string {
  const labels = { entrada: "Entrada", saída: "Saída", ajuste: "Ajuste" };
  return labels[type];
}
