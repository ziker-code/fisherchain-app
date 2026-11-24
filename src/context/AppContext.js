import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { PRODUCTS, TPI_PRICES, INITIAL_ORDERS } from '../constants/mockData';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  fetchInitialData,
  subscribeToChanges,
  insertProduct,
  insertOrders,
  updateTpiPrice,
  updateOrderStatus as apiUpdateOrderStatus,
  mapProduct,
  mapOrder,
  mapPrice,
  resolveImage,
} from '../services/api';
import {
  isLocalStoreAvailable,
  loadLocal,
  saveLocal,
  clearLocal,
  subscribeLocal,
} from '../lib/localStore';

const AppContext = createContext();

const ALERT_THRESHOLD_C = 4.0;
const LIVE_SENSOR_TIMEOUT_MS = 15000;
// Di Mode Demo, satu tab menjadi "sensor" dan tab lain mengikuti nilainya.
const DEMO_SENSOR_FOLLOW_MS = 6000;

// Mode Demo tersimpan: tanpa Supabase, data disimpan di localStorage
// dan disinkronkan antar tab di perangkat yang sama.
const useLocalPersistence = !isSupabaseConfigured && isLocalStoreAvailable;

// `image` hasil require() tidak bisa di-serialize; simpan hanya URL string,
// lalu pulihkan dari imageKey saat dimuat.
const serializeItems = (items) =>
  items.map(({ image, ...rest }) => (typeof image === 'string' ? { ...rest, image } : rest));
const deserializeItems = (items) =>
  items.map((item) => ({ ...item, image: resolveImage(item.imageKey, item.image) }));

const loadItems = (key, fallback) => {
  if (!useLocalPersistence) return fallback;
  const saved = loadLocal(key, null);
  return Array.isArray(saved) ? deserializeItems(saved) : fallback;
};

// Gabungkan perubahan realtime ke list: INSERT/UPDATE = upsert, DELETE = hapus.
function applyChange(list, payload, mapper, key = 'id') {
  if (payload.eventType === 'DELETE') {
    return list.filter((item) => item[key] !== payload.old[key]);
  }
  const next = mapper(payload.new);
  const idx = list.findIndex((item) => item[key] === next[key]);
  if (idx === -1) return [next, ...list];
  const copy = [...list];
  copy[idx] = { ...copy[idx], ...next };
  return copy;
}

const newId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;

