// components/GuideScreen.js
import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import SuggestionStep from '@/src/components/GuideSteps/SuggestionStep';
import NotificationStep from '@/src/components/GuideSteps/NotificationStep';
import PrivacyStep from '@/src/components/GuideSteps/PrivacyStep';
import CommunityStep from '@/src/components/GuideSteps/CommunityStep';
import ThemeStep from '@/src/components/GuideSteps/ThemeStep';
import WelcomeScreen from '../welcomescreen/WelcomeScreen';
import { guideStyles } from '../guidescreen/guide-style';

const GuideScreen = ({ onComplete, onNavigateToHome }) => {
  const [currentSection, setCurrentSection] = useState('suggestions');
  const [preferences, setPreferences] = useState({
    suggestionPreference: 'always',
    notificationPreference: 'daily',
    privacyPreference: 'moderate',
    communityPreference: 'active',
    themePreference: 'light'
  });
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);

  const updatePreferences = (newPreferences) => {
    setPreferences({ ...preferences, ...newPreferences });
  };

  const navigateToSection = (section) => {
    setCurrentSection(section);
  };

  const completeGuide = () => {
    setShowWelcomeScreen(true);
  };

  const renderCurrentSection = () => {
    if (showWelcomeScreen) {
      return <WelcomeScreen onComplete={() => onComplete(preferences)} />;
    }
    
    switch (currentSection) {
      case 'suggestions':
        return (
          <SuggestionStep
            preferences={preferences}
            onUpdatePreferences={updatePreferences}
            onNext={() => navigateToSection('notifications')}
          />
        );
      case 'notifications':
        return (
          <NotificationStep
            preferences={preferences}
            onUpdatePreferences={updatePreferences}
            onNext={() => navigateToSection('privacy')}
          />
        );
      case 'privacy':
        return (
          <PrivacyStep
            preferences={preferences}
            onUpdatePreferences={updatePreferences}
            onNext={() => navigateToSection('community')}
          />
        );
      case 'community':
        return (
          <CommunityStep
            preferences={preferences}
            onUpdatePreferences={updatePreferences}
            onNext={() => navigateToSection('theme')}
          />
        );
      case 'theme':
        return (
          <ThemeStep
            preferences={preferences}
            onUpdatePreferences={updatePreferences}
            onComplete={completeGuide}
          />
        );
      default:
        return (
          <SuggestionStep
            preferences={preferences}
            onUpdatePreferences={updatePreferences}
            onNext={() => navigateToSection('notifications')}
          />
        );
    }
  };

  return (
    <SafeAreaView style={guideStyles.container}>
      <StatusBar barStyle="light-content" />
      {renderCurrentSection()}
    </SafeAreaView>
  );
};

export default GuideScreen;