import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView 
} from 'react-native';
import { Snowflake, AlertTriangle, RefreshCw, MapPin } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function StokScreen({ navigation }) {
  const { products } = useApp();
  const [temperature, setTemperature] = useState(1.8);
  const [isAlert, setIsAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simulate dynamic IoT temperature updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random fluctuations
      setTemperature(prev => {
        const change = (Math.random() - 0.5) * 0.4;
        const newTemp = Math.max(0.5, Math.min(5.5, Number((prev + change).toFixed(1))));
        
        // Trigger alert if temperature goes above 4.0°C
        if (newTemp >= 4.0) {
          setIsAlert(true);
        } else {
          setIsAlert(false);
        }
        return newTemp;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTemperature(1.5);
      setIsAlert(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stok & Cold Storage IoT</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
          <RefreshCw size={18} color={COLORS.primary} style={loading && { transform: [{ rotate: '45deg' }] }} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* IoT Temperature Monitor Widget */}
        <View style={[
          styles.iotWidget, 
          isAlert ? styles.iotWidgetAlert : styles.iotWidgetNormal
        ]}>
          <View style={styles.iotHeader}>
            <View style={styles.iotTitleRow}>
              <Snowflake size={20} color={isAlert ? COLORS.danger : COLORS.success} />
              <Text style={[styles.iotTitle, { color: isAlert ? COLORS.danger : '#0F172A' }]}>
                Sensor IoT Cold Storage #CS-01
              </Text>
            </View>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: isAlert ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)' }
            ]}>
              <Text style={{ 
                fontSize: 11, 
                fontWeight: 'bold', 
                color: isAlert ? COLORS.danger : COLORS.success 
              }}>
                {isAlert ? 'CRITICAL TEMP' : 'SUHU AMAN'}
              </Text>
            </View>
          </View>

          {/* Temperature Value display */}
          <View style={styles.tempContainer}>
            <Text style={[styles.tempVal, { color: isAlert ? COLORS.danger : COLORS.primary }]}>
              {temperature}°C
            </Text>
            <Text style={styles.tempLabel}>Suhu Saat Ini</Text>
          </View>

          {isAlert && (
            <View style={styles.alertBanner}>
              <AlertTriangle size={16} color={COLORS.danger} />
              <Text style={styles.alertText}>
                Peringatan: Suhu cold storage melebihi batas aman 4°C! Risiko penurunan mutu ikan tangkap.
              </Text>
            </View>
          )}

          <Text style={styles.iotUpdateText}>Terakhir diperbarui: Baru saja</Text>
        </View>

        {/* Cooperative Stok List */}
        <View style={styles.stokSection}>
          <Text style={styles.sectionTitle}>Ketersediaan Stok Koperasi</Text>

          {products.map((prod) => (
            <TouchableOpacity 
              key={prod.id} 
              style={styles.stokCard}
              onPress={() => navigation.navigate('ProductDetail', { product: prod })}
              activeOpacity={0.9}
            >
              <Image source={typeof prod.image === 'string' && (prod.image.startsWith('http') || prod.image.startsWith('https')) ? { uri: prod.image } : prod.image} style={styles.stokImage} />
              <View style={styles.stokDetails}>
                <Text style={styles.stokName}>{prod.name}</Text>
                
                <View style={styles.metaRow}>
                  <MapPin size={12} color={COLORS.textSecondary} />
                  <Text style={styles.stokKoperasi}>{prod.koperasi}</Text>
                </View>

                <View style={styles.indicatorRow}>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Stok Tersedia</Text>
                    <Text style={styles.metricVal}>120 kg</Text>
                  </View>
                  
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Kesegaran</Text>
                    <View style={styles.freshnessBadge}>
                      <View style={[styles.freshnessDot, { backgroundColor: COLORS.success }]} />
                      <Text style={styles.freshnessText}>Sangat Segar</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  refreshBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  iotWidget: {
    margin: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
  },
  iotWidgetNormal: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  iotWidgetAlert: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FEE2E2',
  },
  iotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iotTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tempContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  tempVal: {
    fontSize: 48,
    fontWeight: '900',
  },
  tempLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 12,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.danger,
    marginLeft: 8,
    fontWeight: '600',
    lineHeight: 16,
  },
  iotUpdateText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  stokSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  stokCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stokImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  stokDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  stokName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stokKoperasi: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  metricVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  freshnessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  freshnessDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  freshnessText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
