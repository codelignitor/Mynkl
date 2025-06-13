import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const HugAnimationScreen = () => {
  const [isHapticEnabled, setIsHapticEnabled] = useState(true);

  // Animation refs
  const hugEmojiAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  // Animation functions
  const startAnimations = () => {
    // Hug emoji bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(hugEmojiAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(hugEmojiAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ripple effect animation
    Animated.loop(
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  const restartAnimations = () => {
    // Reset all animations to initial state
    hugEmojiAnim.setValue(0);
    rippleAnim.setValue(0);
    
    // Start animations again
    startAnimations();
  };

  // Animation interpolations
  const hugScale = hugEmojiAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.8, 0.3, 0],
  });

  // Start animations on component mount
  useEffect(() => {
    startAnimations();
  }, []);

  // Event handlers
  const handleSendAnotherHug = () => {
    // Restart animations
    restartAnimations();
    
    // You can add more functionality here like:
    // - Navigate to contacts screen
    // - Show success message
    // - Send analytics event
    
    Alert.alert(
      "Sending Another Hug! 🤗", 
      "Your hug animation has been sended!",
      [{ text: "OK", style: "default" }]
    );
  };

  const handleMapIconPress = () => {
    console.log("Map icon (Send button) clicked!");
    Alert.alert(
      "Map Location 📍", 
      "Opening location settings or map view",
      [{ text: "OK", style: "default" }]
    );
  };

  const handleReceiversPress = () => {
    console.log("Receivers emoji clicked!");
    Alert.alert(
      "Receivers 😊", 
      "View recipients list or add more receivers",
      [{ text: "OK", style: "default" }]
    );
  };

  const handleHapticPress = () => {
    console.log("Haptic feedback button clicked!");
    setIsHapticEnabled(!isHapticEnabled);
    // Add gentle vibration when toggled
    if (isHapticEnabled) {
      Vibration.vibrate(50); // Short vibration for 50ms
    }
  };

  const handleTogglePress = () => {
    console.log("Toggle button clicked!");
    const newHapticState = !isHapticEnabled;
    setIsHapticEnabled(newHapticState);
    
    // Add vibration when toggle is turned ON
    if (newHapticState) {
      Vibration.vibrate(100); // Vibrate for 100ms when enabled
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={['#FFE8E8', '#FFB3E6', '#B3D9FF', '#E8F4FF']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sent Hug Animation</Text>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileIcon}>
              <Ionicons name="person" size={20} color="#000" />
              <View style={styles.notificationDot} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Send Label with Static Map Icon */}
          <View style={styles.sendSection}>
            <TouchableOpacity
              onPress={handleMapIconPress}
              activeOpacity={0.8}
              style={styles.locationIcon}
            >
              <Ionicons name="location" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.sendText}>Send</Text>
          </View>

          {/* Center Hug Emoji with Ripples */}
          <View style={styles.centerContainer}>
            {/* Ripple Effects */}
            <Animated.View
              style={[
                styles.ripple,
                {
                  transform: [{ scale: rippleScale }],
                  opacity: rippleOpacity,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.ripple,
                styles.ripple2,
                {
                  transform: [{ scale: rippleScale }],
                  opacity: rippleOpacity,
                },
              ]}
            />

            {/* Main Hug Emoji */}
            <Animated.View
              style={[
                styles.hugEmoji,
                {
                  transform: [{ scale: hugScale }],
                },
              ]}
            >
              <Text style={styles.hugEmojiText}>🤗</Text>
            </Animated.View>
          </View>

          {/* Receivers Section */}
          <View style={styles.receiversSection}>
            <TouchableOpacity
              onPress={handleReceiversPress}
              activeOpacity={0.8}
            >
              <View style={styles.floatingEmoji}>
                <Text style={styles.floatingEmojiText}>😊</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.receiversText}>Receivers</Text>
          </View>

          {/* Message Text */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Your hug is on the way!</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={handleHapticPress}
                activeOpacity={0.7}
              >
                <Text style={styles.subText}>
                  Haptic feedback you {isHapticEnabled ? 'enabled' : 'disabled'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleTogglePress}
                activeOpacity={0.7}
                style={{
                  marginLeft: 10,
                  width: 50,
                  height: 25,
                  borderRadius: 12.5,
                  backgroundColor: isHapticEnabled ? '#4CAF50' : '#ccc',
                  justifyContent: 'center',
                  alignItems: isHapticEnabled ? 'flex-end' : 'flex-start',
                  paddingHorizontal: 3,
                }}
              >
                <View
                  style={{
                    width: 19,
                    height: 19,
                    borderRadius: 9.5,
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendAnotherHug}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>Send Another Hug</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HugAnimationScreen;