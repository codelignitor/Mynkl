import axios from 'axios';
import { store } from '../store';


import { Alert, Platform, ToastAndroid } from 'react-native';
import { logout } from '../store/slices/authSlice';
import Toast from 'react-native-toast-message';

const axiosInstance = axios.create({
  baseURL: 'http://13.50.228.222:8000', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
   
    const state = store.getState();
    const token = state.auth.token;

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

      showMessage('Session expired. Please login again.');
    }

    // if (status === 404) {
        
      // Bad request
      console.log('Error 404:', error.response.data.detail[0].msg);
     Toast.show({
  type: 'error', 
  text1: 'Error',
  text2:error.response.data.detail[0].msg || 'Something went wrong',
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
