import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated 
} from 'react-native';
import { ArrowLeft, QrCode } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { PRODUCTS } from '../constants/mockData';

export default function QRScannerScreen({ navigation }) {
  const [scanStatus, setScanStatus] = useState('Mencari QR Code...');
  
  // Laser line animation values
  const laserAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Loop the laser scanner line
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        })
      ])
    ).start();

    // Simulate detection after 2.5 seconds
    const timer = setTimeout(() => {
      setScanStatus('QR Code Terdeteksi!');
      
      setTimeout(() => {
        navigation.replace('Traceability', { product: PRODUCTS[0] });
      }, 800);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const laserTop = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['5%', '95%']
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft color={COLORS.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pindai QR Traceability</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Viewfinder Area */}
      <View style={styles.viewfinderContainer}>
        <Text style={styles.instructionText}>
          Posisikan QR Code pada ikan di dalam kotak bidik
        </Text>

        <View style={styles.viewfinderBox}>
          {/* Viewfinder corners */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {/* Laser Line */}
          <Animated.View style={[styles.laserLine, { top: laserTop }]} />
          <QrCode color="rgba(255, 255, 255, 0.15)" size={120} />
        </View>

        {/* Scan Status */}
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{scanStatus}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#000',
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  viewfinderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  instructionText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  viewfinderBox: {
    width: 250,
    height: 250,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  corner: {
    width: 20,
    height: 20,
    borderColor: COLORS.accent, // Neon border highlight
    position: 'absolute',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  laserLine: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    height: 3,
    backgroundColor: COLORS.danger, // red laser line
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  statusBox: {
    marginTop: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
