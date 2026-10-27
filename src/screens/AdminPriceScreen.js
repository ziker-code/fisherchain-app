import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { Landmark, ArrowUpRight, TrendingUp, RefreshCw, Bell } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import Button from '../components/Button';

export default function AdminPriceScreen() {
  const [prices, setPrices] = useState([
    { name: 'Kakap Merah', price: '78000', trend: 'up', change: '12%' },
    { name: 'Tuna Bluefin', price: '150000', trend: 'stable', change: '0%' },
    { name: 'Udang Windu', price: '110000', trend: 'down', change: '-3%' },
    { name: 'Cumi-Cumi', price: '85000', trend: 'up', change: '8%' }
  ]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  const handleUpdatePrice = (index) => {
    if (!newPrice) return;
    
    const updated = [...prices];
    const oldPrice = Number(updated[index].price);
    const updatedVal = Number(newPrice);
    
    // Calculate simulated price difference/percentage
    const diff = ((updatedVal - oldPrice) / oldPrice) * 100;
    const changeText = diff > 0 ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`;
    const trendText = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';
    
    updated[index].price = newPrice;
    updated[index].change = changeText;
    updated[index].trend = trendText;

    setPrices(updated);
    setEditingIndex(null);
    setNewPrice('');

    // Trigger WhatsApp Price Intelligence Simulator Notification
    alert(`Harga TPI ${updated[index].name} berhasil diperbarui menjadi Rp ${Number(newPrice).toLocaleString('id-ID')}/kg. Notifikasi otomatis terkirim ke WhatsApp Nelayan!`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Price Intelligence Monitor</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Section pricing table */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Manajemen Harga TPI Karangsong</Text>
          <Text style={styles.cardSub}>Update harga harian per komoditas ikan</Text>

          {prices.map((item, idx) => (
            <View style={styles.priceRow} key={idx}>
              <View style={styles.left}>
                <Text style={styles.fishName}>{item.name}</Text>
                <View style={styles.trendIndicator}>
                  <Text style={[
                    styles.changeText,
                    item.trend === 'up' && styles.textUp,
                    item.trend === 'down' && styles.textDown,
                  ]}>
                    {item.change}
                  </Text>
                  <Text style={styles.trendLabel}> 7 hari terakhir</Text>
                </View>
              </View>

              <View style={styles.right}>
                {editingIndex === idx ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.editInput}
                      keyboardType="numeric"
                      value={newPrice}
                      onChangeText={setNewPrice}
                      placeholder={item.price}
                    />
                    <TouchableOpacity 
                      style={styles.saveBtn}
                      onPress={() => handleUpdatePrice(idx)}
                    >
                      <Text style={styles.saveBtnText}>Simpan</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.priceValueRow}>
                    <Text style={styles.priceText}>
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </Text>
                    <TouchableOpacity 
                      style={styles.editBtn}
                      onPress={() => {
                        setEditingIndex(idx);
                        setNewPrice(item.price);
                      }}
                    >
                      <Text style={styles.editBtnText}>Ubah</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Info card on price notifications */}
        <View style={styles.infoCard}>
          <Bell size={20} color={COLORS.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Sistem Notifikasi WA Otomatis</Text>
            <Text style={styles.infoSub}>
              Nelayan akan menerima pesan WhatsApp secara otomatis ketika harga komoditas naik lebih dari 10%.
            </Text>
          </View>
        </View>

        {/* Price History Visualization */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Histori Harga Pasar 30 Hari</Text>
          <View style={styles.graphContainer}>
            <View style={styles.verticalAxis}>
              <Text style={styles.axisText}>Rp 100rb</Text>
              <Text style={styles.axisText}>Rp 80rb</Text>
              <Text style={styles.axisText}>Rp 60rb</Text>
            </View>
            <View style={styles.graphLines}>
              {/* Lines grid representation */}
              <View style={styles.horizontalLine} />
              <View style={[styles.horizontalLine, { top: '50%' }]} />
              <View style={[styles.horizontalLine, { bottom: 0 }]} />
              {/* Mini Sparkline points */}
              <View style={styles.sparklineContainer}>
                <View style={[styles.point, { bottom: 10 }]} />
                <View style={[styles.point, { bottom: 25 }]} />
                <View style={[styles.point, { bottom: 20 }]} />
                <View style={[styles.point, { bottom: 35 }]} />
                <View style={[styles.point, { bottom: 42 }]} />
                <View style={[styles.point, { bottom: 65 }]} />
                <View style={[styles.point, { bottom: 60 }]} />
              </View>
            </View>
          </View>
          <View style={styles.graphXAxis}>
            <Text style={styles.xAxisText}>Minggu 1</Text>
            <Text style={styles.xAxisText}>Minggu 2</Text>
            <Text style={styles.xAxisText}>Minggu 3</Text>
            <Text style={styles.xAxisText}>Hari Ini</Text>
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  cardSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  fishName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  changeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  textUp: {
    color: COLORS.success,
  },
  textDown: {
    color: COLORS.danger,
  },
  trendLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  priceValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 8,
  },
  editBtn: {
    backgroundColor: 'rgba(0, 34, 131, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  editBtnText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    width: 80,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 32,
    fontSize: 12,
    marginRight: 6,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 11,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 34, 131, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 34, 131, 0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  infoSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  graphContainer: {
    flexDirection: 'row',
    height: 100,
    marginTop: 16,
  },
  verticalAxis: {
    width: 46,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  axisText: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  graphLines: {
    flex: 1,
    marginLeft: 8,
    position: 'relative',
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  sparklineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 8,
  },
  point: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  graphXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 54,
    marginTop: 8,
  },
  xAxisText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
});
