import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';

const TopMoodMapText = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>MoodMap</Text>
      <Text style={styles.greeting}>Hi Hammad</Text>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.featuresTitleContainer}>
        <Text style={styles.featuresTitle}>✨ MoodMap App Features ✨</Text>
        <TouchableOpacity style={styles.featureButton} onPress={() => console.log('Button pressed')}>
          <Text style={styles.buttonText}>Explore Features</Text>
        </TouchableOpacity>
      </View>
        
        <View style={styles.bulletContainer}>
          <View style={styles.featureItem}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>😊</Text>
            </View>
            <Text style={styles.bulletText}>Select your current mood using emojis like <Text style={styles.highlightText}>Happy, Calm, Stressed, or Lonely</Text></Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.emojiContainer, {backgroundColor: '#9F7AEA'}]}>
              <Text style={styles.emoji}>🗺️</Text>
            </View>
            <Text style={styles.bulletText}>View an <Text style={styles.boldText}>interactive map</Text> with places matched to your selected mood</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.emojiContainer, {backgroundColor: '#F6AD55'}]}>
              <Text style={styles.emoji}>📍</Text>
            </View>
            <Text style={styles.bulletText}><Text style={styles.boldText}>Add and save your own places</Text> based on how they make you feel</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.emojiContainer, {backgroundColor: '#68D391'}]}>
              <Text style={styles.emoji}>💡</Text>
            </View>
            <Text style={styles.bulletText}>Explore the <Text style={styles.boldText}>Suggested</Text> section for mood-based place recommendations</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.emojiContainer, {backgroundColor: '#4299E1'}]}>
              <Text style={styles.emoji}>💬</Text>
            </View>
            <Text style={styles.bulletText}>Chat with the built-in <Text style={styles.boldText}>mood chatbot</Text> for emotional support and personalized suggestions</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.emojiContainer, {backgroundColor: '#FC8181'}]}>
              <Text style={styles.emoji}>💖</Text>
            </View>
            <Text style={styles.bulletText}>Access helpful <Text style={styles.boldText}>self-care tips</Text> to improve your mental well-being</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.emojiContainer, {backgroundColor: '#F6E05E'}]}>
              <Text style={styles.emoji}>⭐</Text>
            </View>
            <Text style={styles.bulletText}>Save mood-tagged locations in your <Text style={styles.boldText}>Favorite Places</Text> for quick access later</Text>
          </View>
        </View>
        
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>Discover places that match your mood!</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    paddingHorizontal: 16
  },
  header: {
    marginTop: 51,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
  greeting: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ccc'
  },
  scrollContainer: {
    flex: 1,
  },
  featuresTitleContainer: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#9F7AEA',
    shadowColor: '#9F7AEA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(159, 122, 234, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  // Add these to your existing styles
featureButton: {
  backgroundColor: '#5E72E4',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  marginTop: 10,
  alignSelf: 'center',
},
buttonText: {
  fontFamily: 'Poppins-Medium', // Make sure this font is available in your project
  color: 'white',
  fontSize: 16,
  textAlign: 'center',
},
  bulletContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emoji: {
    fontSize: 24,
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ddd',
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  highlightText: {
    color: '#9F7AEA',
    fontWeight: 'bold',
  },
  taglineContainer: {
    backgroundColor: 'rgba(159, 122, 234, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9F7AEA',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
});

export default TopMoodMapText;