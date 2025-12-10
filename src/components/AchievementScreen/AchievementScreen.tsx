import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function AchievementScreen({ 
  // Customizable props
  bannerText,
  bannerEmoji,
  badgeTitle,
  emojiImage, // Pass your emoji image source
  mainHeading,
  mainEmoji,
  subHeading,
  subEmoji,
  achievementTitle,
  achievementSubtitle,
  achievementIcon,
  buttonText,
  gradientColors,
  bannerColor,
  buttonColor,
  ribbonColor,
  ribbonTextColor,
  statusBarStyle = 'dark-content',
  decorativeColor,
  onContinuePress,
  onAddToJournalPress,
}) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={gradientColors[0]} translucent={false} />
      
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Decorative elements - sparkles and confetti */}
        <View style={styles.decorativeElements}>
          <Text style={[styles.sparkle, { top: 80, left: 30 }]}>✨</Text>
          <Text style={[styles.sparkle, { top: 100, right: 40 }]}>✨</Text>
          
          <View style={[styles.dot, { top: 150, left: 60, backgroundColor: decorativeColor }]} />
          <View style={[styles.dot, { top: 180, right: 80, backgroundColor: decorativeColor }]} />
          <View style={[styles.dot, { top: 200, left: 100, backgroundColor: decorativeColor }]} />
          <View style={[styles.dot, { top: 240, right: 50, backgroundColor: decorativeColor }]} />
          
          <View style={[styles.confetti, { top: 160, left: 170, backgroundColor: decorativeColor }]} />
          <View style={[styles.confetti, { top: 220, right: 120, backgroundColor: decorativeColor, transform: [{ rotate: '45deg' }] }]} />
          <View style={[styles.confetti, { top: 280, left: 50, backgroundColor: decorativeColor, transform: [{ rotate: '-30deg' }] }]} />
          <View style={[styles.confetti, { top: 320, right: 70, backgroundColor: decorativeColor }]} />
          
          <Text style={[styles.sparkle, { bottom: 350, left: 50 }]}>✨</Text>
          <Text style={[styles.sparkle, { bottom: 320, right: 60 }]}>✨</Text>
          
          <View style={[styles.dot, { bottom: 280, left: 90, backgroundColor: decorativeColor }]} />
          <View style={[styles.dot, { bottom: 250, right: 100, backgroundColor: decorativeColor }]} />
        </View>

        {/* Top banner */}
        <View style={[styles.topBanner, { backgroundColor: bannerColor }]}>
          <Text style={styles.bannerText}>{bannerText} {bannerEmoji}</Text>
        </View>

        {/* Achievement badge */}
        <View style={styles.badgeContainer}>
          <View style={[styles.badgeCircle, { backgroundColor: `${decorativeColor}40` }]}>
            <View style={styles.whiteRing}>
              <LinearGradient
                colors={gradientColors}
                style={styles.emojiBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={styles.emojiPlaceholder}>
                  {emojiImage ? (
                    <Image source={emojiImage} style={styles.emojiImage} />
                  ) : (
                    <Text style={styles.emojiPlaceholderText}>❤️</Text>
                  )}
                </View>
              </LinearGradient>
            </View>
          </View>
          
          <View style={[styles.ribbonBanner, { backgroundColor: ribbonColor }]}>
            <Text style={[styles.ribbonText, { color: ribbonTextColor }]}>{badgeTitle}</Text>
          </View>
        </View>

        {/* Content card */}
        <View style={styles.contentCard}>
          <Text style={styles.mainHeading}>{mainHeading} {mainEmoji}</Text>
          
          <Text style={styles.subHeading}>{subHeading} {subEmoji}</Text>
          
          {/* Achievement label */}
          <View style={styles.achievementLabel}>
            <Text style={styles.achievementIcon}>{achievementIcon}</Text>
            <View>
              <Text style={[styles.achievementTitle, { color: ribbonTextColor }]}>{achievementTitle}</Text>
              <Text style={[styles.achievementSubtitle, { color: ribbonTextColor }]}>{achievementSubtitle}</Text>
            </View>
          </View>
          
          {/* Buttons */}
          <TouchableOpacity 
            style={[styles.continueButton, { backgroundColor: buttonColor }]}
            onPress={onContinuePress}
          >
            <Text style={styles.continueButtonText}>{buttonText}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.journalButton} onPress={onAddToJournalPress}>
            <Text style={styles.journalButtonText}>Add to Journal</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 24,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  confetti: {
    position: 'absolute',
    width: 12,
    height: 20,
    borderRadius: 2,
  },
  topBanner: {
    marginTop: 70,
    marginHorizontal: 30,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  badgeContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  badgeCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  emojiBackground: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiPlaceholderText: {
    fontSize: 100,
  },
  emojiImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  ribbonBanner: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: -25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  ribbonText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  contentCard: {
    marginHorizontal: 25,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    paddingTop: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  mainHeading: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '400',
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 30,
  },
  achievementLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  achievementIcon: {
    fontSize: 40,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  achievementSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 25,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  journalButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  journalButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});