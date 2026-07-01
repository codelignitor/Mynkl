import firebase from '@react-native-firebase/app';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Redirect, router } from 'expo-router';
import { RootState } from '@/src/store';

import messaging from '@react-native-firebase/messaging';


import * as Clipboard from 'expo-clipboard';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Required for foreground display behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true, // ✅ Required
    shouldShowList: true,
  }),
});



if (__DEV__) {
  import('../../ReactotronConfig');
}



const App = () => {
  const isUserLoggedIn = useSelector((state: RootState) => state.auth.isUserLoggedIn);
  const [loading, setLoading] = useState(true);
  
  const HUG_ID_KEY = 'LAST_IDENTITY_REVEAL_HUG_ID';
  
  const saveHugId = async (hugId: string) => {
  try {
    await AsyncStorage.setItem(HUG_ID_KEY, hugId);
    console.log('✅ Stored hug_id:', hugId);
  } catch (e) {
    console.error('❌ Error saving hug_id:', e);
  }
};

const getHugId = async () => {
  try {
    return await AsyncStorage.getItem(HUG_ID_KEY);
  } catch (e) {
    console.error('❌ Error getting hug_id:', e);
    return null;
  }
};

  useEffect(() => {
    const initFCM = async () => {
      try {
        // ✅ Ensure notification permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowSound: true,
              allowBadge: true,
            },
          });
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.warn('🚫 Notification permissions not granted');
          return;
        }

        // ✅ Android: set channel
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }

        // ✅ Firebase Messaging permissions (iOS only)
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const token = await messaging().getToken();
          console.log('📱 FCM Token:', token);

        //   Alert.alert(
        //     'FCM Token',
        //     token,
        //     [
        //       {
        //         text: 'Copy',
        //         onPress: () => Clipboard.setStringAsync(token),
        //       },
        //       { text: 'OK', style: 'cancel' },
        //     ],
        //     { cancelable: false }
        //   );
        } else {
          console.log('🚫 FCM permission not granted');
        }

        // ✅ Foreground message handler
        const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
          const { title, body } = remoteMessage.notification ?? {};

          console.log('📬 Foreground notification received:', remoteMessage);

          await Notifications.scheduleNotificationAsync({
            content: {
              title: title ?? '📩 New Message',
              body: body ?? 'You have a new message',
              data: remoteMessage.data,
              sound: 'default', // ✅ Required for sound
            },
            trigger: null, // Show immediately
          });
        });

        // --- Add notification tap handler ---
    const handleNotificationResponse = async (remoteMessage: any) => {
      const data = remoteMessage?.data;
      if (!data) return;
///virtual-hug/hug-community/Hug-moment?hugId=${data.hug_id}
      switch (data.type) {
        case 'new_hug':
          router.push(`/(tabs)/recevie_hugs`);
          break;
        case 'mood_boost_suggestion':
          router.push('/addCheckIn');
          break;
        case 'notificationCenter':
          router.push('/Notifications');
          break;

        case 'identy_reveal':  
          if (data.hug_id) {
            await saveHugId(String(data.hug_id)); // ✅ overwrite previous
            router.push({
              pathname: '/Reveal_request', // 👈 your target screen
               params: {
                hug_id: String(data.hug_id), // ✅ force string
                consent: String(data.consent),
              },
          });
          console.log('Navigating to Reveal_request with hugId:', data.hug_id);
         }
          break;
        default:
          console.log('Unknown notification type:', data.type);
      }
    };

    // ✅ Notification tapped handler
      const responseListener = Notifications.addNotificationResponseReceivedListener(
        async response => {
          const data = response.notification.request.content.data;
          console.log('📲 Notification tapped:', data);

          if (data.type === 'new_hug' && data.hug_id) {
            router.push(`/(tabs)/recevie_hugs?openHugId=${data.hug_id}`);
          }
          if (data.type === 'identy_reveal' && data.hug_id) {
            await saveHugId(String(data.hug_id)); // ✅ store latest (overwrite)
            router.push({
              pathname: '/Reveal_request', 
              params: {
                hug_id: String(data.hug_id),
                consent: String(data.consent),
              },
            });
            console.log('Listener hug_id:', data.hug_id);
          }
        }
      );

        // When app is opened from background due to notification
        const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
          console.log('📥 App opened from background via notification:', remoteMessage);
          handleNotificationResponse(remoteMessage);
        });

        // When app is opened from quit state via notification
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
          console.log('📲 Opened from quit state via notification:', initialNotification);
          handleNotificationResponse(initialNotification);
        }

        setLoading(false);

        return () => {
          unsubscribeForeground();
          unsubscribeOpened();
          responseListener.remove()
        };
      } catch (err) {
        console.error('🔥 Firebase init error:', err);
        setLoading(false);
      }
    };

    initFCM();
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
