import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

// On wide desktop screens, show the app inside a phone mockup.
// On phones / installed PWA, render full-screen so it feels native.
const FRAME_BREAKPOINT = 600;

export default function WebFrame({ children }) {
  const { width, height } = useWindowDimensions();

  if (width < FRAME_BREAKPOINT) {
    return <View style={styles.fullscreen}>{children}</View>;
  }

  const frameHeight = Math.min(812, height - 32);

  return (
    <View style={styles.backdrop}>
      <View style={[styles.frame, { height: frameHeight }]}>
        <View style={styles.cameraPunch} />
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  backdrop: {
    flex: 1,
    height: '100vh',
    width: '100vw',
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 375,
    borderRadius: 36,
    borderWidth: 10,
    borderColor: '#334155',
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  cameraPunch: {
    position: 'absolute',
    top: 12,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1.5,
    borderColor: '#334155',
    zIndex: 999,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
