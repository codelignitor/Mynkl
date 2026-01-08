import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CelebrationResponse } from '@/src/services/types';
import { router } from 'expo-router';

interface CelebrationPopupProps {
  visible: boolean;
  onClose: () => void;
  data: CelebrationResponse;
}

const { width } = Dimensions.get('window');

const CelebrationPopup: React.FC<CelebrationPopupProps> = ({ 
  visible, 
  onClose, 
  data 
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideUpAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideUpAnim, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideUpAnim.setValue(50);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Semi-transparent overlay */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.popupContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          {/* Header section with gradient background */}
          <View style={styles.headerSection}>
            {/* Background gradient effect */}
            <View style={styles.headerGradient} />
            
            {/* Title */}
            <Text style={styles.mainTitle}>Your Mood is Rising!</Text>
            
            {/* Subtitle */}
            <Text style={styles.subtitle}>RISING LIGHT</Text>
          </View>

          {/* Content section */}
          <View style={styles.contentSection}>
            {/* AI Message */}
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{data.ai_message}</Text>
            </View>

            {/* Badge section */}
            {data.badges && data.badges.length > 0 && (
              <View style={styles.badgeContainer}>
                {/* <Text style={styles.badgeTitle}>'{data.badges[0].title}'</Text> */}
                <View style={styles.badgeItem}>
                  <Text style={styles.badgeEmoji}>{data.badges[0].emoji}</Text>
                  <View style={styles.badgeTextContainer}>
                    <Text style={styles.badgeName}>{data.badges[0].title}</Text>
                    <Text style={styles.badgeSubtitle}>HAPPINESS BOOST</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Action buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => {
                  onClose();
                  // Navigate to journal screen if needed
                  router.push('/Selfcare_tips/breathingSuggestion');
                }}
                activeOpacity={0.8}
              >
                <Icon name="arrow-up-bold" size={20} color="#FFF" style={styles.buttonIcon} />
                <Text style={styles.primaryButtonText}>Continue Uplifting Activity</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => {
                  onClose();
                  // Navigate to journal screen if needed
                  // router.push('/journal');
                }}
                activeOpacity={0.7}
              >
                {/* <Icon name="book-plus" size={18} color="#2c2a23ff" style={styles.buttonIcon} /> */}
                <Text style={styles.secondaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Decorative elements */}
          <View style={styles.sparkle1}>
            <Icon name="sparkles" size={16} color="#FFD700" />
          </View>
          <View style={styles.sparkle2}>
            <Icon name="sparkles" size={12} color="#FFD700" />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popupContent: {
    width: width * 0.85,
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  headerSection: {
    backgroundColor: '#a28d41ff',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(245, 188, 66, 0.7)',
    opacity: 0.9,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 2,
  },
  contentSection: {
    padding: 25,
    backgroundColor: '#FFFFFF',
  },
  messageContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
  },
  badgeContainer: {
    marginBottom: 25,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  badgeTextContainer: {
    flex: 1,
  },
  badgeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  badgeSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    letterSpacing: 1,
  },
  buttonsContainer: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eacd26ff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 20,
    // borderWidth: 2,
    // borderColor: '#FFD700',
  },
  secondaryButtonText: {
    color: '#33322eff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  sparkle1: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});

export default CelebrationPopup;