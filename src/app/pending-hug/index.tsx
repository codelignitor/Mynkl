import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HugsWaitingScreen({ }) {
  const hugs = [
    {
      id: 1,
      type: 'warm hug',
      avatar: '👩',
      avatarBg: '#FFD4A8',
      message: "I'm here for you 💕",
      time: '3 hrs ago',
      gradient: ['#FFE8D6', '#FFD6E8'],
    },
    {
      id: 2,
      type: 'calm hug',
      avatar: '🧘',
      avatarBg: '#C8B8E8',
      message: 'Everything is going to be okay',
      time: '2 days ago',
      gradient: ['#E8D6FF', '#D6E8FF'],
    },
    {
      id: 3,
      type: 'excited hug',
      avatar: '👩🏾',
      avatarBg: '#D4A8D8',
      message: 'You did it! 👏',
      time: 'A week ago',
      gradient: ['#E8D6FF', '#FFE8D6'],
    },
    {
      id: 4,
      type: 'excited hug',
      avatar: '⭐',
      avatarBg: '#FFD4A8',
      message: 'You did it! 👏',
      time: 'A week ago',
      gradient: ['#FFE8D6', '#E8D6FF'],
    },
  ];

  const handleBack = () => {
    // if (navigation) {
    //   navigation.goBack();
    // }
    router.back();
  };

  const handleHugPress = (hug) => {
    console.log('Hug pressed:', hug.type);
    // Add navigation logic here
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0D4F0" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#F0D4F0', '#E8D0F0', '#E0C8E8']}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={28} color="#7B6BA8" />
              </TouchableOpacity>

              {/* Decorative Hearts */}
              <View style={styles.heartsContainer}>
                <Text style={styles.heartSmall}>💕</Text>
                <Text style={styles.heartLarge}>💗</Text>
                <Text style={styles.star}>✨</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Hugs Waiting for You</Text>
            <Text style={styles.subtitle}>
              Open a hug to respond when you're ready.
            </Text>

            {/* Hugs List */}
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {hugs.map((hug) => (
                <TouchableOpacity
                  key={hug.id}
                  style={styles.hugCard}
                  onPress={() => handleHugPress(hug)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={hug.gradient}
                    style={styles.hugGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.hugContent}>
                      {/* Avatar */}
                      <View style={[styles.avatar, { backgroundColor: hug.avatarBg }]}>
                        <Text style={styles.avatarEmoji}>{hug.avatar}</Text>
                      </View>

                      {/* Content */}
                      <View style={styles.textContainer}>
                        <Text style={styles.hugType}>You got a {hug.type}</Text>
                        <Text style={styles.message}>{hug.message}</Text>
                        <Text style={styles.time}>{hug.time}</Text>
                      </View>

                      {/* Chevron */}
                      <Ionicons name="chevron-forward" size={24} color="#7B6BA8" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}

              {/* Bottom Message */}
              <View style={styles.bottomMessage}>
                <Ionicons name="chatbubble-outline" size={24} color="#9B8BC8" />
                <Text style={styles.bottomText}>
                  Take your time. These hugs will be here{'\n'}when you're ready.
                </Text>
              </View>
            </ScrollView>

            {/* Bottom Tab Bar */}
            {/* <View style={styles.tabBar}>
              <TouchableOpacity style={styles.tabItem}>
                <Ionicons name="home" size={28} color="#9B8BC8" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem}>
                <View style={styles.activeTab}>
                  <Ionicons name="heart" size={28} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem}>
                <Ionicons name="bar-chart" size={28} color="#9B8BC8" />
              </TouchableOpacity>
            </View> */}
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
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  heartsContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  heartSmall: {
    fontSize: 28,
    position: 'absolute',
    top: 0,
    right: 40,
  },
  heartLarge: {
    fontSize: 30,
    position: 'absolute',
    top: -10,
    right: 0,
  },
  star: {
    position: 'absolute',
    fontSize: 20,
    top: 20,
    right: 70,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3D2D4F',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7B6BA8',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  hugCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  hugGradient: {
    padding: 16,
  },
  hugContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
  },
  hugType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D2D4F',
    marginBottom: 4,
  },
  message: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5D4D6D',
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9B8BC8',
  },
  bottomMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  bottomText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#5D4D6D',
    marginLeft: 12,
    lineHeight: 22,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    padding: 10,
  },
  activeTab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E88BA8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});