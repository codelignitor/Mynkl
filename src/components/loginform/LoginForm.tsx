// components/LoginForm.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { loginStyles } from './login-style';
import { updateFcm } from '@/src/services/apis';
import messaging from '@react-native-firebase/messaging';

const LoginForm = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.email || !formData.password) {
        Alert.alert('Error', 'Please fill in all fields');
        return false;
      }
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      let url = isLogin 
      
        ? 'http://18.199.96.45:8000/auth/login' 
       
        : 'http://18.199.96.45:8000/users/register';
      
      const requestBody = isLogin 
        ? { 
            email: formData.email, 
            password: formData.password 
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password
          };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();


      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      
      if (!isLogin) {
        Alert.alert(
          'Registration Successful',
          'Your account has been created. Please sign in with your credentials.',
          [{ text: 'OK', onPress: () => setIsLogin(true) }]
        );
      }
      
      onLoginSuccess(data, isLogin);
      

    
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
      const token = await messaging().getToken();
         const payload ={
        token : token,
       }
       const res  =  await updateFcm(payload);
      console.log('FCM Token updated:', res);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const renderForm = () => (
    <View style={loginStyles.modalContainer}>
      <View style={loginStyles.titleContainer}>
        <Text style={loginStyles.title}>
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </Text>
      </View>

      <View style={loginStyles.formContainer}>
        {!isLogin && (
          <View style={loginStyles.inputContainer}>
            <Text style={loginStyles.label}>Username</Text>
            <TextInput
              style={loginStyles.input}
              placeholder="Username"
              placeholderTextColor="#777"
              value={formData.username}
              onChangeText={(text) => handleChange('username', text)}
            />
          </View>
        )}

        <View style={loginStyles.inputContainer}>
          <Text style={loginStyles.label}>Email address</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Email address"
            placeholderTextColor="#777"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
          />
        </View>

        <View style={loginStyles.inputContainer}>
          <Text style={loginStyles.label}>Password</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
          />
        </View>

        {!isLogin && (
          <View style={loginStyles.inputContainer}>
            <Text style={loginStyles.label}>Confirm Password</Text>
            <TextInput
              style={loginStyles.input}
              placeholder="Confirm password"
              placeholderTextColor="#777"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
            />
          </View>
        )}

        <TouchableOpacity
          style={[loginStyles.submitButton, isLoading && loginStyles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={loginStyles.submitButtonText}>
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Sign up')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={loginStyles.toggleContainer}>
        <Text style={loginStyles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </Text>
        <TouchableOpacity onPress={toggleForm}>
          <Text style={loginStyles.toggleButtonText}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={loginStyles.container}>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={loginStyles.scrollView}>
            {renderForm()}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView contentContainerStyle={loginStyles.scrollView}>
          {renderForm()}
        </ScrollView>
      )}
    </View>
  );
};

export default LoginForm;