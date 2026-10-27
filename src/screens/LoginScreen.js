import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { User, Lock, ArrowRight, ShieldCheck, MessageSquareCode, ShoppingBag } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { Image } from 'react-native';

export default function LoginScreen({ navigation }) {
  const { setActiveRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      alert('Silakan masukkan email dan password atau pilih tombol simulasi.');
      return;
    }

    if (email.includes('pembeli') || email.includes('restoran')) {
      setActiveRole('buyer');
      navigation.replace('MainTabs');
    } else if (email.includes('admin') || email.includes('koperasi')) {
      setActiveRole('admin');
      navigation.replace('AdminTabs');
    } else if (email.includes('nelayan') || email.includes('wa')) {
      navigation.replace('WANelayan');
    } else {
      setActiveRole('buyer');
      navigation.replace('MainTabs');
    }
  };

  const triggerSimulation = (role) => {
    if (role === 'buyer') {
      setActiveRole('buyer');
      setEmail('restoran.budi@gmail.com');
      setPassword('pembeli123');
      setTimeout(() => {
        navigation.replace('MainTabs');
      }, 600);
    } else if (role === 'admin') {
      setActiveRole('admin');
      setEmail('admin.karangsong@koperasi.id');
      setPassword('admin123');
      setTimeout(() => {
        navigation.replace('AdminTabs');
      }, 600);
    } else if (role === 'nelayan') {
      setEmail('nelayan.ahmad@wa.bot');
      setPassword('nelayan123');
      setTimeout(() => {
        navigation.replace('WANelayan');
      }, 600);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.headerSection}>
          <Image 
            source={require('../assets/logo.jpg')} 
            style={styles.logoImage} 
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.loginTitle}>Masuk Akun</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <User size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="Username / Email"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Lock size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <Button 
            title="Masuk" 
            onPress={handleLogin}
            style={styles.loginBtn}
          />
        </View>

        {/* Quick Access Simulation Buttons */}
        <View style={styles.simSection}>
          <Text style={styles.simTitle}>Simulasi Masuk Cepat (Pilih Peran):</Text>
          
          <TouchableOpacity 
            style={[styles.simCard, styles.simCardBuyer]} 
            onPress={() => triggerSimulation('buyer')}
            activeOpacity={0.8}
          >
            <View style={styles.simLeft}>
              <View style={styles.simIconContainer}>
                <ShoppingBag color={COLORS.primary} size={18} />
              </View>
              <View>
                <Text style={styles.simRoleName}>Pembeli / Restoran</Text>
                <Text style={styles.simDesc}>Beli ikan & lacak asal-usul (traceability)</Text>
              </View>
            </View>
            <ArrowRight size={16} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.simCard, styles.simCardAdmin]} 
            onPress={() => triggerSimulation('admin')}
            activeOpacity={0.8}
          >
            <View style={styles.simLeft}>
              <View style={[styles.simIconContainer, { backgroundColor: '#ECFDF5' }]}>
                <ShieldCheck color={COLORS.success} size={18} />
              </View>
              <View>
                <Text style={styles.simRoleName}>Admin Koperasi</Text>
                <Text style={styles.simDesc}>Memonitor stok, suhu cold storage & harga</Text>
              </View>
            </View>
            <ArrowRight size={16} color={COLORS.success} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.simCard, styles.simCardNelayan]} 
            onPress={() => triggerSimulation('nelayan')}
            activeOpacity={0.8}
          >
            <View style={styles.simLeft}>
              <View style={[styles.simIconContainer, { backgroundColor: '#FFFBEB' }]}>
                <MessageSquareCode color={COLORS.warning} size={18} />
              </View>
              <View>
                <Text style={styles.simRoleName}>Nelayan (WhatsApp Bot)</Text>
                <Text style={styles.simDesc}>Simulator tangkapan foto AI & timbangan</Text>
              </View>
            </View>
            <ArrowRight size={16} color={COLORS.warning} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 260,
    height: 140,
    resizeMode: 'contain',
  },
  formSection: {
    marginBottom: 24,
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  loginBtn: {
    marginTop: 6,
    height: 48,
    borderRadius: 24,
  },
  simSection: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 20,
  },
  simTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  simCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  simCardBuyer: {
    borderColor: 'rgba(0, 34, 131, 0.15)',
    backgroundColor: 'rgba(0, 34, 131, 0.06)',
  },
  simCardAdmin: {
    borderColor: 'rgba(34, 197, 94, 0.15)',
    backgroundColor: '#ECFDF5',
  },
  simCardNelayan: {
    borderColor: 'rgba(245, 158, 11, 0.15)',
    backgroundColor: '#FFFDF5',
  },
  simLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  simIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 34, 131, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  simRoleName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  simDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
});
