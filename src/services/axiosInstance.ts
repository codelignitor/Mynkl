import axios from 'axios';
import { store } from '../store';


import { Alert, Platform, ToastAndroid } from 'react-native';
import { logout } from '../store/slices/authSlice';

const axiosInstance = axios.create({
  baseURL: 'https://your-api-url.com/api', 
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

    if (status === 400) {
      // Bad request
      showMessage(message); // Display error message returned from backend
    }

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
