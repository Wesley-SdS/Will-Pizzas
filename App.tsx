import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './src/hooks/auth';
import { Home } from "@components/Home";
import { Product } from '@screens/Product';

import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './src/services/firebaseConfig';
import { Text } from 'react-native';
import theme from './src/theme';
import AppLoading from 'expo-app-loading';
import { useFonts, DMSans_400Regular } from '@expo-google-fonts/dm-sans';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';


// Inicialize o Firebase

function HomeScreen() {
  return (
    <GestureHandlerRootView>
      <Text>Home</Text>
    </GestureHandlerRootView>
  );
}

function LoginScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <AuthProvider>
     
     <Product />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSerifDisplay_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      setIsReady(true);
    }
  }, [fontsLoaded]);

  if (!isReady) {
    return <AppLoading />;
  }

  return (
    <LoginScreen />
  );
}
