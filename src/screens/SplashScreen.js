import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/theme';
import Button from '../components/Button';

export default function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Brand Badge */}
      <View style={styles.topBadgeContainer}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandBadgeText}>Fisherchain.id</Text>
        </View>
      </View>

      {/* Hero Headline Section */}
      <View style={styles.heroSection}>
        <Text style={styles.headline}>
          IKAN SEGAR{'\n'}LANGSUNG DARI{'\n'}NELAYAN
        </Text>
        <Text style={styles.subtext}>
          Tahu persis asal ikan Anda sebelum membelinya dengan tracking terpercaya.
        </Text>
      </View>

      {/* Visual Product Cards (Stacked/Rotated layout like reference Mallku) */}
      <View style={styles.visualContainer}>
        <View style={[styles.imageCard, styles.cardLeft]}>
          <Image 
            source={require('../assets/tuna.jpg')} 
            style={styles.cardImage} 
          />
        </View>
        <View style={[styles.imageCard, styles.cardRight]}>
          <Image 
            source={require('../assets/udang.jpg')} 
            style={styles.cardImage} 
          />
        </View>
        <View style={[styles.imageCard, styles.cardCenter]}>
          <Image 
            source={require('../assets/kakap.jpg')} 
            style={styles.cardImage} 
          />
          <View style={styles.imageOverlayBadge}>
            <Text style={styles.overlayBadgeText}>100% Traceable</Text>
          </View>
        </View>
      </View>

      {/* Neon CTA Button */}
      <View style={styles.buttonContainer}>
        <Button 
          title="Mulai Sekarang" 
          variant="accent" 
          onPress={() => navigation.replace('Login')} 
          style={styles.ctaButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.heroBg,
    justifyContent: 'space-between',
  },
  topBadgeContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  brandBadge: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  brandBadgeText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  headline: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 40,
    letterSpacing: -0.5,
    fontFamily: 'System',
  },
  subtext: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 12,
    lineHeight: 22,
  },
  visualContainer: {
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    marginVertical: 20,
  },
  imageCard: {
    width: 160,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.white,
    position: 'absolute',
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardLeft: {
    transform: [{ rotate: '-12deg' }, { translateX: -60 }],
    zIndex: 1,
    opacity: 0.8,
  },
  cardRight: {
    transform: [{ rotate: '12deg' }, { translateX: 60 }],
    zIndex: 1,
    opacity: 0.8,
  },
  cardCenter: {
    transform: [{ scale: 1.05 }],
    zIndex: 2,
  },
  imageOverlayBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  overlayBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  ctaButton: {
    width: '100%',
  },
});
