// HugListScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HugListScreen = ({ handleSendHug, sentHugs, setShowHugList, totalHugs }) => {
  return (
    <LinearGradient
      colors={['#E59AB2', '#EFB894', '#B887CE']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => setShowHugList(false)}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.communityFeed}>COMMUNITY FEED</Text>
      <Text style={styles.feedTitle}>People in need{'\n'}of a hug</Text>

      <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.cardContainer}>
        {[
          { name: 'Rachel', message: 'Feeling anxious', emoji: '👩🏻' },
          { name: 'Jason', message: 'Feeling anxious', emoji: '👨🏽' },
        ].map((person, index) => (
          <View key={index} style={styles.personCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={styles.emojiAvatar}>
                <Text style={styles.emojiText}>{person.emoji}</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.personName}>{person.name}</Text>
                <Text style={styles.personFeeling}>{person.message}</Text>
              </View>
            </View>
            <View style={styles.cardBottomRow}>
              <Text style={styles.needText}>I just need someone to say it'll be okay.</Text>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendHug}
                disabled={sentHugs >= totalHugs}
              >
                <Text style={styles.sendButtonText}>Send Hug</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: '#ffffff50',
    borderRadius: 20,
  },
  communityFeed: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 30,
  },
  feedTitle: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  cardContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  personCard: {
    backgroundColor: '#F5DFCA',
    width: width * 0.9,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  emojiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dfd7f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 20,
  },
  personName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  personFeeling: {
    fontSize: 14,
    color: '#888',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  needText: {
    flex: 1,
    fontSize: 20,
    color: '#444',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#fef0de',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderColor: '#eee',
    borderWidth: 1,
    elevation: 2,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D2D2D',
  },
});

export default HugListScreen;
