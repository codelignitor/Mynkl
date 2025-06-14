import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function WellnessSuggestionsScreen() {
  const [selectedAnchors, setSelectedAnchors] = useState([]);
  const router = useRouter();

  const moodAnchors = [
    'Deep breathing',
    'Gratitude',
    'Nature sounds',
    'Deep breathing',
    'Nature sounds',
    'Walk outside'
  ];

  const toggleAnchor = (anchor) => {
    setSelectedAnchors((prev) => {
      if (prev.includes(anchor)) {
        return prev.filter((a) => a !== anchor);
      } else {
        return prev.concat(anchor);
      }
    });
  };

  const IllustrationSVG = () => (
    <Svg width="280" height="120" viewBox="0 0 280 120">
      <Path d="M0 80 Q70 60 140 80 T280 80 L280 120 L0 120 Z" fill="#B8D4C7" />
      <Path d="M0 90 Q90 70 180 90 T280 90 L280 120 L0 120 Z" fill="#A8C4B7" />
      <Circle cx="220" cy="45" r="25" fill="#2D5A47" />
      <Path d="M220 70 L220 90" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
      <Circle cx="80" cy="35" r="12" fill="#F4A574" />
      <Path d="M68 30 Q80 20 95 35 L95 40 Q85 28 75 35 Z" fill="#8B4513" />
      <Ellipse cx="100" cy="38" rx="8" ry="15" fill="#8B4513" />
      <Path d="M80 47 L80 85" stroke="#E67E22" strokeWidth="16" strokeLinecap="round" />
      <Path d="M80 55 Q95 50 110 60" stroke="#E67E22" strokeWidth="8" strokeLinecap="round" />
      <Path d="M80 55 Q65 60 50 55" stroke="#E67E22" strokeWidth="8" strokeLinecap="round" />
      <Path d="M80 85 L75 105" stroke="#E67E22" strokeWidth="8" strokeLinecap="round" />
      <Path d="M80 85 L85 105" stroke="#E67E22" strokeWidth="8" strokeLinecap="round" />
    </Svg>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4A574" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header with back button and centered title */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2C2C2C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI wellness{'\n'}suggestions</Text>
          <View style={styles.rightPlaceholder} />
        </View>

        {/* Suggestion Card */}
        <View style={styles.suggestionCard}>
          <View style={styles.illustrationContainer}>
            <IllustrationSVG />
          </View>
          <Text style={styles.suggestionTitle}>3 Days Feeling Unmotivated?</Text>
          <Text style={styles.suggestionSubtitle}>Try energizing outdoor walks.</Text>
          <Text style={styles.secondaryText}>
            Your evenings tend to feel low —{'\n'}want a 10-min wind-down routine?
          </Text>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start activity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.remindButton}>
              <Text style={styles.remindButtonText}>Remind me</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.notNowButton}>
            <Text style={styles.notNowButtonText}>Not now</Text>
          </TouchableOpacity>
        </View>

        {/* Mood Anchors */}
        <View style={styles.moodAnchorsSection}>
          <Text style={styles.moodAnchorsTitle}>Mood anchors</Text>
          <View style={styles.anchorsContainer}>
            <View style={styles.anchorsRow}>
              <TouchableOpacity style={[styles.anchorTag, selectedAnchors.includes('Deep breathing') && styles.selectedAnchorTag]} onPress={() => toggleAnchor('Deep breathing')}>
                <Text style={[styles.anchorText, selectedAnchors.includes('Deep breathing') && styles.selectedAnchorText]}>
                  Deep breathing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.anchorTag, selectedAnchors.includes('Gratitude') && styles.selectedAnchorTag]} onPress={() => toggleAnchor('Gratitude')}>
                <Text style={[styles.anchorText, selectedAnchors.includes('Gratitude') && styles.selectedAnchorText]}>
                  Gratitude
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.anchorTag, selectedAnchors.includes('Nature sounds') && styles.selectedAnchorTag]} onPress={() => toggleAnchor('Nature sounds')}>
                <Text style={[styles.anchorText, selectedAnchors.includes('Nature sounds') && styles.selectedAnchorText]}>
                  Nature sounds
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.anchorsRow}>
              <TouchableOpacity style={[styles.anchorTag, selectedAnchors.includes('Deep breathing2') && styles.selectedAnchorTag]} onPress={() => toggleAnchor('Deep breathing2')}>
                <Text style={[styles.anchorText, selectedAnchors.includes('Deep breathing2') && styles.selectedAnchorText]}>
                  Deep breathing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.anchorTag, selectedAnchors.includes('Nature sounds2') && styles.selectedAnchorTag]} onPress={() => toggleAnchor('Nature sounds2')}>
                <Text style={[styles.anchorText, selectedAnchors.includes('Nature sounds2') && styles.selectedAnchorText]}>
                  Nature sounds
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.anchorsRow}>
              <TouchableOpacity style={[styles.anchorTag, selectedAnchors.includes('Walk outside') && styles.selectedAnchorTag]} onPress={() => toggleAnchor('Walk outside')}>
                <Text style={[styles.anchorText, selectedAnchors.includes('Walk outside') && styles.selectedAnchorText]}>
                  Walk outside
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4A574',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerRow: {
    marginTop:40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 30,
    alignItems: 'flex-start',
  },
  rightPlaceholder: {
    width: 30, // matches backButton width to keep title centered
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C2C2C',
    textAlign: 'center',
    lineHeight: 24,
  },
  suggestionCard: {
    backgroundColor: '#F5F1E8',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  suggestionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  suggestionSubtitle: {
    fontSize: 16,
    color: '#2C2C2C',
    marginBottom: 20,
  },
  secondaryText: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 20,
    marginBottom: 24,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  startButton: {
    backgroundColor: '#E67E22',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  remindButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
  },
  remindButtonText: {
    color: '#2C2C2C',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  notNowButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  notNowButtonText: {
    color: '#6B6B6B',
    fontSize: 16,
    fontWeight: '500',
  },
  moodAnchorsSection: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  moodAnchorsTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 20,
  },
  anchorsContainer: {
    gap: 12,
  },
  anchorsRow: {
    marginBottom:5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  anchorTag: {
    marginBottom:5,
    backgroundColor: '#F5F1E8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  selectedAnchorTag: {
    backgroundColor: '#E67E22',
  },
  anchorText: {
    marginBottom:5,
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  selectedAnchorText: {
    color: '#FFFFFF',
  },
});
