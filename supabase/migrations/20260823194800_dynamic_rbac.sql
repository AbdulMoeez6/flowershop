-- 1. Create RBAC tables
CREATE TABLE public.roles (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  description text,
  is_system boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE public.permissions (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE public.role_permissions (
  role_id uuid references public.roles(id) on delete cascade,
  permission_id uuid references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

-- 2. Update profiles table
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD COLUMN role_id uuid references public.roles(id) on delete set null;

-- 3. Insert default permissions
INSERT INTO public.permissions (name, description) VALUES
  ('manage_users', 'Can create, edit, and delete staff users'),
  ('manage_roles', 'Can create, edit, and delete roles and permissions'),
  ('manage_products', 'Can create, edit, and delete products and categories'),
  ('manage_orders', 'Can view and update order statuses'),
  ('manage_settings', 'Can update global store settings');

-- 4. Insert Super Admin role
INSERT INTO public.roles (name, description, is_system) VALUES
  ('Super Admin', 'Has all permissions and can manage everything', true);

-- 5. Assign all permissions to Super Admin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p WHERE r.name = 'Super Admin';

-- 6. Migrate existing admin users
UPDATE public.profiles 
SET role_id = (SELECT id FROM public.roles WHERE name = 'Super Admin')
WHERE role = 'admin';

-- 7. RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Allow public read access to permissions" ON public.permissions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to role_permissions" ON public.role_permissions FOR SELECT USING (true);
