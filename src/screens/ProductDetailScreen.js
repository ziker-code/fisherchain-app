import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { ArrowLeft, Heart, ShieldCheck, Star, MinusCircle, PlusCircle, ShoppingCart } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // Format price to Rupiah
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    alert(`Berhasil menambahkan ${qty} kg ${product.name} ke keranjang!`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Product Image Section */}
        <View style={styles.imageContainer}>
          <Image source={typeof product.image === 'string' && (product.image.startsWith('http') || product.image.startsWith('https')) ? { uri: product.image } : product.image} style={styles.image} />
          
          {/* Custom Header Overlays */}
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <ArrowLeft color={COLORS.textPrimary} size={22} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.heartBtn}
            onPress={() => setIsLiked(!isLiked)}
            activeOpacity={0.8}
          >
            <Heart 
              color={isLiked ? COLORS.danger : COLORS.textPrimary} 
              fill={isLiked ? COLORS.danger : 'transparent'} 
              size={22} 
            />
          </TouchableOpacity>
        </View>

        {/* Content Details (Slide Up style layout) */}
        <View style={styles.contentCard}>
          {/* Seller / Koperasi Row */}
          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>
                {product.koperasi.charAt(9)}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName}>{product.koperasi}</Text>
                {product.verified && (
                  <ShieldCheck size={16} color={COLORS.primary} fill="rgba(0, 34, 131, 0.15)" style={styles.verifiedIcon} />
                )}
              </View>
              <Text style={styles.sellerLocation}>{product.location}</Text>
            </View>
          </View>

          {/* Product Title */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Ratings Row */}
          <View style={styles.ratingRow}>
            <Star size={16} color="#FBBF24" fill="#FBBF24" />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewsText}>({product.reviews} ulasan terverifikasi)</Text>
          </View>

          {/* Pricing Row */}
          <View style={styles.priceRow}>
            <Text style={styles.originalPrice}>{formatRupiah(product.originalPrice)}</Text>
            <Text style={styles.currentPrice}>{formatRupiah(product.price)}</Text>
            <Text style={styles.unitText}>/ {product.unit}</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Deskripsi Produk</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Traceability Action Button */}
          <View style={styles.traceabilitySection}>
            <Button
              title="Lacak Asal Ikan (Traceability)"
              variant="outline"
              onPress={() => navigation.navigate('Traceability', { product })}
              style={styles.traceButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Purchase Actions */}
      <View style={styles.bottomBar}>
        {/* Quantity Selector */}
        <View style={styles.qtyContainer}>
          <TouchableOpacity 
            onPress={() => qty > 1 && setQty(qty - 1)}
            disabled={qty <= 1}
            activeOpacity={0.7}
          >
            <MinusCircle size={32} color={qty > 1 ? COLORS.primary : COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{qty}</Text>
          <TouchableOpacity 
            onPress={() => setQty(qty + 1)}
            activeOpacity={0.7}
          >
            <PlusCircle size={32} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.qtyLabel}>kg</Text>
        </View>

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={handleAddToCart}
            activeOpacity={0.9}
          >
            <ShoppingCart size={20} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={styles.cartButtonText}>Tambah ke Keranjang</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 320,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  heartBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  contentCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    minHeight: 400,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerAvatarText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  sellerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  sellerLocation: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  productName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  originalPrice: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: 10,
    fontWeight: '500',
  },
  currentPrice: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
  },
  unitText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  traceabilitySection: {
    marginVertical: 12,
  },
  traceButton: {
    height: 48,
    borderRadius: 24,
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
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 12,
    color: COLORS.textPrimary,
  },
  qtyLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: '600',
  },
  ctaContainer: {
    width: '56%',
  },
  cartButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cartButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
