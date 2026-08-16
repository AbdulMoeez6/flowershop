-- Enable public read access to settings
create policy "Public can read settings" on public.settings for select using (true);
