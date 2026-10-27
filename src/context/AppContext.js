import React, { createContext, useState, useContext } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeRole, setActiveRole] = useState('buyer'); // 'buyer' | 'admin'
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([
    {
      id: 'ord-101',
      name: 'Kakap Merah Segar',
      qty: 5,
      unit: 'kg',
      price: 78000,
      koperasi: 'Koperasi Nelayan Indramayu',
      image: require('../assets/kakap.jpg'),
      status: 'Dalam Perjalanan',
      eta: '45 menit',
      kurir: 'Kurir Handoko',
      date: '12 Juni 2026',
    },
    {
      id: 'ord-100',
      name: 'Tuna Bluefin Premium',
      qty: 2,
      unit: 'kg',
      price: 150000,
      koperasi: 'Koperasi Mina Jaya Bali',
      image: require('../assets/tuna.jpg'),
      status: 'Selesai',
      date: '10 Juni 2026',
      nelayan: 'Nelayan Bli Wayan',
      tanggalTangkap: '10 Juni 2026',
      tpi: 'TPI Benoa',
      tempC: '1.5°C',
      storageTime: '12 jam',
      avgTemp: '1.2°C',
    }
  ]);

  const addToCart = (product, qty) => {
    setCartItems((prevItems) => {
      const idx = prevItems.findIndex((item) => item.id === product.id);
      if (idx > -1) {
        const newItems = [...prevItems];
        newItems[idx].qty += qty;
        return newItems;
      }
      return [...prevItems, { ...product, qty }];
    });
  };

  const clearCart = () => setCartItems([]);

  const placeOrder = (items) => {
    const newOrders = items.map((item, idx) => ({
      id: `ord-${Math.floor(Math.random() * 90000) + 10000}`,
      name: item.name,
      qty: item.qty,
      unit: item.unit || 'kg',
      price: item.price,
      koperasi: item.koperasi,
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

    setOrders((prevOrders) => [...newOrders, ...prevOrders]);
    clearCart();
    return newOrders;
  };

  const addNewStock = (newProduct) => {
    setProducts((prevProducts) => {
      // If product with same name and koperasi exists, update its weight or average
      const idx = prevProducts.findIndex(p => p.name === newProduct.name && p.koperasi === newProduct.koperasi);
      if (idx > -1) {
        const updated = [...prevProducts];
        // simple simulation: increase pricing slightly or keep it
        return updated;
      }
      return [newProduct, ...prevProducts];
    });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <AppContext.Provider value={{
      activeRole,
      setActiveRole,
      products,
      cartItems,
      addToCart,
      clearCart,
      orders,
      placeOrder,
      addNewStock,
      cartCount
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
