import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSelection } from './useSelection';
import { styles } from './index-style';

const UseSelectionScreen = () => {
  const {
    handleAnonymousSend,
    handleNormalSend,
  } = useSelection();

  // Handle Anonymous Send with routing
  const handleAnonymousRoute = () => {
    // Call your existing handler if needed
    handleAnonymousSend();
    
    // Route to anonymous send screen
    // Replace '/anonymous-send' with your actual path
    router.push('/sendHugs/Hugs');
  };

  // Handle Normal Send with routing
  const handleNormalRoute = () => {
    // Call your existing handler if needed
    handleNormalSend();
    
    // Route to normal send screen
    // Replace '/normal-send' with your actual path
    router.push('/sendHugs/Hugs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#A8D5D0" />
      
      <LinearGradient
        colors={['#A8D5D0', '#B8E6E1']}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Header Text */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Select how</Text>
          <Text style={styles.headerText}>you want to send</Text>
        </View>

        {/* Selection Cards */}
        <View style={styles.cardsContainer}>
          {/* Send Anonymously Card */}
          <TouchableOpacity
            style={styles.anonymousCard}
            onPress={handleAnonymousRoute}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                {/* Two overlapping person icons */}
                <View style={styles.personIconsContainer}>
                  <View style={[styles.personIcon, styles.personIcon1]} />
                  <View style={[styles.personIcon, styles.personIcon2]} />
                </View>
              </View>
              <Text style={styles.anonymousCardText}>Send Anonymously</Text>
            </View>
          </TouchableOpacity>

          {/* Send Normally Card */}
          <TouchableOpacity
            style={styles.normalCard}
            onPress={handleNormalRoute}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8B7BD8', '#6B5B95']}
              style={styles.normalCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="person" size={32} color="#FFFFFF" />
                  <View style={styles.sparkleContainer}>
                    <View style={[styles.sparkle, styles.sparkle1]} />
                    <View style={[styles.sparkle, styles.sparkle2]} />
                    <View style={[styles.sparkle, styles.sparkle3]} />
                  </View>
                </View>
                <Text style={styles.normalCardText}>Send Normally</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default UseSelectionScreen;