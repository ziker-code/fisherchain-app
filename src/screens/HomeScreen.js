import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView 
} from 'react-native';
import { Search, Bell, ShoppingCart, User, QrCode } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { PRODUCTS, CATEGORIES } from '../constants/mockData';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  const { products, cartCount, cartItems } = useApp();

  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.koperasi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={18} color={COLORS.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Halo, Selamat Pagi</Text>
            <Text style={styles.userName}>Pak Budi</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.iconBtn}
            onPress={() => navigation.navigate('WANelayan')}
          >
            <QrCode size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconBtn, { marginLeft: 10 }]}
            onPress={() => alert('Fitur Notifikasi')}
          >
            <Bell size={20} color={COLORS.textPrimary} />
            <View style={styles.alertDot} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconBtn, { marginLeft: 10 }]}
            onPress={() => navigation.navigate('Checkout')}
          >
            <ShoppingCart size={20} color={COLORS.textPrimary} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              placeholder="Cari ikan segar atau koperasi..."
              placeholderTextColor={COLORS.textSecondary}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Hero Promo Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>STOK KAKAP{'\n'}MELIMPAH HARI INI</Text>
            <TouchableOpacity 
              style={styles.bannerBtn}
              onPress={() => {
                setSelectedCategory('Kakap');
                setSearchQuery('');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.bannerBtnText}>Lihat Sekarang</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={require('../assets/kakap.jpg')} 
            style={styles.bannerImage} 
          />
        </View>

        {/* Categories Tabs */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((cat, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryTab,
                  selectedCategory === cat && styles.categoryTabActive
                ]}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Paling Dicari</Text>
          <Text style={styles.sectionLink}>Lihat Semua</Text>
        </View>

        {/* Grid List Products */}
        {filteredProducts.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredProducts.map((item) => (
              <View style={styles.gridCol} key={item.id}>
                <ProductCard
                  product={item}
                  onPress={() => navigation.navigate('ProductDetail', { product: item })}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Ikan tidak ditemukan.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 10,
  },
  greeting: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  alertDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.primary,
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  heroBanner: {
    marginHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    height: 140,
    position: 'relative',
  },
  bannerLeft: {
    flex: 1,
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 24,
    marginBottom: 12,
  },
  bannerBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  bannerImage: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    bottom: -15,
    opacity: 0.9,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginVertical: 18,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  sectionLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  gridCol: {
    width: '50%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
