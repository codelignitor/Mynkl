import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHugDetail } from '@/src/services/apis';


const SPARKLES = [
  { top: 40, left: 30, size: 6, opacity: 0.8 },
  { top: 90, left: 280, size: 4, opacity: 0.6 },
  { top: 160, left: 60, size: 5, opacity: 0.5 },
  { top: 220, left: 320, size: 7, opacity: 0.7 },
  { top: 320, left: 20, size: 4, opacity: 0.5 },
  { top: 380, left: 300, size: 5, opacity: 0.6 },
  { top: 480, left: 50, size: 6, opacity: 0.4 },
  { top: 560, left: 260, size: 4, opacity: 0.55 },
];

export default function ProfileScreen() {
  
  const {
    hugId,
    }=useLocalSearchParams();

    const [hugDetail, setHugDetail] = useState(null);
    const authState = useSelector((state: any) => state.auth);
    const currUserId = authState?.user_id;

  
   const fetchHugDetail = async () => {
    try {
        const values = await AsyncStorage.multiGet([
        'hug_id',
        'sender_id',
        'receiver_id',
        ]);

        const clean = (v) => v?.replace(/"/g, '');

        const hug_id = clean(values[0][1]);
        const sender_id = clean(values[1][1]);
        const receiver_id = clean(values[2][1]);

        if (!hug_id || !sender_id || !receiver_id) return;

        const data = await getHugDetail(hug_id, sender_id, receiver_id);

        setHugDetail(data);
    } catch (error) {
        console.log('Error fetching hug detail:', error);
    }
};

useEffect(() => {
  fetchHugDetail();
}, []);

const displayedUser =
  hugDetail?.sender?.id === currUserId
    ? hugDetail?.receiver
    : hugDetail?.sender;

    // Swap this for your own asset, e.g. require('./assets/maya.png')
const avatar = displayedUser?.profile_pic || 'https://api.dicebear.com/9.x/shapes/svg?seed=profile';


    return (
    <LinearGradient
      colors={['#F1E6FB', '#E7D9F7', '#EFE3FA']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* Decorative sparkles */}
        <View pointerEvents="none" style={styles.sparkleLayer}>
          {SPARKLES.map((s, i) => (
            <View
              key={i}
              style={[
                styles.sparkle,
                {
                  top: s.top,
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  opacity: s.opacity,
                },
              ]}
            />
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back() }
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#5B3F8C" />
          </TouchableOpacity>
          <Text style={styles.logo}>mynkl</Text>
          <View style={styles.backButton} />
        </View>

        {/* Profile content */}
        <View style={styles.content}>
          <View style={styles.avatarWrap}>
           {avatar ? (
  <Image source={{ uri: avatar }} style={styles.avatar} />
) : (
  <Svg width={120} height={120} viewBox="0 0 200 200">
    <Rect x="0" y="0" width="200" height="200" rx="20" fill="#fff" />
    <Circle cx="100" cy="75" r="28" fill="#9CA3AF" />
    <Path
      d="M48 165C48 130 72 112 100 112C128 112 152 130 152 165"
      fill="#9CA3AF"
    />
  </Svg>
)}
          </View>

          <Text style={styles.name}>{displayedUser?.username || 'Unknown'}</Text>

          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Calm</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Supportive</Text>
            </View>
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
              <Ionicons
                name="chatbubble"
                size={18}
                color="#fff"
                style={styles.btnIcon}
              />
              <Text style={styles.primaryButtonText}>Start Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85}>
              <Text style={styles.hugEmoji}>🤗</Text>
              <Text style={styles.secondaryButtonText}>Send another Hug</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Block</Text>
            </TouchableOpacity>
            <Text style={styles.footerDivider}>|</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  sparkleLayer: { ...StyleSheet.absoluteFillObject },
  sparkle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 67
  },
  backButton: { width: 32, alignItems: 'flex-start' },
  logo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7C4FC7',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 24,
  },
  avatarWrap: {
    width: 168,
    height: 168,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    padding: 6,
    shadowColor: '#7C4FC7',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 22 },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#3D2B56',
    marginTop: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 5,
  },
  tagText: {
    color: '#5B3F8C',
    fontWeight: '600',
    fontSize: 13,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 28,
    padding: 16,
    marginTop: 28,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8C5FD6',
    borderRadius: 24,
    paddingVertical: 16,
    shadowColor: '#7C4FC7',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  btnIcon: { marginRight: 8 },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 24,
    paddingVertical: 16,
    marginTop: 12,
  },
  hugEmoji: { fontSize: 18, marginRight: 8 },
  secondaryButtonText: {
    color: '#5B3F8C',
    fontSize: 16,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  footerLink: {
    color: '#7C5C9E',
    fontSize: 14,
    fontWeight: '500',
  },
  footerDivider: {
    color: '#B7A4D1',
    marginHorizontal: 10,
  },
});