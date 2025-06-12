// AuthScreen.js (Main Parent Component)
import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';

import LoginForm from '@/src/components/loginform/LoginForm';
import GuideScreen from '@/src/components/guidescreen/GuideScreen';
import MoodMapScreen from '@/src/components/moodmap/MoodMapScreen';
import moodentry from '@/src/components/moodentry/MoodEntryScreen';
import MoodMap from '../(tabs)/home/index';
import { setToken, setTokenOnly } from '@/src/store/slices/authSlice';
import { AppDispatch, RootState } from '@/src/store';
import { authStyles } from './authStyles';

const AuthScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isUserLoggedIn = useSelector((state: RootState) => state.auth.isUserLoggedIn);
  
  const [showGuide, setShowGuide] = useState(false);
  const [showMoodMap, setShowMoodMap] = useState(false);
  const [showHomeMoodMap, setShowHomeMoodMap] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleNavigateToHome = () => {
    setShowHomeMoodMap(true);
  };

  const handleLoginSuccess = (data, isLogin) => {
    if (!isLogin) {
      dispatch(setTokenOnly(data));
      setShowGuide(true);
      setIsNewUser(false);
    } else {
      dispatch(setToken(data));
      router.push('/(tabs)/home');
    }
  };

  const handleGuideComplete = async (allPreferences) => {
    console.log('All user preferences:', allPreferences);
    
    try {
      // Save preferences to backend here
      setShowMoodMap(true);
      setShowGuide(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Handle error appropriately
      setShowMoodMap(true);
      setShowGuide(false);
    }
  };

  // Render appropriate screen based on state
  if (showHomeMoodMap) {
    return <MoodMap />;
  }

  if (showMoodMap) {
    return <MoodMapScreen onNavigateToHome={handleNavigateToHome} />;
  }

  if (showGuide) {
    return (
      <GuideScreen 
        onComplete={handleGuideComplete} 
        onNavigateToHome={handleNavigateToHome} 
      />
    );
  }

  return (
    <SafeAreaView style={authStyles.container}>
      <StatusBar barStyle="light-content" />
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </SafeAreaView>
  );
};

export default AuthScreen;