import React from 'react';
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

export default function SenderGratitudeScreen() {
  const params = useLocalSearchParams();

  const {
    message,
    hugType,
    hugSenderName,
    hugprofilePic,
    senderid,
    sendedat,
  } = params;

  // const hugSenderName = user?.name || 'Someone';
  // const profilePic = user?.profile_pic;
  // const isIdentified = type === 'identified';

  const emoji = "💛";
const hug_type = hugType || "Warm Hug";
const created_at = sendedat;

  const isAnonymous =
  !hugSenderName ||
  hugSenderName?.toLowerCase() === "anonymous";

const isIdentified = !isAnonymous;

const senderName = hugSenderName || "Someone";
const profilePic = hugprofilePic;

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hrs ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return 'A week ago';
  };

  const timeAgo = formatTime(created_at);

  const gradientColors = isIdentified
  ? ['#FFF8F0', '#FFEFD6', '#FFE8D6']
  : ['#E8F0FF', '#E0E8FF', '#D8E0FF'];

const badgeColor = isIdentified ? '#FFD700' : '#5B8FDB';

  const handleBack = () => {
    router.back();
  };

  const handleViewHugs = () => {
    console.log('View Hugs pressed');
    router.back();
  };

  const renderAvatar = () => {
  if (isIdentified && profilePic) {
    return (
      <Image 
        source={{ uri: profilePic }}
        style={styles.avatarImage}
      />
    );
  }

  if (isIdentified && !profilePic) {
    return (
      <View style={styles.fallbackAvatar}>
        <Text style={styles.fallbackAvatarText}>
          {senderName.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.anonymousAvatar}>
      <Ionicons name="person" size={60} color="#8BA8D8" />
    </View>
  );
};

  const getTitle = () => {
  if (isIdentified) {
    return (
      <>
        <Text style={styles.titleText}>
          {senderName} sent gratitude for
        </Text>
        <Text>{'\n'}</Text>
        <Text style={styles.titleText}>
          your hug 💛
        </Text>
      </>
    );
  }

  return (
    <>
      <Text style={styles.titleText}>
        Someone appreciated
      </Text>
      <Text>{'\n'}</Text>
      <Text style={styles.titleText}>
        your hug 💛
      </Text>
    </>
  );
};

  const getSubtitle = () => {
    if (isIdentified) {
      return 'Your support was appreciated.';
    } else {
      return 'You showed up for them.';
    }
  };


  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor='transparent' />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={gradientColors}
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
                {/* <Ionicons name="ellipsis-vertical" size={24} color="#7B6BA8" /> */}
              </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
              {/* Avatar with Badge */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatarWrapper}>
                  {renderAvatar()}
                </View>
                <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                  <Text style={styles.badgeEmoji}>💛</Text>
                </View>
              </View>

              {/* Title */}
              <Text style={styles.title}>
                {getTitle()}
              </Text>

              {/* Subtitle */}
              <Text style={styles.subtitle}>
                {getSubtitle()}
              </Text>

              {/* Hug Info Card */}
              <View style={styles.hugInfoCard}>
                <View style={styles.hugInfoLeft}>
                  <Text style={styles.hugEmoji}>{emoji}</Text>
                  <View style={styles.hugInfoText}>
                    <Text style={styles.hugType}>{hug_type}</Text>
                    <Text style={styles.hugTime}>
                      {isIdentified ? 'You sent' : 'You sent'} · {timeAgo}
                    </Text>
                  </View>
                </View>
                <Ionicons name="heart" size={24} color="#C8A8D8" />
              </View>
            </View>

            {/* View Hugs Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.viewHugsButton}
                onPress={handleViewHugs}
                activeOpacity={0.8}
              >
                <Text style={styles.viewHugsText}>View Hugs</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
}

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
    backgroundColor: '#E8B8C8',
  },
  fallbackAvatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  anonymousAvatar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B8D0F0',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3D2D4F',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 12,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3D2D4F',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5D4D6D',
    textAlign: 'center',
    marginBottom: 30,
  },
  hugInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 16,
    width: '100%',
   
  },
  hugInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hugEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  hugInfoText: {
    flex: 1,
  },
  hugType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3D2D4F',
    marginBottom: 4,
  },
  hugTime: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9B8BC8',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  viewHugsButton: {
    backgroundColor: '#9B8BC8',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  viewHugsText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});