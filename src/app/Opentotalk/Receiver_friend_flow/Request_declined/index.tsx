import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ReceiverDeclineSuccess() {
  const { username, profilePicture } = useLocalSearchParams<{
    username: string;
    profilePicture: string;
  }>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Floating confetti */}
          <View
            style={[
              styles.confetti,
              { top: 90, left: 70, backgroundColor: '#8B5CF6' },
            ]}
          />
          <View
            style={[
              styles.confetti,
              { top: 70, right: 90, backgroundColor: '#FBBF24' },
            ]}
          />
          <View
            style={[
              styles.confetti,
              { top: 120, right: 50, backgroundColor: '#22C55E' },
            ]}
          />
          <View
            style={[
              styles.confetti,
              { top: 190, left: 50, backgroundColor: '#FACC15' },
            ]}
          />
          <View
            style={[
              styles.confetti,
              { top: 180, right: 70, backgroundColor: '#60A5FA' },
            ]}
          />
          <View
            style={[
              styles.confetti,
              { top: 230, right: 40, backgroundColor: '#FB7185' },
            ]}
          />

          {/* Success Icon */}
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="close"
              size={58}
              color="#FF3B5C"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Request declined</Text>

          <Text style={styles.subtitle}>
            You won’t see this request again.
          </Text>

          {/* User */}
          <View style={styles.userSection}>
            <Image
              source={{
                uri:
                  profilePicture ||
                  'https://randomuser.me/api/portraits/men/32.jpg',
              }}
              style={styles.avatar}
            />

            <Text style={styles.username}>
              {username || 'User'}
            </Text>
          </View>

          {/* Information Cards */}
          <View style={styles.infoContainer}>
            <InfoRow
              icon="lock-outline"
              title="Your choice is private"
              subtitle="They won't be notified."
            />

            <InfoRow
              icon="shield-check-outline"
              title="This won’t affect future matches"
              subtitle="You’ll continue to receive new requests."
            />

            <InfoRow
              icon="account-group-outline"
              title="Stay in control"
              subtitle="You can manage requests your way."
            />
          </View>

          {/* Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/Opentotalk/StartChat')}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons
          name={icon}
          size={28}
          color="#0F9D8A"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>
          {title}
        </Text>

        <Text style={styles.infoSubtitle}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  iconCircle: {
    marginTop: 60,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: '800',
    color: '#081B5C',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#4F5B7A',
    textAlign: 'center',
    lineHeight: 22,
  },

  userSection: {
    alignItems: 'center',
    marginTop: 24,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
  },

  username: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '700',
    color: '#081B5C',
  },

  infoContainer: {
    width: '100%',
    marginTop: 24,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderColor: '#EEF2F7',
  },

  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#F1FBF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#081B5C',
    marginBottom: 4,
  },

  infoSubtitle: {
    fontSize: 15,
    color: '#52607A',
    lineHeight: 20,
  },

  button: {
    width: '100%',
    height: 60,
    borderRadius: 18,
    backgroundColor: '#F2FBF8',
    borderWidth: 1,
    borderColor: '#D8F1EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 20,
  },

  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F9D8A',
  },

  confetti: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
});