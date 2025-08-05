import "react-native-gesture-handler"
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';

import { Provider, useSelector } from 'react-redux';
import { store } from '@/src/store';
import { RootState } from '@/src/store';
import CustomToast from '../components/common/customToast';
import Toast , { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {ChatWrapper} from '../components/common/chatWrapper';
import { AppProvider } from '../contexts/AppContext';


SplashScreen.preventAutoHideAsync();



const toastConfig = {
  success: (props: any) => <CustomToast {...props} />,
  error: (props: any) => <CustomToast {...props} />,
};

function MainLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);


  return (

    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"  />
      </Stack>
      <Toast config={toastConfig} />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
     <GestureHandlerRootView style={  {
    flex: 1,
     }}>
    <Provider store={store}>
       
      {/** Only render ChatWrapper if stream token exists and user is logged in */}
      { store.getState().auth.stream_token ? (
        // <ChatWrapper>
        //   <AppProvider>
        <MainLayout />
          // </AppProvider>
          // </ChatWrapper>
      ) : (
       
          <MainLayout />
       
      )}
    
     
    </Provider>
    </GestureHandlerRootView>
  );
}