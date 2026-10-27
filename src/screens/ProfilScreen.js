import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { User, MessageSquareCode, ShieldCheck, MapPin, ChevronRight, LogOut, Settings } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function ProfilScreen({ navigation }) {
  const { activeRole } = useApp();
  const isAdmin = activeRole === 'admin';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isAdmin ? 'Profil Koperasi (Admin)' : 'Profil Pembeli'}
        </Text>
      </View>

      <View style={styles.content}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={36} color={COLORS.primary} />
          </View>
          <View style={styles.profileMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>
                {isAdmin ? 'Pak Budi (Admin Koperasi)' : 'Restoran Seafood Budi'}
              </Text>
              <ShieldCheck size={18} color={COLORS.primary} fill="rgba(0, 34, 131, 0.15)" style={styles.verifiedIcon} />
            </View>
            <View style={styles.locationRow}>
              <MapPin size={14} color={COLORS.textSecondary} />
              <Text style={styles.profileLocation}>
                {isAdmin ? 'Karangsong, Indramayu' : 'Muara Angke, Jakarta'}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem} onPress={() => alert('Detail Akun')}>
            <Text style={styles.menuText}>
              {isAdmin ? 'Data Nelayan Binaan' : 'Alamat Pengiriman Restoran'}
            </Text>
            <ChevronRight size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          {isAdmin && (
            <TouchableOpacity style={styles.menuItem} onPress={() => alert('Manajemen IoT')}>
              <Text style={styles.menuText}>Kalibrasi Sensor IoT Cold Storage</Text>
              <ChevronRight size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutItem]} 
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <LogOut size={16} color={COLORS.danger} style={{ marginRight: 8 }} />
              <Text style={[styles.menuText, { color: COLORS.danger }]}>Ganti Peran Pengguna (Logout)</Text>
            </View>
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
  header: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  content: {
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 34, 131, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileMeta: {
    marginLeft: 16,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  profileLocation: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  waDemoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9', // Soft green background
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  waDemoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.success, // Solid green icon background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  waDemoTextContainer: {
    justifyContent: 'center',
  },
  waDemoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  waDemoSub: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  menuGroup: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  logoutItem: {
    borderBottomWidth: 0,
    backgroundColor: '#FFF5F5',
  },
});
