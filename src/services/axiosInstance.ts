import axios from 'axios';
import { store } from '../store';


import { Alert, Platform, ToastAndroid } from 'react-native';
import { logout } from '../store/slices/authSlice';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

const axiosInstance = axios.create({
   baseURL: 'http://18.199.96.45:8000',
  //  baseURL: 'https://5825f0be7d14.ngrok-free.app/',


 // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {

    const state = store.getState();
    const token = state.auth.token;

    // console.log(token)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ⚠️ Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong';

    if (status === 401) {
      // Token expired or unauthorized
      store.dispatch(logout());
      router.push('/(auth)');

      showMessage('Session expired. Please login again.');
    }

    // if (status === 404) {

    // Bad request

   let errorDetail = error?.response?.data?.detail;

let msg = 'Something went wrong';

if (Array.isArray(errorDetail)) {
  msg = errorDetail[0]?.msg || message;
} else if (typeof errorDetail === 'string') {
  msg = errorDetail;
}

Toast.show({
  type: 'error',
  text1: 'Error',
  text2: msg,
});
    


    return Promise.reject(error);
  }
);

// 📱 Helper for displaying error messages
function showMessage(msg: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('Error', msg);
  }
}

export default axiosInstance;
