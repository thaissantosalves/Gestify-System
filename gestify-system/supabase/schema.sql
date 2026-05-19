-- Gestify — execute no SQL Editor do Supabase (uma vez)

create extension if not exists "pgcrypto";

create type product_status as enum ('ativo', 'inativo', 'esgotado');
create type stock_movement_type as enum ('entrada', 'saída', 'ajuste');
create type order_channel as enum ('Loja física', 'E-commerce', 'WhatsApp', 'Marketplace');
create type order_status as enum ('pendente', 'pago', 'enviado', 'cancelado');
create type user_role as enum ('Administrador', 'Gerente', 'Vendedor', 'Estoquista');
create type user_status as enum ('ativo', 'inativo');
create type notification_type as enum ('estoque', 'venda', 'usuario', 'sistema', 'integracao');

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  name text not null,
  sku text not null unique,
  category text not null,
  price numeric(12, 2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  status product_status not null default 'ativo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  customer text not null,
  items integer not null check (items > 0),
  total numeric(12, 2) not null check (total > 0),
  channel order_channel not null,
  status order_status not null default 'pendente',
  ordered_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  name text not null,
  email text not null unique,
  role user_role not null,
  status user_status not null default 'ativo',
  last_access timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  product_id uuid not null references public.products (id) on delete restrict,
  type stock_movement_type not null,
  quantity integer not null check (quantity <> 0),
  moved_at timestamptz not null default now(),
  user_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  title text not null,
  message text not null,
  type notification_type not null,
  read boolean not null default false,
  href text,
  created_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  cnpj text,
  address text,
  phone text,
  email text,
  open_time time,
  close_time time,
  operating_days text,
  updated_at timestamptz not null default now()
);

create table if not exists public.category_stats (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  product_count integer not null default 0,
  revenue numeric(14, 2) not null default 0,
  updated_at timestamptz not null default now()
);

-- RLS: o Gestify usa SUPABASE_SERVICE_ROLE_KEY nas API routes (ignora RLS).
-- Políticas abaixo são opcionais (ex.: se no futuro o browser acessar o Supabase direto).
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.team_members enable row level security;
alter table public.stock_movements enable row level security;
alter table public.notifications enable row level security;
alter table public.store_settings enable row level security;
alter table public.category_stats enable row level security;

create policy "gestify_all_products" on public.products for all using (true) with check (true);
create policy "gestify_all_orders" on public.orders for all using (true) with check (true);
create policy "gestify_all_team" on public.team_members for all using (true) with check (true);
create policy "gestify_all_stock" on public.stock_movements for all using (true) with check (true);
create policy "gestify_all_notifications" on public.notifications for all using (true) with check (true);
create policy "gestify_all_settings" on public.store_settings for all using (true) with check (true);
create policy "gestify_all_categories" on public.category_stats for all using (true) with check (true);
