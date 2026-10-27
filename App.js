import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Fish, ClipboardList, User, Camera, TrendingUp, DollarSign } from 'lucide-react-native';
import { COLORS } from './src/constants/theme';
import { AppProvider } from './src/context/AppContext';

// Import Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import TraceabilityScreen from './src/screens/TraceabilityScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import LiveTrackingScreen from './src/screens/LiveTrackingScreen';
import StokScreen from './src/screens/StokScreen';
import PesananScreen from './src/screens/PesananScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import WASimulatorScreen from './src/screens/WASimulatorScreen';
import ProfilScreen from './src/screens/ProfilScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import AdminPriceScreen from './src/screens/AdminPriceScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Dummy component for Center Scanner Tab
function DummyScannerScreen() {
  return null;
}

// Custom Floating Circular Tab Bar Button (72px outer / 52px inner, solid blue, Camera icon)
function CustomTabBarButton({ children, onPress }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.customButtonContainer}
      onPress={() => navigation.navigate('QRScanner')}
      activeOpacity={0.8}
    >
      <View style={styles.customButtonOuter}>
        <View style={styles.customButtonInner}>
          <Camera size={26} color={COLORS.white} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Main Tab Navigation Setup (PEMBELI / OFFTAKER MODE)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconColor = focused ? COLORS.primary : COLORS.textSecondary;
          
          switch (route.name) {
            case 'Beranda':
              return <Home size={22} color={iconColor} />;
            case 'Stok':
              return <Fish size={22} color={iconColor} />;
            case 'Pesanan':
              return <ClipboardList size={22} color={iconColor} />;
            case 'Profil':
              return <User size={22} color={iconColor} />;
            default:
              return null;
          }
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          height: 72, // height 72px as per guidelines
          paddingBottom: 12,
          paddingTop: 8,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          position: 'relative',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Stok" component={StokScreen} />
      
      {/* Center Floating Button Tab Screen */}
      <Tab.Screen 
        name="Scanner" 
        component={DummyScannerScreen} 
        options={{
          tabBarLabel: () => null, // hide label for center scanner
          tabBarButton: (props) => <CustomTabBarButton {...props} />
        }}
      />
      
      <Tab.Screen name="Pesanan" component={PesananScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

// Admin Tab Navigation Setup (ADMIN KOPERASI MODE)
function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconColor = focused ? COLORS.primary : COLORS.textSecondary;
          
          switch (route.name) {
            case 'Overview':
              return <TrendingUp size={22} color={iconColor} />;
            case 'IoT Monitor':
              return <Fish size={22} color={iconColor} />;
            case 'Update Harga':
              return <DollarSign size={22} color={iconColor} />;
            case 'Profil Admin':
              return <User size={22} color={iconColor} />;
            default:
              return null;
          }
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Overview" component={AdminDashboardScreen} />
      <Tab.Screen name="IoT Monitor" component={StokScreen} />
      <Tab.Screen name="Update Harga" component={AdminPriceScreen} />
      <Tab.Screen name="Profil Admin" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const appContent = (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Traceability" component={TraceabilityScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          <Stack.Screen name="WANelayan" component={WASimulatorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.androidFrame}>
          <View style={styles.androidCameraPunch} />
          <View style={styles.androidContent}>
            {appContent}
          </View>
        </View>
      </View>
    );
  }

  return appContent;
}

const styles = StyleSheet.create({
  // Custom Bottom Tab Button styles matching size guidelines
  customButtonContainer: {
    top: -24,
    justifyContent: 'center',
    alignItems: 'center',
    width: 74,
  },
  customButtonOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 34, 131, 0.15)', // soft blue glow matching #002283
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary, // solid blue button
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  webContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        height: '100vh',
        width: '100vw',
      },
      default: {
        height: '100%',
        width: '100%',
      }
    })
  },
  androidFrame: {
    width: 375,
    height: 812,
    borderRadius: 36,
    borderWidth: 10,
    borderColor: '#334155', // elegant dark slate bezel
    backgroundColor: '#000000', // black base like a real screen
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  androidCameraPunch: {
    position: 'absolute',
    top: 12,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // subtle punch hole overlay
    borderWidth: 1.5,
    borderColor: '#334155',
    zIndex: 999,
  },
  androidContent: {
    flex: 1,
  }
});
