import { supabase } from '../lib/supabase';

// Gambar lokal yang dibundel; baris di database cukup menyimpan `image_key`.
// Jika `image_url` diisi (mis. dari Supabase Storage), URL itu yang dipakai.
const IMAGES = {
  kakap: require('../assets/kakap.jpg'),
  tuna: require('../assets/tuna.jpg'),
  udang: require('../assets/udang.jpg'),
  cumi: require('../assets/cumi.jpg'),
};

const resolveImage = (key, url) => url || IMAGES[key] || IMAGES.kakap;

// ---------- Mapping baris DB (snake_case) <-> objek aplikasi (camelCase) ----------

export function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : null,
    unit: row.unit,
    rating: Number(row.rating),
    reviews: row.reviews,
    koperasi: row.koperasi,
    verified: row.verified,
    location: row.location,
    imageKey: row.image_key,
    image: resolveImage(row.image_key, row.image_url),
    description: row.description,
    nelayan: row.nelayan,
    tanggalTangkap: row.tanggal_tangkap,
    tpi: row.tpi,
    tempC: row.temp_c,
    storageTime: row.storage_time,
    avgTemp: row.avg_temp,
    category: row.category,
    weightKg: row.weight_kg != null ? Number(row.weight_kg) : null,
    createdAt: row.created_at,
  };
}

export function mapOrder(row) {
  return {
    id: row.id,
    name: row.name,
    qty: Number(row.qty),
    unit: row.unit,
    price: Number(row.price),
    koperasi: row.koperasi,
    imageKey: row.image_key,
    image: resolveImage(row.image_key, row.image_url),
    status: row.status,
    eta: row.eta,
    kurir: row.kurir,
    date: row.date_label,
    nelayan: row.nelayan,
    tanggalTangkap: row.tanggal_tangkap,
    tpi: row.tpi,
    tempC: row.temp_c,
    storageTime: row.storage_time,
    avgTemp: row.avg_temp,
    createdAt: row.created_at,
  };
}

export function mapPrice(row) {
  return {
    category: row.category,
    name: row.name,
    price: Number(row.price),
    trend: row.trend,
    change: row.change_pct,
    updatedAt: row.updated_at,
  };
}

const productToRow = (p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  original_price: p.originalPrice,
  unit: p.unit || 'kg',
  rating: p.rating ?? 5,
  reviews: p.reviews ?? 0,
  koperasi: p.koperasi,
  verified: p.verified ?? false,
  location: p.location,
  image_key: p.imageKey || 'kakap',
  image_url: typeof p.image === 'string' ? p.image : null,
  description: p.description,
  nelayan: p.nelayan,
  tanggal_tangkap: p.tanggalTangkap,
  tpi: p.tpi,
  temp_c: p.tempC,
  storage_time: p.storageTime,
  avg_temp: p.avgTemp,
  category: p.category,
  weight_kg: p.weightKg ?? null,
});

const orderToRow = (o) => ({
  id: o.id,
  name: o.name,
  qty: o.qty,
  unit: o.unit,
  price: o.price,
  koperasi: o.koperasi,
  image_key: o.imageKey || 'kakap',
  image_url: typeof o.image === 'string' ? o.image : null,
  status: o.status,
  eta: o.eta,
  kurir: o.kurir,
  date_label: o.date,
  nelayan: o.nelayan,
  tanggal_tangkap: o.tanggalTangkap,
  tpi: o.tpi,
  temp_c: o.tempC,
  storage_time: o.storageTime,
  avg_temp: o.avgTemp,
});

// ---------- Query ----------

export async function fetchInitialData() {
  const [products, orders, prices, reading] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('tpi_prices').select('*').order('sort_order', { ascending: true }),
    supabase
      .from('sensor_readings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1),
  ]);

  const firstError = [products, orders, prices, reading].find((r) => r.error)?.error;
  if (firstError) throw firstError;

  return {
    products: products.data.map(mapProduct),
    orders: orders.data.map(mapOrder),
    prices: prices.data.map(mapPrice),
    latestReading: reading.data[0] || null,
  };
}

// ---------- Mutasi ----------

export async function insertProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert(productToRow(product))
    .select()
    .single();
  if (error) throw error;
  return mapProduct(data);
}

export async function insertOrders(orders) {
  const { error } = await supabase.from('orders').insert(orders.map(orderToRow));
  if (error) throw error;
}

export async function updateOrderStatus(id, status) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
}

// Update harga TPI sekaligus menyesuaikan harga produk di kategori yang sama,
// sehingga pembeli langsung melihat harga baru secara realtime.
export async function updateTpiPrice({ category, price, trend, change }) {
  const { error } = await supabase
    .from('tpi_prices')
    .update({ price, trend, change_pct: change, updated_at: new Date().toISOString() })
    .eq('category', category);
  if (error) throw error;

  const { error: prodError } = await supabase
    .from('products')
    .update({ price })
    .eq('category', category);
  if (prodError) throw prodError;
}

// ---------- Realtime ----------

// Berlangganan semua perubahan tabel. `handlers` berisi callback per tabel
// yang menerima payload postgres_changes dari Supabase Realtime.
export function subscribeToChanges(handlers, onStatus) {
  const channel = supabase.channel('fisherchain-live');

  Object.entries(handlers).forEach(([table, handler]) => {
    channel.on('postgres_changes', { event: '*', schema: 'public', table }, handler);
  });

  channel.subscribe((status) => onStatus?.(status));

  return () => {
    supabase.removeChannel(channel);
  };
}
