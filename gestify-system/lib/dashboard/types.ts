export type DashboardStats = {
  totalSales: number;
  ordersCount: number;
  pendingOrders: number;
  activeProducts: number;
  lowStock: number;
  outOfStock: number;
};

export type SalesDayPoint = {
  label: string;
  total: number;
};

export type ChannelSlice = {
  channel: string;
  count: number;
};

export type CategoryStock = {
  category: string;
  units: number;
};

export type DashboardOverview = {
  stats: DashboardStats;
  salesLast7Days: SalesDayPoint[];
  ordersByChannel: ChannelSlice[];
  stockByCategory: CategoryStock[];
};
