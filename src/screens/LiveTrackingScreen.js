import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated 
} from 'react-native';
import { ArrowLeft, Phone, Navigation, CheckCircle2, Circle } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import Button from '../components/Button';

export default function LiveTrackingScreen({ route, navigation }) {
  const { orderItems = [] } = route.params || {};

  // Pick first item or default kakap
  const mainItem = orderItems.length > 0 ? orderItems[0] : {
    name: 'Kakap Merah Segar',
    qty: 5,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=200&q=80',
  };

  // Courier motion animation values
  const moveAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Loop the courier movement along route
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: false,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        })
      ])
    ).start();
  }, []);

  // Map courier position along coordinate values
  const courierLeft = moveAnim.interpolate({
    inputRange: [0, 0.4, 0.7, 1],
    outputRange: ['20%', '45%', '70%', '82%']
  });
  
  const courierTop = moveAnim.interpolate({
    inputRange: [0, 0.4, 0.7, 1],
    outputRange: ['65%', '42%', '52%', '30%']
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.navigate('MainTabs')}
          activeOpacity={0.7}
        >
          <ArrowLeft color={COLORS.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Tracking Pengiriman</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Top Half: OSM Minimalist Map Mock with Animation */}
      <View style={styles.mapContainer}>
        {/* Styled Grid Roads representing the OpenStreetMap style */}
        <View style={styles.mapBackground}>
          {/* Custom vector road paths */}
          <View style={[styles.road, styles.roadHorizontal, { top: '35%' }]} />
          <View style={[styles.road, styles.roadHorizontal, { top: '55%' }]} />
          <View style={[styles.road, styles.roadVertical, { left: '30%' }]} />
          <View style={[styles.road, styles.roadVertical, { left: '75%' }]} />
          
          {/* Route path highlight (from start to end) */}
          <View style={styles.routeHighlightLine} />
          
          {/* Origin/Start Pin (TPI Karangsong) */}
          <View style={[styles.pinContainer, { left: '16%', top: '65%' }]}>
            <View style={styles.originPulse} />
            <View style={styles.originDot} />
            <Text style={styles.pinLabel}>TPI</Text>
          </View>

          {/* Destination Pin (Pembeli) */}
          <View style={[styles.pinContainer, { left: '80%', top: '25%' }]}>
            <View style={styles.destinationPulse} />
            <Navigation size={22} color={COLORS.primary} fill={COLORS.primary} style={styles.destinationIcon} />
            <Text style={[styles.pinLabel, { color: COLORS.primary }]}>Lokasi Anda</Text>
          </View>

          {/* Animated Courier Marker */}
          <Animated.View style={[styles.courierMarker, { left: courierLeft, top: courierTop }]}>
            <View style={styles.courierContainer}>
              <View style={styles.courierGlow} />
              <Image 
                source={require('../assets/kakap.jpg')} 
                style={styles.courierFishIcon} 
              />
            </View>
          </Animated.View>
        </View>

        <View style={styles.mapOverlayInfo}>
          <Text style={styles.mapProviderText}>© OpenStreetMap contributors, OSRM Route</Text>
        </View>
      </View>

      {/* Bottom Half: Delivery Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Pengiriman Aktif</Text>
          <Text style={styles.etaText}>Estimasi tiba: <Text style={{ fontWeight: '900', color: COLORS.primary }}>45 menit</Text></Text>
        </View>

        {/* Order Brief Summary */}
        <View style={styles.orderSummary}>
          <Image source={typeof mainItem.image === 'string' && (mainItem.image.startsWith('http') || mainItem.image.startsWith('https')) ? { uri: mainItem.image } : mainItem.image} style={styles.orderThumb} />
          <View style={styles.orderMeta}>
            <Text style={styles.orderName}>{mainItem.name} {mainItem.qty} {mainItem.unit}</Text>
            <Text style={styles.orderNumber}>No. Pesanan: #FC-9912A</Text>
          </View>
        </View>

        {/* 3-Step Horizontal Delivery Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <CheckCircle2 size={20} color={COLORS.success} fill="#DCFCE7" />
            <Text style={[styles.progressLabel, { color: COLORS.textPrimary, fontWeight: 'bold' }]}>Dikonfirmasi</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <Circle size={20} color={COLORS.primary} fill={COLORS.primary} />
            <Text style={[styles.progressLabel, { color: COLORS.primary, fontWeight: 'bold' }]}>Dalam Perjalanan</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <Circle size={20} color="#D1D5DB" />
            <Text style={styles.progressLabel}>Diterima</Text>
          </View>
        </View>

        {/* Courier Details */}
        <View style={styles.courierRow}>
          <View style={styles.courierProfile}>
            <View style={styles.courierAvatar}>
              <Text style={styles.courierAvatarText}>K</Text>
            </View>
            <View style={styles.courierMeta}>
              <Text style={styles.courierName}>Kurir Handoko</Text>
              <Text style={styles.courierVehicle}>Honda Vario • E 1234 XY</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.callIconBtn}
            onPress={() => alert('Menelepon Kurir Handoko (+62 812-3456-7890)')}
            activeOpacity={0.7}
          >
            <Phone size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* CTA Contact Button */}
        <Button 
          title="Hubungi Kurir" 
          variant="primary" 
          onPress={() => alert('Membuka WhatsApp Chat Kurir')}
          style={styles.contactBtn}
        />
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
  mapContainer: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F1F5F9', // light gray minimal map
  },
  road: {
    backgroundColor: '#E2E8F0',
    position: 'absolute',
  },
  roadHorizontal: {
    left: 0,
    right: 0,
    height: 30,
  },
  roadVertical: {
    top: 0,
    bottom: 0,
    width: 30,
  },
  routeHighlightLine: {
    position: 'absolute',
    left: '20%',
    top: '40%',
    width: '63%',
    height: 18,
    backgroundColor: 'rgba(26, 86, 255, 0.25)', // light blue path glow
    borderRadius: 9,
    transform: [{ rotate: '-25deg' }],
  },
  pinContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    marginLeft: -40,
    marginTop: -25,
  },
  originPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(22, 197, 94, 0.4)',
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  destinationPulse: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(26, 86, 255, 0.2)',
  },
  destinationIcon: {
    transform: [{ rotate: '45deg' }],
  },
  pinLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.success,
    marginTop: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  courierMarker: {
    position: 'absolute',
    width: 44,
    height: 44,
    marginLeft: -22,
    marginTop: -22,
    zIndex: 10,
  },
  courierContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courierGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(173, 255, 47, 0.5)',
  },
  courierFishIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  mapOverlayInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  mapProviderText: {
    fontSize: 8,
    color: COLORS.textSecondary,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  etaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  orderSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  orderThumb: {
    width: 46,
    height: 46,
    borderRadius: 8,
  },
  orderMeta: {
    marginLeft: 12,
  },
  orderName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  orderNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  progressLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
    marginTop: -16,
  },
  courierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  courierProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courierAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courierAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  courierMeta: {
    marginLeft: 12,
  },
  courierName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  courierVehicle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  callIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 34, 131, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactBtn: {
    marginVertical: 0,
    height: 48,
    borderRadius: 24,
  },
});
