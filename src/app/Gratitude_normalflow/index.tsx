import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { acknowledgeHug } from '@/src/services/apis';

export default function HugReceivedDetailScreen() {
  // Get params using Expo Router's useLocalSearchParams
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  
  // Map the params from your previous screens to the expected format
  const hugSenderName = params.hugSenderName || 'Someone';
  const hugType = params.hugType || 'Warm Hug';
  const message = params.message || 'Thinking of you';
  const hugprofilePic = params.hugprofilePic || null;
  const sendedat = params.sendedat || null;
  const hugId = params.hugId || null;
  const senderid = params.senderid || null;

  // Format the time if available
  const formatTime = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) {
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      } else if (diffInDays === 1) {
        return `Yesterday, ${date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })}`;
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true 
        });
      }
    } catch (error) {
      return 'Recently';
    }
  };

  const displayTime = formatTime(sendedat);

  const handleBack = () => {
    router.back();
  };

  const handleSendGratitude = async () => {
    console.log('Send Gratitude pressed');
    // Navigate to gratitude sent screen with all relevant params
   try {
    console.log('Thank You pressed');

    setLoading(true);

    const response = await acknowledgeHug(hugId);

    console.log('Acknowledgement Response:', response);

    router.push({
      pathname: '/gratitude_sent',
      // params: {
      //   hugId: response.hug_id,
      //   responseType: response.response_type,
      //   privacyMode: response.privacy_mode
      // }
    });

  } catch (error) {
    console.error('Error sending gratitude:', error);
  } finally {
    setLoading(false);
  }
  };

  const handleHugBack = () => {
    console.log('Hug Back pressed');
    // Navigate to send hug screen with recipient info
    router.push({
      pathname: '/normalhugbackflow',
      params: {
        receiverName: hugSenderName,
        receiverId: senderid,
        receiverProfilePic: hugprofilePic,
        originalHugId: hugId,
        originalMessage: message,
      }
    });
  };

  const handleClose = () => {
    console.log('Close pressed');
    router.back();
  };

  
  const renderAvatar = () => {
    if (hugprofilePic) {
      return (
        <Image 
          source={{ uri: hugprofilePic }}
          style={styles.avatarImage}
        />
      );
    }
    // Fallback avatar with first letter
    return (
      <View style={styles.fallbackAvatar}>
        <Text style={styles.fallbackAvatarText}>
          {hugSenderName?.charAt(0).toUpperCase() || '?'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#F8F0FF', '#F0E8FF', '#E8E0FF']}
          style={styles.gradientContainer}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#7B6BA8" />
              </TouchableOpacity>
              
              <Text style={styles.logo}>mynkl</Text>
              
              <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="ellipsis-vertical" size={24} color="#7B6BA8" />
              </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
              {/* Avatar with Hearts */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatarWrapper}>
                  {renderAvatar()}
                </View>
                <View style={styles.heartsContainer}>
                  {/* <View style={styles.heartBubble}>
                    <Text style={styles.heartEmoji}>🤍</Text>
                  </View> */}
                  <View style={[styles.heartBubble, styles.heartBubbleLarge]}>
                    <Text style={styles.heartEmojiLarge}>💜</Text>
                  </View>
                </View>
              </View>

              {/* Title */}
              <Text style={styles.title}>
                {hugSenderName} sent you a{'\n'}
                <Text style={styles.hugType}>{hugType} 💜</Text>
              </Text>

              {/* Message */}
              <Text style={styles.message}>"{message}"</Text>

              {/* Metadata */}
              <View style={styles.metadata}>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>
                    {hugType?.split(' ')[0] || 'Warm'}
                  </Text>
                </View>
                <View style={styles.metadataDivider} />
                <View style={styles.metadataItem}>
                  <Ionicons name="time-outline" size={14} color="#9B8BC8" />
                  <Text style={styles.metadataText}>{displayTime}</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.gratitudeButton}
                onPress={handleSendGratitude}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#9B8BC8', '#A89BD8']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.gratitudeIcon}>💝</Text>
                  <Text style={styles.gratitudeText}>Send Gratitude</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.hugBackButton}
                onPress={handleHugBack}
                activeOpacity={0.8}
              >
                <Text style={styles.hugBackIcon}>🤗</Text>
                <Text style={styles.hugBackText}>Hug Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
}

// Keep all your existing styles here (they're good as is)
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9B8BC8',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#E8D8F8',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  fallbackAvatar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C8B8E8',
  },
  fallbackAvatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heartsContainer: {
    position: 'absolute',
    top: 30,
    right: -20,
  },
  heartBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8D8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  heartBubbleLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D8C8F8',
  },
  heartEmoji: {
    fontSize: 24,
  },
  heartEmojiLarge: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#3D2D4F',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 16,
  },
  hugType: {
    color: '#9B8BC8',
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5D4D6D',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    lineHeight: 24,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9B8BC8',
  },
  metadataDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#D0C0E0',
    marginHorizontal: 12,
  },
  metadataText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9B8BC8',
    marginLeft: 4,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  gratitudeButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  gratitudeIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  gratitudeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hugBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 12,
  },
  hugBackIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  hugBackText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5D4D6D',
  },
  closeButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9B8BC8',
  },
});