export type NotificationType =
  | "estoque"
  | "venda"
  | "usuario"
  | "sistema"
  | "integracao";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  href?: string;
};

export const initialNotifications: AppNotification[] = [
  {
    id: "NTF-001",
    title: "Estoque baixo",
    message: "Calça Jeans Slim está com apenas 8 unidades.",
    type: "estoque",
    read: false,
    createdAt: "19/05/2026 11:05",
    href: "/estoque",
  },
  {
    id: "NTF-002",
    title: "Pedido pendente",
    message: "PED-5022 aguardando confirmação de pagamento.",
    type: "venda",
    read: false,
    createdAt: "19/05/2026 10:45",
    href: "/vendas",
  },
  {
    id: "NTF-003",
    title: "Produto esgotado",
    message: "Mochila Urban 20L sem estoque disponível.",
    type: "estoque",
    read: false,
    createdAt: "19/05/2026 09:30",
    href: "/produtos",
  },
  {
    id: "NTF-004",
    title: "Integração pendente",
    message: "Conecte sua loja Shopify para sincronizar pedidos.",
    type: "integracao",
    read: true,
    createdAt: "18/05/2026 16:00",
    href: "/configuracoes",
  },
  {
    id: "NTF-005",
    title: "Usuário inativo",
    message: "Julia Suporte não acessa o sistema há 9 dias.",
    type: "usuario",
    read: true,
    createdAt: "18/05/2026 08:00",
    href: "/usuarios",
  },
];

export function notificationTypeLabel(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    estoque: "Estoque",
    venda: "Venda",
    usuario: "Usuário",
    sistema: "Sistema",
    integracao: "Integração",
  };
  return map[type];
}
