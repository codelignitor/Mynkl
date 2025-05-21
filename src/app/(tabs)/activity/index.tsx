import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './index.style';
import { useActivity } from './useActivity';

// Remove route parameter - this is causing the error
export default function PostScreen() {
  // Use a hardcoded activityId for now or omit it completely
  const activityId = null;
  
  // Use our custom hook
  const { 
    activityData, 
    isLoading, 
    error, 
    handleActivityAction 
  } = useActivity(activityId);
  
  // Destructure the activity data for easier access
  const { 
    username, 
    statusText,
    eventTitle, 
    eventTime,
    guidedTitle,
    guidedText,
    mindfulnessTitle,
    mindfulnessText,
    exerciseTitle,
    exerciseSubtitle,
    createTitle,
    createSubtitle
  } = activityData;
  
  // Handle back button press
  const handleBackPress = () => {
    // Navigation logic would go here
    console.log('Back button pressed');
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topMargin} />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.username}>{username}</Text>
          </View>
          <View style={styles.placeholderWidth} />
        </View>

        <View style={styles.postContainer}>
          <Text style={styles.postText}>{statusText}</Text>

          <View style={styles.eventContainer}>
            <View style={styles.emptyImageSpace}></View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{eventTitle}</Text>
              <Text style={styles.eventTime}>{eventTime}</Text>
            </View>
          </View>

          {/* First row: Guided Meditation + Mindfulness */}
          <View style={styles.horizontalSectionsContainer}>
            <View style={styles.firstSectionWrapper}>
              <View style={styles.firstHorizontalSection}></View>
              <View style={styles.firstSectionTextBox}>
                <Text style={styles.firstSectionTitle}>{guidedTitle}</Text>
                <Text style={styles.firstSectionSubtext}>{guidedText}</Text>
              </View>
            </View>

            <View style={styles.secondHorizontalSection}>
              <Text style={styles.secondSectionTitle}>{mindfulnessTitle}</Text>
              <Text style={styles.secondSectionSubtext}>{mindfulnessText}</Text>
            </View>
          </View>

          {/* Second row: Exercise + Create Art */}
          <View style={styles.horizontalSectionsContainer}>
            <View style={styles.thirdSectionBox}>
              <Text style={styles.thirdSectionTitle}>{exerciseTitle}</Text>
              <Text style={styles.thirdSectionSubtitle}>{exerciseSubtitle}</Text>
            </View>

            <View style={styles.fourthSectionBox}>
              <Text style={styles.fourthSectionTitle}>{createTitle}</Text>
              <Text style={styles.fourthSectionSubtitle}>{createSubtitle}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}