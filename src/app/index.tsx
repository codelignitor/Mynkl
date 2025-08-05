import React, { useEffect, useState } from 'react';
import { Alert, Clipboard, Platform, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import { RootState } from '@/src/store';
// import notifee, { AndroidImportance } from '@notifee/react-native';

import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

const App = () => {
  const isUserLoggedIn = useSelector((state: RootState) => state.auth.isUserLoggedIn);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initFCM = async () => {
      try {
        // ✅ Request permission on iOS
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const token = await messaging().getToken();
          console.log('📱 FCM Token:', token);
         
    console.log('📱 FCM Token:', token);

    // 📦 Show alert with copy option
    Alert.alert(
      'FCM Token',
      token,
      [
        {
          text: 'Copy',
          onPress: () => {
            if (Platform.OS === 'android') {
              Clipboard.setString(token);
            } else {
              // Clipboard API is now deprecated on iOS, use alternative if needed
              Clipboard.setString(token);
            }
          },
        },
        { text: 'OK', style: 'cancel' },
      ],
      { cancelable: false }
    );
        } else {
          console.log('🚫 FCM permission not granted');
        }

        // Foreground messages
        const unsubscribe = messaging().onMessage(async remoteMessage => {
//             await notifee.displayNotification({
//     title: remoteMessage.notification?.title ?? '📩 New Message',
//     body: remoteMessage.notification?.body ?? '',
//     android: {
//       channelId: 'default',
//       smallIcon: 'ic_launcher', // ensure it's in your mipmap
//       importance: AndroidImportance.HIGH,
//     },
//   });
          Alert.alert('📩 New Message', remoteMessage.notification?.body || 'You have a new message');
        });

        // App opened from background
        const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
          console.log('📥 App opened from background due to notification:', remoteMessage);
        });

        // App opened from quit state
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
          console.log('📲 Opened from quit state via notification:', initialNotification);
        }

        setLoading(false);

        return () => {
          unsubscribe();
          unsubscribeOpened();
        };
      } catch (err) {
        console.error('🔥 Firebase init error:', err);
        setLoading(false);
      }
    };

    initFCM();

    // Background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📤 Background message:', remoteMessage);
    });
  }, []);

  if (loading || isUserLoggedIn === undefined) {
    return <View style={styles.container} />;
  }

  return isUserLoggedIn ? <Redirect href="/(tabs)/home" /> : <Redirect href="/(auth)" />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
