-- =====================================================================
-- Fisherchain.id — skema database Supabase
-- Jalankan seluruh file ini di Supabase Dashboard → SQL Editor → Run.
-- Aman dijalankan ulang (idempotent): tabel dibuat jika belum ada,
-- data contoh di-upsert.
-- =====================================================================

-- ---------- Tabel ----------

create table if not exists public.products (
  id              text primary key default gen_random_uuid()::text,
  name            text not null,
  price           integer not null check (price >= 0),
  original_price  integer,
  unit            text not null default 'kg',
  rating          numeric(2,1) not null default 5.0,
  reviews         integer not null default 0,
  koperasi        text not null,
  verified        boolean not null default false,
  location        text,
  image_key       text default 'kakap',   -- kakap | tuna | udang | cumi (aset lokal)
  image_url       text,                   -- opsional: URL gambar (mis. Supabase Storage)
  description     text,
  nelayan         text,
  tanggal_tangkap text,
  tpi             text,
  temp_c          text,
  storage_time    text,
  avg_temp        text,
  category        text not null,
  weight_kg       numeric(8,2),
  created_at      timestamptz not null default now()
);

create table if not exists public.orders (
  id              text primary key,
  name            text not null,
  qty             numeric(8,2) not null check (qty > 0),
  unit            text not null default 'kg',
  price           integer not null,
  koperasi        text,
  image_key       text default 'kakap',
  image_url       text,
  status          text not null default 'Dalam Perjalanan',  -- 'Dalam Perjalanan' | 'Selesai'
  eta             text,
  kurir           text,
  date_label      text,
  nelayan         text,
  tanggal_tangkap text,
  tpi             text,
  temp_c          text,
  storage_time    text,
  avg_temp        text,
  created_at      timestamptz not null default now()
);

create table if not exists public.tpi_prices (
  category    text primary key,          -- Kakap | Tuna | Udang | Cumi
  name        text not null,
  price       integer not null check (price >= 0),
  trend       text not null default 'stable',   -- up | down | stable
  change_pct  text not null default '0%',
  sort_order  integer not null default 0,
  updated_at  timestamptz not null default now()
);

create table if not exists public.sensor_readings (
  id             bigint generated always as identity primary key,
  device_id      text not null default 'CS-01',
  temperature_c  numeric(4,1) not null,
  created_at     timestamptz not null default now()
);

create index if not exists sensor_readings_created_at_idx
  on public.sensor_readings (created_at desc);

-- ---------- Realtime ----------
-- Daftarkan tabel ke publikasi supabase_realtime agar perubahan dikirim ke klien.

