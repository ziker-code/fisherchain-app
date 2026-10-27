import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ShoppingCart, Bell } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

export default function Header({ 
  title, 
  showBack = false, 
  showCart = false, 
  showNotification = false, 
  cartCount = 0,
  onCartPress,
  onNotificationPress 
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <ArrowLeft color={COLORS.textPrimary} size={24} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandContainer}>
            <View style={styles.brandDot} />
            <Text style={styles.brandText}>Fisherchain.id</Text>
          </View>
        )}
      </View>

      {title && !showBack && (
        <View style={styles.centerSection}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      )}

      <View style={styles.rightSection}>
        {showNotification && (
          <TouchableOpacity 
            onPress={onNotificationPress} 
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Bell color={COLORS.textPrimary} size={22} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        )}

        {showCart && (
          <TouchableOpacity 
            onPress={onCartPress} 
            style={[styles.iconButton, { marginLeft: 12 }]}
            activeOpacity={0.7}
          >
            <ShoppingCart color={COLORS.textPrimary} size={22} />
            {cartCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 80,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    position: 'relative',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    fontFamily: 'System',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  badgeContainer: {
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
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    borderRadius: 4,
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
  }
});
