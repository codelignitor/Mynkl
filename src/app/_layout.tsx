import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';

import { Provider, useSelector } from 'react-redux';
import { store } from '@/src/store';
import { RootState } from '@/src/store';

SplashScreen.preventAutoHideAsync();

function MainLayout() {
  const colorScheme = useColorScheme();
  const isUserLoggedIn = useSelector((state: RootState) => state.auth.isUserLoggedIn);
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* 🔁 Redirect at the layout level */}
      {isUserLoggedIn === null ? null : (
        isUserLoggedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />
      )}
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  );
}
