/**
 * Ícones: sempre Material UI com sufixo Outlined.
 */
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

export type NavItem = {
  label: string;
  href: string;
  description: string;
  icon: SvgIconComponent;
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    description: "Visão geral da loja, indicadores e atalhos rápidos.",
    icon: DashboardOutlinedIcon,
  },
  {
    label: "Produtos",
    href: "/produtos",
    description: "Cadastro, categorias e preços dos produtos.",
    icon: CategoryOutlinedIcon,
  },
  {
    label: "Estoque",
    href: "/estoque",
    description: "Entradas, saídas e níveis de estoque.",
    icon: InventoryOutlinedIcon,
  },
  {
    label: "Vendas",
    href: "/vendas",
    description: "Pedidos, faturamento e histórico de vendas.",
    icon: PointOfSaleOutlinedIcon,
  },
  {
    label: "Usuários",
    href: "/usuarios",
    description: "Equipe, permissões e acessos ao sistema.",
    icon: PeopleOutlinedIcon,
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    description: "Dados da loja, integrações e preferências.",
    icon: SettingsOutlinedIcon,
  },
];

export function getNavItem(pathname: string): NavItem {
  const exact = navItems.find((item) => item.href === pathname);
  if (exact) return exact;

  const nested = navItems.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href),
  );
  return nested ?? navItems[0];
}
