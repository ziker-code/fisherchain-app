import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Fish, ClipboardList, User, Camera, TrendingUp, DollarSign } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import TraceabilityScreen from '../screens/TraceabilityScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import StokScreen from '../screens/StokScreen';
import PesananScreen from '../screens/PesananScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import WASimulatorScreen from '../screens/WASimulatorScreen';
import ProfilScreen from '../screens/ProfilScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminPriceScreen from '../screens/AdminPriceScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Beranda: Home,
  Stok: Fish,
  Pesanan: ClipboardList,
  Profil: User,
  Overview: TrendingUp,
  'IoT Monitor': Fish,
  'Update Harga': DollarSign,
  'Profil Admin': User,
};

const baseTabOptions = ({ route }) => ({
  tabBarIcon: ({ focused }) => {
    const Icon = TAB_ICONS[route.name];
    return Icon ? <Icon size={22} color={focused ? COLORS.primary : COLORS.textSecondary} /> : null;
  },
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: COLORS.textSecondary,
  tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
  headerShown: false,
});

// Placeholder for the center scanner tab (the button navigates to the QRScanner stack screen)
function DummyScannerScreen() {
  return null;
}

// Floating circular scanner button in the middle of the buyer tab bar
function ScannerTabButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.scanContainer}
      onPress={() => navigation.navigate('QRScanner')}
      activeOpacity={0.8}
      accessibilityLabel="Scan QR"
    >
      <View style={styles.scanOuter}>
        <View style={styles.scanInner}>
          <Camera size={26} color={COLORS.white} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Buyer / offtaker mode
function BuyerTabs() {
  return (
    <Tab.Navigator
      screenOptions={(props) => ({
        ...baseTabOptions(props),
        tabBarStyle: { ...styles.tabBar, height: 72, paddingBottom: 12 },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Stok" component={StokScreen} />
      <Tab.Screen
        name="Scanner"
        component={DummyScannerScreen}
        options={{
          tabBarLabel: () => null,
          tabBarButton: () => <ScannerTabButton />,
        }}
      />
      <Tab.Screen name="Pesanan" component={PesananScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

// Cooperative admin mode
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={(props) => ({
        ...baseTabOptions(props),
        tabBarStyle: { ...styles.tabBar, height: 64, paddingBottom: 10 },
      })}
    >
      <Tab.Screen name="Overview" component={AdminDashboardScreen} />
      <Tab.Screen name="IoT Monitor" component={StokScreen} />
      <Tab.Screen name="Update Harga" component={AdminPriceScreen} />
      <Tab.Screen name="Profil Admin" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer documentTitle={{ formatter: () => 'Fisherchain.id' }}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={BuyerTabs} />
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Traceability" component={TraceabilityScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        <Stack.Screen name="WANelayan" component={WASimulatorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 8,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  scanContainer: {
    top: -24,
    justifyContent: 'center',
    alignItems: 'center',
    width: 74,
  },
  scanOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 34, 131, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
