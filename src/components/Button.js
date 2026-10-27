import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', // 'primary' | 'accent' | 'outline' | 'danger'
  style, 
  textStyle, 
  loading = false, 
  disabled = false 
}) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'accent':
        return styles.accentButton;
      case 'outline':
        return styles.outlineButton;
      case 'danger':
        return styles.dangerButton;
      case 'primary':
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'accent':
        return styles.accentText;
      case 'outline':
        return styles.outlineText;
      case 'primary':
      case 'danger':
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.baseButton, getButtonStyle(), style, (disabled || loading) && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'accent' ? '#000' : '#fff'} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  accentButton: {
    backgroundColor: COLORS.accent,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
  },
  primaryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  accentText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.6,
  },
});