export function AppProvider({ children }) {
  const [activeRole, setActiveRole] = useState('buyer'); // 'buyer' | 'admin'
  const [products, setProducts] = useState(() => loadItems('products', PRODUCTS));
  const [orders, setOrders] = useState(() => loadItems('orders', INITIAL_ORDERS));
  const [prices, setPrices] = useState(() =>
    useLocalPersistence ? loadLocal('prices', TPI_PRICES) : TPI_PRICES
  );
  const [cartItems, setCartItems] = useState([]);

  // 'demo' = data lokal (Supabase belum diset), 'connecting', 'live', 'error'
  const [syncStatus, setSyncStatus] = useState(isSupabaseConfigured ? 'connecting' : 'demo');

  // Sensor suhu cold storage (IoT). Data live dari tabel sensor_readings,
  // fallback ke simulasi lokal bila tidak ada data masuk.
  const [temperature, setTemperature] = useState(() =>
    useLocalPersistence ? loadLocal('sensor', { t: 1.8 }).t : 1.8
  );
  const [sensorSource, setSensorSource] = useState('simulasi'); // 'live' | 'simulasi'
  const lastLiveReadingAt = useRef(0);
  const lastTabReadingAt = useRef(0);

  // ---------- Mode Demo: simpan ke localStorage & sinkron antar tab ----------
  // Penanda agar data yang baru diterima dari tab lain tidak ditulis ulang.
  const fromOtherTab = useRef({ products: false, orders: false, prices: false });

  const usePersist = (key, value, serialize = (v) => v) => {
    useEffect(() => {
      if (!useLocalPersistence) return;
      if (fromOtherTab.current[key]) {
        fromOtherTab.current[key] = false;
        return;
      }
      saveLocal(key, serialize(value));
    }, [value]);
  };
  usePersist('products', products, serializeItems);
  usePersist('orders', orders, serializeItems);
  usePersist('prices', prices);

  const publishTemperature = (t) => {
    setTemperature(t);
    if (useLocalPersistence) saveLocal('sensor', { t, at: Date.now() });
  };

  useEffect(() => {
    if (!useLocalPersistence) return undefined;
    return subscribeLocal((key, value) => {
      if (key === 'sensor') {
        if (value) {
          lastTabReadingAt.current = Date.now();
          setTemperature(value.t);
        }
        return;
      }
      const setters = { products: setProducts, orders: setOrders, prices: setPrices };
      const defaults = { products: PRODUCTS, orders: INITIAL_ORDERS, prices: TPI_PRICES };
      if (!setters[key]) return;
      fromOtherTab.current[key] = true;
      if (value === null) setters[key](defaults[key]);
      else setters[key](key === 'prices' ? value : deserializeItems(value));
    });
  }, []);

  // Kembalikan data demo ke kondisi awal (di semua tab).
  const resetDemoData = () => {
    clearLocal();
    setProducts(PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setPrices(TPI_PRICES);
    setCartItems([]);
    publishTemperature(1.8);
  };

  const applyReading = useCallback((row) => {
    if (!row) return;
    const age = Date.now() - new Date(row.created_at).getTime();
    if (age > LIVE_SENSOR_TIMEOUT_MS) return;
    lastLiveReadingAt.current = Date.now();
    setTemperature(Number(row.temperature_c));
    setSensorSource('live');
  }, []);

  // ---------- Load awal + langganan realtime ----------
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    let unsubscribe = () => {};
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchInitialData();
        if (cancelled) return;
        setProducts(data.products);
        setOrders(data.orders);
        if (data.prices.length) setPrices(data.prices);
        applyReading(data.latestReading);

        unsubscribe = subscribeToChanges(
          {
            products: (p) => setProducts((prev) => applyChange(prev, p, mapProduct)),
            orders: (p) => setOrders((prev) => applyChange(prev, p, mapOrder)),
            tpi_prices: (p) => setPrices((prev) => applyChange(prev, p, mapPrice, 'category')),
            sensor_readings: (p) => p.eventType === 'INSERT' && applyReading(p.new),
          },
          (status) => {
            if (status === 'SUBSCRIBED') setSyncStatus('live');
            else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setSyncStatus('error');
          }
        );
      } catch (err) {
        console.warn('Gagal memuat data Supabase, memakai data demo:', err.message);
        if (!cancelled) setSyncStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [applyReading]);

  // ---------- Simulasi suhu bila sensor live tidak aktif ----------
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastLiveReadingAt.current < LIVE_SENSOR_TIMEOUT_MS) return;
      setSensorSource('simulasi');
      // Tab lain sedang menjadi "sensor" → ikuti nilainya saja
      if (Date.now() - lastTabReadingAt.current < DEMO_SENSOR_FOLLOW_MS) return;
      setTemperature((prev) => {
        const change = (Math.random() - 0.5) * 0.4;
        const next = Math.max(0.5, Math.min(5.5, Number((prev + change).toFixed(1))));
        if (useLocalPersistence) saveLocal('sensor', { t: next, at: Date.now() });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const resetTemperature = () => {
    if (sensorSource === 'simulasi') publishTemperature(1.5);
  };

  const reportError = (action) => (err) => {
    console.warn(`${action} gagal disinkronkan:`, err.message);
  };

  // ---------- Keranjang (lokal per perangkat) ----------
  const addToCart = (product, qty) => {
    setCartItems((prevItems) => {
      const idx = prevItems.findIndex((item) => item.id === product.id);
      if (idx > -1) {
        const newItems = [...prevItems];
        newItems[idx] = { ...newItems[idx], qty: newItems[idx].qty + qty };
        return newItems;
      }
      return [...prevItems, { ...product, qty }];
    });
  };

  const clearCart = () => setCartItems([]);

  // ---------- Pesanan ----------
  const placeOrder = (items) => {
    const newOrders = items.map((item) => ({
      id: newId('ord'),
      name: item.name,
      qty: item.qty,
      unit: item.unit || 'kg',
      price: item.price,
      koperasi: item.koperasi,
      imageKey: item.imageKey,
      image: item.image,
      status: 'Dalam Perjalanan',
      eta: '45 menit',
      kurir: 'Kurir Handoko',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      nelayan: item.nelayan || 'Nelayan Pak Ahmad',
      tanggalTangkap: item.tanggalTangkap || '12 Juni 2026',
      tpi: item.tpi || 'TPI Karangsong',
      tempC: item.tempC || '2°C',
      storageTime: item.storageTime || '18 jam',
      avgTemp: item.avgTemp || '1.8°C',
    }));

    // Optimistic update; event realtime dengan id yang sama akan di-upsert.
    setOrders((prev) => [...newOrders, ...prev]);
    clearCart();

    if (isSupabaseConfigured) insertOrders(newOrders).catch(reportError('Pesanan'));
    return newOrders;
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (isSupabaseConfigured) apiUpdateOrderStatus(id, status).catch(reportError('Status pesanan'));
  };

  // ---------- Stok (dari bot WhatsApp nelayan) ----------
  const addNewStock = (newProduct) => {
    const exists = products.some(
      (p) => p.name === newProduct.name && p.koperasi === newProduct.koperasi
    );
    if (exists) return;

    const product = { ...newProduct, id: newProduct.id || newId('prd') };
    setProducts((prev) => [product, ...prev]);
    if (isSupabaseConfigured) insertProduct(product).catch(reportError('Stok baru'));
  };

  // ---------- Harga TPI (Price Intelligence) ----------
  const updatePrice = (category, newPrice) => {
    const current = prices.find((p) => p.category === category);
    if (!current) return null;

    const diff = ((newPrice - current.price) / current.price) * 100;
    const change = diff > 0 ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`;
    const trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';
    const updated = { ...current, price: newPrice, trend, change };

    setPrices((prev) => prev.map((p) => (p.category === category ? updated : p)));
    setProducts((prev) => prev.map((p) => (p.category === category ? { ...p, price: newPrice } : p)));

    if (isSupabaseConfigured) updateTpiPrice(updated).catch(reportError('Harga TPI'));
    return updated;
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        products,
        cartItems,
        addToCart,
        clearCart,
        orders,
        placeOrder,
        updateOrderStatus,
        addNewStock,
        prices,
        updatePrice,
        cartCount,
        syncStatus,
        temperature,
        isTempAlert: temperature >= ALERT_THRESHOLD_C,
        sensorSource,
        resetTemperature,
        resetDemoData,
        isDemoPersistent: useLocalPersistence,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
