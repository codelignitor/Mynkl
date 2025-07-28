import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';

const user = {
  name: 'Lauren',
  image: 'https://randomuser.me/api/portraits/women/44.jpg', // Placeholder, replace as needed
  tags: ['Near You', 'Books', 'Cheerful'],
  icebreaker: "What's something that made you smile today?",
};

const AIMatchingScreen = () => {
  const router = useRouter();
  return (
    <LinearGradient
      colors={['#0a2323', '#175c47', '#0a2323']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} 
        onPress={() => router.push('/Opentotalk/StartChat')}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>mynkl</Text>
        <Text style={styles.title}>AI Smart Matching</Text>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.image }} style={styles.avatar} />
          <View style={styles.nameOverlay}>
            <Text style={styles.nameText}>{user.name}</Text>
          </View>
        </View>
        <View style={styles.tagsRow}>
          {user.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.icebreakerLabel}>AI ICEBREAKER</Text>
        <Text style={styles.icebreakerQuestion}>{user.icebreaker}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={() => router.replace('/Opentotalk/feedback')}>
          <Text style={styles.buttonText}>Find Next Match</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default AIMatchingScreen;
