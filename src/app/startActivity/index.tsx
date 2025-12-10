import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Switch, SafeAreaView, Dimensions, Image } from 'react-native';
import { Svg, Path, Circle, Rect, G, Defs, ClipPath } from 'react-native-svg';

import IllustrionSvG from "../../assets/images/Illustration.jpeg";


const { width } = Dimensions.get('window');

const OutdoorWalkScreen = () => {
  const [isMarkedDone, setIsMarkedDone] = useState(false);
  const router = useRouter()

  const IllustrationSVG= () => (
    <Svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <ClipPath id="cardClip">
                <Rect width="400" height="300" rx="0" />
              </ClipPath>
            </Defs>

            {/* Background Sky/Card Color */}
            <Rect width="400" height="300" fill="#FFF8E7" />

            {/* Back Hill (Lighter Green) */}
            <Path
              d="M0 200 C 100 180, 250 180, 400 230 V 300 H 0 Z"
              fill="#C2DBC6"
            />

            {/* Front Hill (Darker Green) */}
            <Path
              d="M0 240 C 150 220, 300 260, 400 250 V 300 H 0 Z"
              fill="#A8C9B8"
            />

            {/* Tree (Right Side) */}
            <G transform="translate(300, 140)">
              {/* Trunk */}
              <Path d="M0 0 L 0 100" stroke="#1A303D" strokeWidth="6" strokeLinecap="round" />
              {/* Branches */}
              <Path d="M0 30 L -15 15" stroke="#1A303D" strokeWidth="4" strokeLinecap="round" />
              <Path d="M0 50 L 15 35" stroke="#1A303D" strokeWidth="4" strokeLinecap="round" />
              {/* Leaves (Teal Blob) */}
              <Path 
                d="M -30 10 Q -50 -20 0 -40 Q 50 -20 30 10 Q 50 40 0 60 Q -50 40 -30 10 Z" 
                fill="#3E6D74"
              />
            </G>

            {/* Walking Person */}
            <G transform="translate(140, 110) scale(1.1)">
              
              {/* Back Leg (Right Leg) - Darker Blue */}
              <Path
                d="M 50 100 Q 70 120 80 150 L 95 145 L 85 110 Q 75 90 60 90 Z"
                fill="#2C5F6E"
              />
              <Path d="M 80 150 L 90 155 L 95 145" fill="#1A303D" /> {/* Shoe */}

              {/* Back Arm (Right Arm) - Darker Orange */}
              <Path
                d="M 55 55 Q 70 70 80 80"
                stroke="#BF6138" strokeWidth="14" strokeLinecap="round"
              />
              <Circle cx="80" cy="80" r="7" fill="#8F4F30" /> {/* Hand */}

              {/* Front Leg (Left Leg) - Lighter Blue */}
              <Path
                d="M 50 100 Q 30 120 15 150 L 0 145 L 20 110 Q 40 90 55 90 Z"
                fill="#447A89"
              />
              <Path d="M 15 150 L 5 155 L 0 145" fill="#1A303D" /> {/* Shoe */}

              {/* Torso - Orange */}
              <Path
                d="M 40 40 L 70 40 L 75 90 L 35 90 Z"
                fill="#D97042"
                stroke="#D97042" strokeWidth="15" strokeLinejoin="round"
              />

              {/* Front Arm (Left Arm) - Orange */}
              <Path
                d="M 45 50 Q 30 70 20 80"
                stroke="#D97042" strokeWidth="14" strokeLinecap="round"
              />
              <Circle cx="20" cy="80" r="7" fill="#A65D3B" /> {/* Hand */}

              {/* Neck */}
              <Rect x="50" y="30" width="10" height="15" fill="#A65D3B" />

              {/* Head */}
              <Circle cx="55" cy="25" r="14" fill="#A65D3B" />

              {/* Hair (Ponytail) */}
              <Path
                d="M 45 15 Q 65 10 70 25 Q 72 35 60 38 Q 40 35 45 15 Z"
                fill="#1A303D"
              />
              {/* Ponytail Blob */}
              <Path
                d="M 45 20 Q 30 10 25 25 Q 20 40 35 35 Z"
                fill="#1A303D"
              />
            </G>
          </Svg>
   );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5d598ff" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header with back button and centered title - Same structure as WellnessSuggestionsScreen */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2C2C2C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Outdoor Walk</Text>
          <View style={styles.rightPlaceholder} />
        </View>

        {/* Illustration Card - Similar to suggestion card but with SVG */}
        <View style={styles.illustrationCard}>
          {/* <IllustrationSVG/> */}
          <Image 
            source={IllustrionSvG}
            style={{ width: "auto", height: 310 }}
            resizeMode="contain"
          />
        </View>

        {/* Content Section - Similar structure to WellnessSuggestionsScreen */}
        <View style={styles.contentCard}>
          <Text style={styles.instructionText}>Take 5 mindful minutes.</Text>

          {/* Toggle Row */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Mark as done</Text>
            <Switch
              value={isMarkedDone}
              onValueChange={setIsMarkedDone}
              trackColor={{ false: '#E6D5B8', true: '#ddd0baff' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E6D5B8"
              style={styles.switch}
            />
          </View>

          {/* Action Buttons - Similar to WellnessSuggestionsScreen */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.logButton}>
              <Text style={styles.logButtonText}>Log How You Feel</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Link - Similar to "Not now" button */}
          <TouchableOpacity style={styles.browseLink}>
            <Text style={styles.browseLinkText}>Want more? Browse Library</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffdd9eff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerRow: {
    marginTop: 60,
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
    fontSize: 38,
    fontWeight: '600',
    color: '#2C2C2C',
    lineHeight: 42,
  },
  illustrationCard: {
    marginHorizontal: 30,
    borderRadius: 20,
    height: 300,
    width: 'auto',
    overflow: 'hidden',
  },
  contentCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C2C2C',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 28,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  toggleLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C2C2C',
    flex: 1,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  // Action Buttons - Similar to WellnessSuggestionsScreen
  actionButtonsContainer: {
    marginBottom: 16,
  },
  logButton: {
    backgroundColor: '#f7f6f5ff',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#AE9570',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  logButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000ff',
  },
  // Footer Link - Similar to "Not now" button
  browseLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  browseLinkText: {
    color: '#6B6B6B',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OutdoorWalkScreen;