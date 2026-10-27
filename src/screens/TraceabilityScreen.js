import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { 
  ArrowLeft, 
  QrCode, 
  Anchor, 
  Home, 
  Snowflake, 
  Truck, 
  CheckCircle,
  Share2,
  Download
} from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import StatusSteps from '../components/StatusSteps';

export default function TraceabilityScreen({ route, navigation }) {
  const { product } = route.params;

  // Define steps with icons mapping
  const steps = [
    {
      title: 'Ditangkap Nelayan',
      description: `${product.nelayan}, Lokasi Laut Jawa - ${product.tanggalTangkap}`,
      icon: (color) => <Anchor size={18} color={color} />,
    },
    {
      title: 'Mendarat di TPI',
      description: `${product.tpi}, Suhu Pendaratan: ${product.tempC} (Aman)`,
      icon: (color) => <Home size={18} color={color} />,
    },
    {
      title: 'Cold Storage Koperasi',
      description: `Disimpan ${product.storageTime}, Suhu Rata-rata: ${product.avgTemp} (Di bawah batas aman 4°C)`,
      icon: (color) => <Snowflake size={18} color={color} />,
    },
    {
      title: 'Dalam Pengiriman',
      description: 'Kurir Koperasi membawa produk ke titik distribusi Pembeli',
      icon: (color) => <Truck size={18} color={color} />,
    },
    {
      title: 'Diterima Pembeli',
      description: 'Menunggu penerimaan di lokasi Anda',
      icon: (color) => <CheckCircle size={18} color={color} />,
    }
  ];

  // We are at step 3 (index 2: Cold Storage Koperasi is active/done, Truck is next)
  const currentStepIndex = 2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft color={COLORS.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lacak Asal Ikan</Text>
        <TouchableOpacity 
          style={styles.qrBtn}
          onPress={() => alert('Detail QR Traceability')}
          activeOpacity={0.7}
        >
          <QrCode color={COLORS.accent} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardProductLabel}>Batch Ikan Terdaftar</Text>
              <Text style={styles.cardProductName}>{product.name.toUpperCase()}</Text>
            </View>
            <View style={styles.qrBadge}>
              <QrCode color={COLORS.primary} size={36} />
            </View>
          </View>

          {/* Product Origin Meta */}
          <View style={styles.metaGrid}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>ASAL KOPERASI</Text>
              <Text style={styles.metaVal} numberOfLines={1}>{product.koperasi}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>ID BATCH</Text>
              <Text style={styles.metaVal}>#FC-99218-IDX</Text>
            </View>
          </View>

          {/* Vertical Timeline */}
          <View style={styles.timelineSection}>
            <Text style={styles.sectionTitle}>Rantai Mutu & Perjalanan (Traceability)</Text>
            <StatusSteps steps={steps} currentStepIndex={currentStepIndex} layout="vertical" />
          </View>

          {/* Cold Chain Sensor Chart Monitor */}
          <View style={styles.chartSection}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Monitoring Suhu Cold Storage (24 Jam)</Text>
              <View style={styles.tempBadge}>
                <Text style={styles.tempBadgeText}>Avg {product.avgTemp}</Text>
              </View>
            </View>
            <Text style={styles.chartSub}>Batas Kritis Mutu Ikan Segar: &lt; 4°C</Text>
            
            {/* Visual Custom Chart Representation */}
            <View style={styles.chartVisual}>
              <View style={styles.thresholdLine} />
              <Text style={styles.thresholdLabel}>Batas Aman (4°C)</Text>
              
              {/* Plot points and line */}
              <View style={styles.graphContainer}>
                <View style={[styles.graphLine, { width: '100%' }]} />
                {/* 5 data points visual */}
                <View style={styles.pointsRow}>
                  <View style={[styles.point, { bottom: 12 }]}><Text style={styles.pointText}>2.1°</Text></View>
                  <View style={[styles.point, { bottom: 15 }]}><Text style={styles.pointText}>1.8°</Text></View>
                  <View style={[styles.point, { bottom: 20 }]}><Text style={styles.pointText}>1.5°</Text></View>
                  <View style={[styles.point, { bottom: 18 }]}><Text style={styles.pointText}>1.8°</Text></View>
                  <View style={[styles.point, { bottom: 14 }]}><Text style={styles.pointText}>2.0°</Text></View>
                </View>
              </View>
              
              {/* Chart X axis */}
              <View style={styles.chartXAxis}>
                <Text style={styles.axisText}>08:00</Text>
                <Text style={styles.axisText}>12:00</Text>
                <Text style={styles.axisText}>16:00</Text>
                <Text style={styles.axisText}>20:00</Text>
                <Text style={styles.axisText}>Now</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => alert('Traceability Card dibagikan')}
            activeOpacity={0.8}
          >
            <Share2 size={18} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={styles.actionBtnText}>Bagikan Laporan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionBtn, styles.downloadBtn]}
            onPress={() => alert('Sertifikat Traceability diunduh ke Galeri')}
            activeOpacity={0.8}
          >
            <Download size={18} color={COLORS.textPrimary} style={{ marginRight: 8 }} />
            <Text style={[styles.actionBtnText, { color: COLORS.textPrimary }]}>Unduh PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  cardContainer: {
    margin: 16,
    backgroundColor: '#0F172A', // Dark mode visual for premium traceability card
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(173, 255, 47, 0.25)', // accent outline glow
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 16,
    marginBottom: 16,
  },
  cardProductLabel: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardProductName: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.white,
    marginTop: 2,
  },
  qrBadge: {
    backgroundColor: COLORS.white,
    padding: 6,
    borderRadius: 12,
  },
  metaGrid: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  metaCol: {
    flex: 1,
    paddingRight: 6,
  },
  metaLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  metaVal: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: 'bold',
    marginTop: 2,
  },
  timelineSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    paddingLeft: 8,
  },
  chartSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  tempBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tempBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  chartSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 16,
  },
  chartVisual: {
    height: 120,
    position: 'relative',
    marginTop: 8,
  },
  thresholdLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    height: 1.5,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderWidth: 1,
    borderColor: COLORS.danger,
    opacity: 0.8,
  },
  thresholdLabel: {
    position: 'absolute',
    right: 0,
    top: 32,
    fontSize: 9,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  graphContainer: {
    height: 80,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  graphLine: {
    position: 'absolute',
    bottom: 25,
    height: 2,
    backgroundColor: COLORS.accent,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: 10,
  },
  point: {
    alignItems: 'center',
  },
  pointText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 8,
  },
  axisText: {
    color: '#94A3B8',
    fontSize: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionBtn: {
    flex: 1.1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  downloadBtn: {
    flex: 0.9,
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
    marginLeft: 8,
    marginRight: 0,
  },
});
