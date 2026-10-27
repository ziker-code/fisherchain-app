import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  SafeAreaView 
} from 'react-native';
import { Truck, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function PesananScreen({ navigation }) {
  const { orders } = useApp();
  const [activeTab, setActiveTab] = useState('aktif'); // 'aktif' | 'riwayat'

  // Filter orders
  const activeOrders = orders.filter(ord => ord.status !== 'Selesai');
  const historyOrders = orders.filter(ord => ord.status === 'Selesai');

  // Format price to Rupiah
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const renderOrderItem = ({ item }) => {
    const isCompleted = item.status === 'Selesai';
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.orderDate}>{item.date}</Text>
            <Text style={styles.orderId}>ID: {item.id}</Text>
          </View>
          <View style={[
            styles.statusChip,
            { backgroundColor: isCompleted ? 'rgba(34, 197, 94, 0.1)' : 'rgba(26, 86, 255, 0.1)' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: isCompleted ? COLORS.success : COLORS.primary }
            ]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Image source={typeof item.image === 'string' && (item.image.startsWith('http') || item.image.startsWith('https')) ? { uri: item.image } : item.image} style={styles.itemImage} />
          <View style={styles.itemMeta}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemKoperasi}>{item.koperasi}</Text>
            <Text style={styles.itemPriceDetail}>
              {formatRupiah(item.price)} x {item.qty} {item.unit || 'kg'}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.footerLabel}>Total Pembayaran</Text>
            <Text style={styles.totalPrice}>{formatRupiah(item.price * item.qty + 15000)}</Text>
          </View>

          {isCompleted ? (
            <TouchableOpacity 
              style={[styles.actionBtn, styles.traceBtn]}
              onPress={() => navigation.navigate('Traceability', { product: item })}
              activeOpacity={0.8}
            >
              <Text style={styles.traceBtnText}>Lihat Traceability</Text>
              <ChevronRight size={14} color={COLORS.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.actionBtn, styles.trackBtn]}
              onPress={() => navigation.navigate('LiveTracking', { orderItems: [item] })}
              activeOpacity={0.8}
            >
              <Truck size={14} color={COLORS.textPrimary} style={{ marginRight: 6 }} />
              <Text style={styles.trackBtnText}>Lacak Pengiriman</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesanan Saya</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'aktif' && styles.tabActive]}
          onPress={() => setActiveTab('aktif')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabLabel, activeTab === 'aktif' && styles.tabLabelActive]}>
            Pesanan Aktif ({activeOrders.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'riwayat' && styles.tabActive]}
          onPress={() => setActiveTab('riwayat')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabLabel, activeTab === 'riwayat' && styles.tabLabelActive]}>
            Riwayat Selesai ({historyOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lists */}
      <FlatList
        data={activeTab === 'aktif' ? activeOrders : historyOrders}
        keyExtractor={item => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {activeTab === 'aktif' ? (
              <Truck size={48} color={COLORS.textSecondary} style={{ marginBottom: 12 }} />
            ) : (
              <CheckCircle2 size={48} color={COLORS.textSecondary} style={{ marginBottom: 12 }} />
            )}
            <Text style={styles.emptyText}>
              Tidak ada pesanan {activeTab === 'aktif' ? 'aktif' : 'dalam riwayat'}.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12,
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  orderId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardBody: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  itemMeta: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  itemKoperasi: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemPriceDetail: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  footerLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primary,
  },
  actionBtn: {
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  trackBtn: {
    backgroundColor: COLORS.accent,
  },
  trackBtnText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  traceBtn: {
    backgroundColor: 'rgba(0, 34, 131, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 34, 131, 0.15)',
  },
  traceBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
