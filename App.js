import React from 'react';
import { Platform } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import WebFrame from './src/components/WebFrame';
import { registerServiceWorker } from './src/lib/pwa';

registerServiceWorker();

export default function App() {
  const content = (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );

  return Platform.OS === 'web' ? <WebFrame>{content}</WebFrame> : content;
}
