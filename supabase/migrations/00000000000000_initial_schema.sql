-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role text default 'customer' check (role in ('admin', 'customer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CATEGORIES
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  short_description text,
  long_description text,
  base_price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  sku text,
  is_active boolean default true,
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCT CATEGORIES (Many-to-Many)
create table public.product_categories (
  product_id uuid references public.products(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

-- PRODUCT IMAGES
create table public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order integer default 0
);

-- PRODUCT VARIANTS
create table public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null, -- e.g., "Large", "Red", "Premium Packaging"
  price_adjustment numeric(10,2) default 0,
  stock integer default 0,
  sku text
);

-- ORDERS
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  guest_email text,
  guest_phone text,
  total_amount numeric(10,2) not null,
  order_status text default 'pending' check (order_status in ('pending', 'processing', 'completed', 'cancelled')),
  payment_method text not null check (payment_method in ('stripe', 'jazzcash', 'easypaisa', 'cod')),
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded', 'failed')),
  shipping_address jsonb,
  delivery_date date,
  delivery_time_slot text,
  gift_message text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDER ITEMS
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null
);

-- CONTENT PAGES
create table public.content_pages (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  content text,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SETTINGS
create table public.settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value jsonb not null,
  description text
);

-- Function for tracking updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger handle_updated_at_categories before update on public.categories for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_products before update on public.products for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_orders before update on public.orders for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_content_pages before update on public.content_pages for each row execute procedure public.handle_updated_at();

-- Security: Enable RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_categories enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.content_pages enable row level security;
alter table public.settings enable row level security;

-- Basic RLS Policies
-- Products/Categories (Public Read)
create policy "Public can read active products" on public.products for select using (is_active = true);
create policy "Public can read active categories" on public.categories for select using (is_active = true);
create policy "Public can read active product categories" on public.product_categories for select using (true);
create policy "Public can read active product images" on public.product_images for select using (true);
create policy "Public can read active product variants" on public.product_variants for select using (true);

-- Profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Orders
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
-- Note: Creation of orders will likely be handled via edge functions/service role to ensure pricing integrity, 
-- or we can allow users to insert own orders, but usually it's better to secure via backend.

-- Admin Policies (Admins can do everything)
-- Assuming we'll have a function `is_admin()` or we just check the profile role
create or replace function public.is_admin() returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

create policy "Admins have full access to products" on public.products using (public.is_admin());
create policy "Admins have full access to categories" on public.categories using (public.is_admin());
create policy "Admins have full access to profiles" on public.profiles using (public.is_admin());
create policy "Admins have full access to orders" on public.orders using (public.is_admin());
create policy "Admins have full access to order items" on public.order_items using (public.is_admin());
create policy "Admins have full access to content pages" on public.content_pages using (public.is_admin());
create policy "Admins have full access to settings" on public.settings using (public.is_admin());
