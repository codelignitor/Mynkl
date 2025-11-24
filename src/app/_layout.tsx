import "react-native-gesture-handler";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";

import { Provider } from "react-redux";
import { store } from "@/src/store";
import CustomToast from "../components/common/customToast";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "../contexts/AppContext";
import { MoodProvider } from "@/src/contexts/MoodContext";
import { Appearance } from "react-native";


SplashScreen.preventAutoHideAsync();



// ---------------- toast config ----------------
const toastConfig = {
  success: (props: any) => <CustomToast {...props} />,
  error: (props: any) => <CustomToast {...props} />,
};

// function MainLayout() {
//   const colorScheme = useColorScheme();

//   const [fontsLoaded] = useFonts({
//     SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
//   });

//   useEffect(() => {
//     if (fontsLoaded) SplashScreen.hideAsync();
//   }, [fontsLoaded]);

//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkOverride : LightOverride}>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="index" />
//       </Stack>

//       <Toast config={toastConfig} />
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }

function MainLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // 🔥 Force the whole app to ALWAYS use light mode
  useEffect(() => {
    Appearance.setColorScheme("light");
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  return (
    <ThemeProvider value={DefaultTheme}>   {/* force light theme */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>

      <Toast config={toastConfig} />
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}


export default function RootLayout() {
  const state = store.getState();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <MoodProvider>
        <AppProvider>
          
            {state.auth.stream_token ? (
              <MainLayout />
            ) : (
              <MainLayout />
            )}
          
        </AppProvider>
        </MoodProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
