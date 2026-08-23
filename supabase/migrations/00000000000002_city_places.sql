create table
  public.city_places (
    id uuid not null default gen_random_uuid (),
    city_slug text not null,
    name text not null,
    slug text not null,
    is_active boolean not null default true,
    created_at timestamp with time zone not null default now(),
    constraint city_places_pkey primary key (id),
    constraint city_places_city_slug_slug_key unique (city_slug, slug)
  ) tablespace pg_default;

-- Set up Row Level Security (RLS)
alter table public.city_places enable row level security;

-- Policies for city_places
create policy "Allow public read access on city_places" on public.city_places
  for select
  using (is_active = true);

-- We assume authenticated users (admins) have full access. (Assuming Supabase policies in other tables are similar)
create policy "Allow all actions for authenticated users" on public.city_places
  for all
  to authenticated
  using (true)
  with check (true);
