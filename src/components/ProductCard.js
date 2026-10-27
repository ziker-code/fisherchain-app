import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, ShieldCheck } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

export default function ProductCard({ product, onPress }) {
  // Format price to Rupiah
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={typeof product.image === 'string' && (product.image.startsWith('http') || product.image.startsWith('https')) ? { uri: product.image } : product.image} style={styles.image} />
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Segar</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.koperasiRow}>
          <Text style={styles.koperasiText} numberOfLines={1}>
            {product.koperasi}
          </Text>
          {product.verified && (
            <ShieldCheck size={14} color={COLORS.primary} fill="rgba(0, 34, 131, 0.15)" style={styles.verifyIcon} />
          )}
        </View>

        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>

        <View style={styles.ratingRow}>
          <Star size={14} color="#FBBF24" fill="#FBBF24" />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewsText}>({product.reviews})</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{formatRupiah(product.price)}</Text>
          <Text style={styles.unitText}>/{product.unit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 6,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Android elevation
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  content: {
    padding: 12,
  },
  koperasiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  koperasiText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  verifyIcon: {
    marginLeft: 3,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primary,
  },
  unitText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginLeft: 2,
  },
});