do $$
declare t text;
begin
  foreach t in array array['products', 'orders', 'tpi_prices', 'sensor_readings'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- Kirim baris lama lengkap saat UPDATE/DELETE
alter table public.products replica identity full;
alter table public.orders replica identity full;
alter table public.tpi_prices replica identity full;

-- ---------- Row Level Security ----------
-- CATATAN: aplikasi ini adalah prototype tanpa login sungguhan, jadi role `anon`
-- diberi akses baca/tulis. Untuk produksi, ganti dengan Supabase Auth dan
-- kebijakan berbasis auth.uid() / role pengguna.

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.tpi_prices enable row level security;
alter table public.sensor_readings enable row level security;

drop policy if exists "public read products" on public.products;
drop policy if exists "public insert products" on public.products;
drop policy if exists "public update products" on public.products;
create policy "public read products"   on public.products for select using (true);
create policy "public insert products" on public.products for insert with check (true);
create policy "public update products" on public.products for update using (true) with check (true);

drop policy if exists "public read orders" on public.orders;
drop policy if exists "public insert orders" on public.orders;
drop policy if exists "public update orders" on public.orders;
create policy "public read orders"   on public.orders for select using (true);
create policy "public insert orders" on public.orders for insert with check (true);
create policy "public update orders" on public.orders for update using (true) with check (true);

drop policy if exists "public read prices" on public.tpi_prices;
drop policy if exists "public update prices" on public.tpi_prices;
create policy "public read prices"   on public.tpi_prices for select using (true);
create policy "public update prices" on public.tpi_prices for update using (true) with check (true);

drop policy if exists "public read sensor" on public.sensor_readings;
drop policy if exists "public insert sensor" on public.sensor_readings;
create policy "public read sensor"   on public.sensor_readings for select using (true);
create policy "public insert sensor" on public.sensor_readings for insert with check (true);

-- ---------- Data contoh ----------

insert into public.products
  (id, name, price, original_price, unit, rating, reviews, koperasi, verified, location, image_key,
   description, nelayan, tanggal_tangkap, tpi, temp_c, storage_time, avg_temp, category, created_at)
values
  ('1', 'Kakap Merah Segar', 78000, 90000, 'kg', 4.8, 120, 'Koperasi Nelayan Indramayu', true,
   'Karangsong, Indramayu', 'kakap',
   'Kakap merah segar hasil tangkapan nelayan tradisional Indramayu menggunakan alat tangkap ramah lingkungan. Langsung dibekukan dengan es kristal di pendaratan TPI.',
   'Nelayan Pak Ahmad', '12 Juni 2026', 'TPI Karangsong', '2°C', '18 jam', '1.8°C', 'Kakap', now() - interval '1 minute'),
  ('2', 'Tuna Bluefin Premium', 150000, 175000, 'kg', 4.9, 85, 'Koperasi Mina Jaya Bali', true,
   'Benoa, Bali', 'tuna',
   'Tuna kualitas ekspor (Grade A) ditangkap secara perorangan (handline). Preservasi dingin ketat dari palka hingga TPI Benoa.',
   'Nelayan Bli Wayan', '12 Juni 2026', 'TPI Benoa', '1.5°C', '12 jam', '1.2°C', 'Tuna', now() - interval '2 minutes'),
  ('3', 'Udang Windu Super', 110000, 120000, 'kg', 4.7, 64, 'Koperasi Nelayan Muara Angke', false,
   'Muara Angke, Jakarta', 'udang',
   'Udang windu berukuran besar (size 20) segar tangkapan pesisir utara Jakarta. Bersih tanpa bahan pengawet kimia.',
   'Nelayan Pak Udin', '13 Juni 2026', 'TPI Muara Angke', '3°C', '6 jam', '2.5°C', 'Udang', now() - interval '3 minutes'),
  ('4', 'Cumi-Cumi Telur Segar', 85000, 95000, 'kg', 4.6, 43, 'Koperasi Nelayan Indramayu', true,
   'Karangsong, Indramayu', 'cumi',
   'Cumi-cumi segar dengan tekstur kenyal dan tinta utuh. Menjaga kualitas rasa alami laut saat dimasak.',
   'Nelayan Pak Joko', '12 Juni 2026', 'TPI Karangsong', '2°C', '20 jam', '2.0°C', 'Cumi', now() - interval '4 minutes')
on conflict (id) do nothing;

insert into public.tpi_prices (category, name, price, trend, change_pct, sort_order) values
  ('Kakap', 'Kakap Merah',  78000,  'up',     '12%', 1),
  ('Tuna',  'Tuna Bluefin', 150000, 'stable', '0%',  2),
  ('Udang', 'Udang Windu',  110000, 'down',   '-3%', 3),
  ('Cumi',  'Cumi-Cumi',    85000,  'up',     '8%',  4)
on conflict (category) do nothing;

insert into public.orders
  (id, name, qty, unit, price, koperasi, image_key, status, eta, kurir, date_label,
   nelayan, tanggal_tangkap, tpi, temp_c, storage_time, avg_temp, created_at)
values
  ('ord-101', 'Kakap Merah Segar', 5, 'kg', 78000, 'Koperasi Nelayan Indramayu', 'kakap',
   'Dalam Perjalanan', '45 menit', 'Kurir Handoko', '12 Juni 2026',
   'Nelayan Pak Ahmad', '12 Juni 2026', 'TPI Karangsong', '2°C', '18 jam', '1.8°C', now() - interval '1 hour'),
  ('ord-100', 'Tuna Bluefin Premium', 2, 'kg', 150000, 'Koperasi Mina Jaya Bali', 'tuna',
   'Selesai', null, null, '10 Juni 2026',
   'Nelayan Bli Wayan', '10 Juni 2026', 'TPI Benoa', '1.5°C', '12 jam', '1.2°C', now() - interval '2 days')
on conflict (id) do nothing;
