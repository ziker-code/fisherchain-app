import { Platform } from 'react-native';

// Penyimpanan lokal untuk Mode Demo (tanpa backend).
// - Data disimpan di localStorage sehingga tidak hilang saat refresh.
// - Event `storage` bawaan browser memberi tahu tab lain setiap kali data
//   berubah, jadi beberapa tab di perangkat yang sama tersinkron realtime.

const PREFIX = 'fisherchain:v1:';

const storage =
  Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage
    ? window.localStorage
    : null;

export const isLocalStoreAvailable = Boolean(storage);

export function loadLocal(key, fallback) {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveLocal(key, value) {
  if (!storage) return;
  try {
    storage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn('Gagal menyimpan data lokal:', err.message);
  }
}

export function clearLocal() {
  if (!storage) return;
  Object.keys(storage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => storage.removeItem(k));
}

// Dengarkan perubahan dari tab lain. Callback menerima (key, value|null).
export function subscribeLocal(callback) {
  if (!storage) return () => {};
  const handler = (e) => {
    if (!e.key || !e.key.startsWith(PREFIX)) return;
    let value = null;
    try {
      value = e.newValue ? JSON.parse(e.newValue) : null;
    } catch {
      return;
    }
    callback(e.key.slice(PREFIX.length), value);
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
