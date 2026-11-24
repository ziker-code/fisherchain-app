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
} from '../services/api';

const AppContext = createContext();

const ALERT_THRESHOLD_C = 4.0;
const LIVE_SENSOR_TIMEOUT_MS = 15000;

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
  const [products, setProducts] = useState(PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [prices, setPrices] = useState(TPI_PRICES);
  const [cartItems, setCartItems] = useState([]);

  // 'demo' = data lokal (Supabase belum diset), 'connecting', 'live', 'error'
  const [syncStatus, setSyncStatus] = useState(isSupabaseConfigured ? 'connecting' : 'demo');

  // Sensor suhu cold storage (IoT). Data live dari tabel sensor_readings,
  // fallback ke simulasi lokal bila tidak ada data masuk.
  const [temperature, setTemperature] = useState(1.8);
  const [sensorSource, setSensorSource] = useState('simulasi'); // 'live' | 'simulasi'
  const lastLiveReadingAt = useRef(0);

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
      setTemperature((prev) => {
        const change = (Math.random() - 0.5) * 0.4;
        return Math.max(0.5, Math.min(5.5, Number((prev + change).toFixed(1))));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const resetTemperature = () => {
    if (sensorSource === 'simulasi') setTemperature(1.5);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
