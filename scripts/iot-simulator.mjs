// Simulator sensor IoT cold storage.
// Mengirim pembacaan suhu ke tabel `sensor_readings` setiap 4 detik, sehingga
// semua perangkat yang membuka aplikasi melihat suhu yang sama secara realtime.
// Perangkat sungguhan (mis. ESP32 + DS18B20) cukup melakukan INSERT yang sama.
//
// Pemakaian:  npm run iot:simulate
// Membaca EXPO_PUBLIC_SUPABASE_URL & EXPO_PUBLIC_SUPABASE_ANON_KEY dari .env

import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Set EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di .env terlebih dahulu.');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const DEVICE_ID = process.env.DEVICE_ID || 'CS-01';
let temp = 1.8;

async function tick() {
  // Sesekali buat lonjakan suhu agar alert terlihat saat demo
  const spike = Math.random() < 0.05 ? 2.5 : 0;
  temp = Math.max(0.5, Math.min(5.5, temp + (Math.random() - 0.5) * 0.4 + spike));
  if (temp > 4.5) temp -= 1; // pendinginan kembali

  const value = Number(temp.toFixed(1));
  const { error } = await supabase
    .from('sensor_readings')
    .insert({ device_id: DEVICE_ID, temperature_c: value });

  const time = new Date().toLocaleTimeString('id-ID');
  if (error) console.error(`[${time}] gagal kirim:`, error.message);
  else console.log(`[${time}] ${DEVICE_ID} → ${value}°C${value >= 4 ? '  ⚠ KRITIS' : ''}`);
}

console.log(`Simulator IoT ${DEVICE_ID} berjalan. Ctrl+C untuk berhenti.`);
tick();
setInterval(tick, 4000);
