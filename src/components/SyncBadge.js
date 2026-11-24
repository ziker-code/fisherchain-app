import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

const STATUS = {
  live: { label: 'Realtime', color: '#16A34A', bg: 'rgba(34, 197, 94, 0.12)' },
  connecting: { label: 'Menghubungkan', color: '#D97706', bg: 'rgba(245, 158, 11, 0.12)' },
  error: { label: 'Offline', color: '#DC2626', bg: 'rgba(239, 68, 68, 0.12)' },
  demo: { label: 'Demo · Sinkron Tab', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.12)' },
};

// Indikator kecil status sinkronisasi Supabase Realtime
export default function SyncBadge({ style }) {
  const { syncStatus } = useApp();
  const s = STATUS[syncStatus] || STATUS.demo;

  return (
    <View style={[styles.badge, { backgroundColor: s.bg }, style]}>
      <View style={[styles.dot, { backgroundColor: s.color }]} />
      <Text style={[styles.text, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
  },
});
