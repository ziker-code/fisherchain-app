import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView 
} from 'react-native';
import { ArrowLeft, CreditCard, Landmark, Check } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

export default function CheckoutScreen({ navigation }) {
  const { cartItems, placeOrder } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('QRIS'); // 'QRIS' | 'Transfer'

  // Format price to Rupiah
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // If cart is empty, show default mock kakap
  const items = cartItems.length > 0 ? cartItems : [
    {
      id: '1',
      name: 'Kakap Merah Segar',
      price: 78000,
      unit: 'kg',
      qty: 5,
      koperasi: 'Koperasi Nelayan Indramayu',
      image: require('../assets/kakap.jpg'),
    }
  ];

  const totalProductPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = 15000;
  const grandTotal = totalProductPrice + deliveryFee;

  const handleOrder = () => {
    const createdOrders = placeOrder(items);
    alert('Pemesanan Berhasil! Menghubungkan ke kurir terdekat...');
    // Navigate to Live Tracking screen
    navigation.navigate('LiveTracking', { orderItems: createdOrders });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft color={COLORS.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keranjang & Checkout</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Order Items List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item Pesanan</Text>
          {items.map((item, idx) => (
            <View style={styles.itemCard} key={idx}>
              <Image source={typeof item.image === 'string' && (item.image.startsWith('http') || item.image.startsWith('https')) ? { uri: item.image } : item.image} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemKoperasi}>{item.koperasi}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.itemPrice}>{formatRupiah(item.price)}</Text>
                  <Text style={styles.itemQty}>x {item.qty} {item.unit}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilih Metode Pembayaran</Text>
          
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'QRIS' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('QRIS')}
            activeOpacity={0.8}
          >
            <View style={styles.paymentLeft}>
              <View style={[styles.paymentIconContainer, { backgroundColor: '#EEF2FF' }]}>
                <CreditCard color={COLORS.primary} size={20} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>QRIS / E-Wallet</Text>
                <Text style={styles.paymentSub}>Gopay, OVO, ShopeePay, LinkAja</Text>
              </View>
            </View>
            {paymentMethod === 'QRIS' && (
              <View style={styles.checkCircle}>
                <Check color={COLORS.white} size={14} />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'Transfer' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('Transfer')}
            activeOpacity={0.8}
          >
            <View style={styles.paymentLeft}>
              <View style={[styles.paymentIconContainer, { backgroundColor: '#ECFDF5' }]}>
                <Landmark color={COLORS.success} size={20} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Transfer Bank Virtual Account</Text>
                <Text style={styles.paymentSub}>Mandiri, BCA, BNI, BRI</Text>
              </View>
            </View>
            {paymentMethod === 'Transfer' && (
              <View style={styles.checkCircle}>
                <Check color={COLORS.white} size={14} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Ringkasan Pembayaran */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Pembayaran</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal Produk</Text>
            <Text style={styles.summaryVal}>{formatRupiah(totalProductPrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
            <Text style={styles.summaryVal}>{formatRupiah(deliveryFee)}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalVal}>{formatRupiah(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomLabel}>Total Tagihan</Text>
          <Text style={styles.bottomTotal}>{formatRupiah(grandTotal)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutBtn}
          onPress={handleOrder}
          activeOpacity={0.9}
        >
          <Text style={styles.checkoutBtnText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  itemKoperasi: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  itemQty: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  paymentOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#F8FAFC',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  paymentSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  bottomBar: {
    height: 80,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  bottomInfo: {
    flex: 1,
  },
  bottomLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  bottomTotal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 2,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
