import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function SenderHugBackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    message,
    hugType,
    hugSenderName,
    hugprofilePic,
    senderid,
    sendedat,
  } = params;

  const isAnonymous =
    !hugSenderName ||
    hugSenderName?.toLowerCase() === "anonymous";

  const senderName = hugSenderName || "Someone";
  const profilePic = hugprofilePic;

  const hug_type = hugType || "Warm Hug";
  const created_at = sendedat;

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return 'Today, 9:30 AM';
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `Today, ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const timeString = formatTime(created_at);

  const handleBack = () => {
    router.back();
  };

  const handleStartChat = () => {
    console.log('Start chat pressed');
    Alert.alert("Start chat", "will be implemented when move to this feature");
  };

  const handleSendAnotherHug = () => {
    console.log('Send another hug pressed');
    router.push({
      pathname: "/normalhugbackflow",
    params: {
      message,
      hugType,
      hugSenderName,
      hugprofilePic,
      senderid,
      sendedat,
    },
  });
  };

  const handleBlock = () => {
    console.log('Block pressed');
    Alert.alert("Block", "will be implemented in next version");
  };

  const handleReport = () => {
    console.log('Report pressed');
    Alert.alert("Report", "will be implemented in next version");
  };

  const renderAvatar = () => {
    if (isAnonymous) {
      return (
        <View style={styles.fallbackAvatar}>
          <Ionicons name="person" size={35} color="#fff" />
        </View>
      );
    }

    if (profilePic) {
      return (
        <Image
          source={{ uri: profilePic }}
          style={styles.avatarImage}
        />
      );
    }

    return (
      <View style={styles.fallbackAvatar}>
        <Text style={styles.fallbackAvatarText}>
          {senderName.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8D8F8" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#E8D8F8', '#E0D0F0', '#D8C8E8']}
          style={styles.gradientContainer}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>

              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                >
                  <Ionicons name="arrow-back" size={24} color="#7B6BA8" />
                </TouchableOpacity>

                <Text style={styles.logo}>mynkl</Text>

                <View style={styles.headerSpacer} />
              </View>

              {/* User Row */}
              <View style={styles.userRow}>
                <View style={styles.avatarContainer}>
                  {renderAvatar()}
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {isAnonymous ? "Someone" : senderName}
                  </Text>

                  <Text style={styles.hugInfo}>
                    {hug_type} • {timeString}
                  </Text>
                </View>
              </View>

              {/* Glass Card */}
              <View style={styles.glassCard}>
                <Text style={styles.messageTitle}>
                  Sending a {hug_type.toLowerCase()}
                  {'\n'}your way! 💜
                </Text>

                <Text style={styles.messageSubtitle}>
                  {message || "Your kindness reached them."}
                </Text>

                {/* Start Chat */}
                <TouchableOpacity
                  style={styles.startChatButton}
                  onPress={handleStartChat}
                >
                  <Ionicons name="chatbubble" size={20} color="#fff" />
                  <Text style={styles.startChatText}>Start chat</Text>
                </TouchableOpacity>

                {/* Send Another Hug */}
                <TouchableOpacity
                  style={styles.sendHugButton}
                  onPress={handleSendAnotherHug}
                >
                  <Text style={styles.sendHugIcon}>🤝</Text>
                  <Text style={styles.sendHugText}>
                    Send another Hug
                  </Text>
                </TouchableOpacity>

                {/* Moderation */}
                <View style={styles.moderationButtons}>
                  <TouchableOpacity
                    style={styles.moderationButton}
                    onPress={handleBlock}
                  >
                    <Ionicons
                      name="ban-outline"
                      size={18}
                      color="#9B8BC8"
                    />
                    <Text style={styles.moderationText}>
                      Block
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  <TouchableOpacity
                    style={styles.moderationButton}
                    onPress={handleReport}
                  >
                    <Text style={styles.moderationText}>
                      Report
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>

            </View>
          </ScrollView>
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

  scrollView: {
    flex: 1,
    paddingTop: 60,
  },

  scrollContent: {
    paddingBottom: 80,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  headerSpacer: {
    width: 40,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 44,
  },

  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },

  userInfo: {
    marginLeft: 14,
  },

  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3D2D4F',
  },

  hugInfo: {
    fontSize: 14,
    color: '#7B6BA8',
    marginTop: 4,
  },

  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingBottom: 60,
    paddingTop: 30,
  },

  messageTitle: {
    fontSize: 30,
    fontWeight: '400',
    color: '#3D2D4F',
    lineHeight: 30,
    marginBottom: 20,
  },

  messageSubtitle: {
    fontSize: 15,
    color: '#7B6BA8',
    marginBottom: 40,
  },

  startChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9B8BC8',
    borderRadius: 20,
    paddingVertical: 14,
    marginBottom: 12,
  },

  startChatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  sendHugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 20,
    paddingVertical: 14,
    marginBottom: 16,
  },

  sendHugIcon: {
    fontSize: 18,
    marginRight: 6,
  },

  sendHugText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D2D4F',
  },

  moderationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  moderationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  moderationText: {
    fontSize: 14,
    color: '#9B8BC8',
    marginLeft: 5,
    fontWeight: '600',
  },

  divider: {
    width: 1,
    height: 18,
    backgroundColor: '#C8B8E8',
    marginHorizontal: 10,
  },

});