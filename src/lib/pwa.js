import { Platform } from 'react-native';

// Mendaftarkan service worker (public/sw.js) agar aplikasi bisa di-install
// sebagai PWA dan tetap terbuka saat koneksi lemah. Hanya di build produksi web.
export function registerServiceWorker() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (process.env.NODE_ENV !== 'production') return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker gagal didaftarkan:', err);
    });
  });
}
