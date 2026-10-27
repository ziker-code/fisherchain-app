import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Box, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Download,
  Calendar,
  ChevronRight
} from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function AdminDashboardScreen({ navigation }) {
  const { products, orders } = useApp();
  const [temperature, setTemperature] = useState(1.8);
  const [isAlert, setIsAlert] = useState(false);

  // Simulating IoT sensor warning on dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature(prev => {
        const change = (Math.random() - 0.5) * 0.4;
        const newTemp = Math.max(0.5, Math.min(5.5, Number((prev + change).toFixed(1))));
        setIsAlert(newTemp >= 4.0);
        return newTemp;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalStockKg = products.length * 120; // Simulated total kg
  const activeOrdersCount = orders.filter(o => o.status !== 'Selesai').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Orange Alert Banner at the top if cold storage temperature is abnormal */}
      {isAlert && (
        <View style={styles.orangeAlertBanner}>
          <AlertTriangle size={18} color="#7C2D12" />
          <Text style={styles.orangeAlertText}>
            SUHU COLD STORAGE KOPERASI KRITIS: {temperature}°C! Segera periksa mesin pembeku.
          </Text>
        </View>
      )}

      {/* Header bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Selamat Pagi, Pak Budi</Text>
          <View style={styles.dateRow}>
            <Calendar size={12} color={COLORS.textSecondary} />
            <Text style={styles.dateText}>12 Juni 2026</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.bellBtn}
          onPress={() => alert('Detail Log Telemetry IoT')}
        >
          <Bell size={20} color={COLORS.textPrimary} />
          {isAlert && <View style={styles.redDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 4 KPI Cards Grid */}
        <View style={styles.kpiGrid}>
          {/* Card 1: Total Stok */}
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#EEF2FF' }]}>
              <Box size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.kpiLabel}>Total Stok</Text>
            <Text style={styles.kpiValue}>{totalStockKg} kg</Text>
            <View style={styles.trendRow}>
              <TrendingUp size={12} color={COLORS.success} />
              <Text style={styles.trendTextSuccess}>+8% tangkapan</Text>
            </View>
          </View>

          {/* Card 2: Pesanan Aktif */}
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#F0FDF4' }]}>
              <ShoppingBag size={18} color={COLORS.success} />
            </View>
            <Text style={styles.kpiLabel}>Pesanan Aktif</Text>
            <Text style={styles.kpiValue}>{activeOrdersCount}</Text>
            <View style={styles.trendRow}>
              <Text style={styles.trendTextStable}>Stabil minggu ini</Text>
            </View>
          </View>

          {/* Card 3: Pendapatan */}
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#FEF3C7' }]}>
              <DollarSign size={18} color="#D97706" />
            </View>
            <Text style={styles.kpiLabel}>Pendapatan</Text>
            <Text style={styles.kpiValue}>Rp 12.4M</Text>
            <View style={styles.trendRow}>
              <TrendingUp size={12} color={COLORS.success} />
              <Text style={styles.trendTextSuccess}>+15% omzet</Text>
            </View>
          </View>

          {/* Card 4: Anggota Aktif */}
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#FDF2F8' }]}>
              <Users size={18} color="#DB2777" />
            </View>
            <Text style={styles.kpiLabel}>Anggota Nelayan</Text>
            <Text style={styles.kpiValue}>48 orang</Text>
            <View style={styles.trendRow}>
              <Text style={styles.trendTextStable}>KNMP Pilot Area</Text>
            </View>
          </View>
        </View>

        {/* 7-Day Catch Trend Chart (Pilar 1A KNMP Aggregated Data representation) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tren Tangkapan 7 Hari (kg)</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartYAxis}>
              <Text style={styles.yAxisText}>200</Text>
              <Text style={styles.yAxisText}>100</Text>
              <Text style={styles.yAxisText}>0</Text>
            </View>
            <View style={styles.chartLineArea}>
              {/* Horizontal grid lines */}
              <View style={styles.gridLine} />
              <View style={[styles.gridLine, { top: '50%' }]} />
              <View style={[styles.gridLine, { bottom: 0 }]} />
              
              {/* Simulated lines using visual shapes */}
              <View style={styles.sparklineContainer}>
                <View style={[styles.bar, { height: '65%' }]}><Text style={styles.barVal}>130</Text></View>
                <View style={[styles.bar, { height: '80%' }]}><Text style={styles.barVal}>160</Text></View>
                <View style={[styles.bar, { height: '40%' }]}><Text style={styles.barVal}>80</Text></View>
                <View style={[styles.bar, { height: '55%' }]}><Text style={styles.barVal}>110</Text></View>
                <View style={[styles.bar, { height: '90%' }]}><Text style={styles.barVal}>180</Text></View>
                <View style={[styles.bar, { height: '70%' }]}><Text style={styles.barVal}>140</Text></View>
                <View style={[styles.bar, { height: '85%', backgroundColor: COLORS.primary }]}><Text style={styles.barVal}>170</Text></View>
              </View>
            </View>
          </View>
          <View style={styles.chartXAxis}>
            <Text style={styles.xAxisText}>Sen</Text>
            <Text style={styles.xAxisText}>Sel</Text>
            <Text style={styles.xAxisText}>Rab</Text>
            <Text style={styles.xAxisText}>Kam</Text>
            <Text style={styles.xAxisText}>Jum</Text>
            <Text style={styles.xAxisText}>Sab</Text>
            <Text style={[styles.xAxisText, { fontWeight: 'bold', color: COLORS.primary }]}>Hari Ini</Text>
          </View>
        </View>

        {/* Laporan KNMP Export (Agregasi KKP) */}
        <View style={styles.knmpExportCard}>
          <View style={styles.exportMeta}>
            <Award size={22} color={COLORS.primary} />
            <View style={styles.exportTextContainer}>
              <Text style={styles.exportTitle}>Optimalisasi Laporan KNMP</Text>
              <Text style={styles.exportSub}>Format standard ekspor Satu Data KKP RI</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.exportBtn}
            onPress={() => alert('Data Agregat Nelayan KNMP berhasil diekspor ke CSV!')}
            activeOpacity={0.8}
          >
            <Download size={16} color={COLORS.white} style={{ marginRight: 6 }} />
            <Text style={styles.exportBtnText}>Ekspor</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Orders Overview */}
        <View style={styles.ordersSection}>
          <Text style={styles.sectionTitle}>Pesanan Terbaru Koperasi</Text>
          {orders.slice(0, 3).map((ord) => (
            <View style={styles.adminOrderRow} key={ord.id}>
              <View style={styles.orderLeftMeta}>
                <Text style={styles.orderLabel}>{ord.name} ({ord.qty} kg)</Text>
                <Text style={styles.orderKoperasiName}>{ord.koperasi}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: ord.status === 'Selesai' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(26, 86, 255, 0.1)' }
              ]}>
                <Text style={{ 
                  fontSize: 11, 
                  fontWeight: 'bold', 
                  color: ord.status === 'Selesai' ? COLORS.success : COLORS.primary 
                }}>
                  {ord.status}
                </Text>
              </View>
            </View>
          ))}
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
  orangeAlertBanner: {
    backgroundColor: '#FFEDD5', // soft orange
    borderBottomWidth: 1.5,
    borderBottomColor: '#FDBA74',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  orangeAlertText: {
    fontSize: 11,
    color: '#7C2D12',
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  kpiCard: {
    width: '45%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    margin: '2.5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  kpiIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  kpiLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginVertical: 4,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendTextSuccess: {
    fontSize: 10,
    color: COLORS.success,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  trendTextStable: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  sectionCard: {
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 120,
  },
  chartYAxis: {
    width: 24,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  yAxisText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  chartLineArea: {
    flex: 1,
    marginLeft: 8,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  sparklineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: 8,
    zIndex: 2,
  },
  bar: {
    width: 14,
    backgroundColor: '#93C5FD', // soft blue bar
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barVal: {
    fontSize: 7,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 32,
    paddingRight: 10,
    marginTop: 8,
  },
  xAxisText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  knmpExportCard: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(0, 34, 131, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 34, 131, 0.15)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  exportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  exportTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  exportTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  exportSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  exportBtn: {
    backgroundColor: COLORS.primary,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  ordersSection: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  adminOrderRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderLeftMeta: {
    flex: 1.2,
  },
  orderLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  orderKoperasiName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
