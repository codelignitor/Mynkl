import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ActivitiesScreen = () => {
  const handleBackPress = () => {
    router.back();
  };
  const activities = [
    {
      id: 1,
      title: 'Self-Care & Mindfulness',
      subtitle: 'Calming',
      description: 'Guided meditations, journals, breathing exercises',
      icon: 'leaf',
      bgColor: '#B8D4D1',
      iconColor: '#4A90A4'
    },
    {
      id: 2,
      title: 'Social Events',
      subtitle: 'Motivating',
      description: 'Meetups, virtual calls, group chats',
      icon: 'people',
      bgColor: '#F4D03F',
      iconColor: '#2E86AB'
    },
    {
      id: 3,
      title: 'Physical',
      subtitle: 'Energizing',
      description: 'Yoga, stretching, walking challenges',
      icon: 'fitness',
      bgColor: '#F4D03F',
      iconColor: '#F39C12'
    },
    {
      id: 4,
      title: 'Physical',
      subtitle: 'Energizing',
      description: 'Yoga, stretching, walking challenges',
      icon: 'walk',
      bgColor: '#F4D03F',
      iconColor: '#E67E22'
    },
    {
      id: 5,
      title: 'DIY art, painting',
      subtitle: 'Cooking, reading',
      description: '',
      icon: 'brush',
      bgColor: '#D1C4E9',
      iconColor: '#673AB7'
    },
    {
      id: 6,
      title: 'Creative & Fun',
      subtitle: 'Uplifting',
      description: 'DIY art, painting, cooking, music, reading',
      icon: 'color-palette',
      bgColor: '#F8BBD9',
      iconColor: '#E91E63'
    }
  ];

  const ActivityCard = ({ activity }) => {
    const handleCardPress = () => {
      if (activity.id === 1) {
        // Navigate to Self-Care screen using Expo Router
        router.push('/activity_suggestions/mind_fulness');
      }
    };

    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: activity.bgColor }]}
        onPress={handleCardPress}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={activity.icon} size={24} color={activity.iconColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{activity.title}</Text>
            <Text style={styles.subtitle}>{activity.subtitle}</Text>
            {activity.description ? (
              <Text style={styles.description}>{activity.description}</Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activities</Text>
        <Text style={styles.headerSubtitle}>
          Browse or select different kinds{'\n'}of activities manually.
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <ActivityCard activity={activities[0]} />
            </View>
            <View style={styles.rightColumn}>
              <ActivityCard activity={activities[1]} />
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <ActivityCard activity={activities[2]} />
            </View>
            <View style={styles.rightColumn}>
              <ActivityCard activity={activities[3]} />
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <ActivityCard activity={activities[4]} />
            </View>
            <View style={styles.rightColumn}>
              <ActivityCard activity={activities[5]} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8997A',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  grid: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  leftColumn: {
    flex: 1,
    marginRight: 7.5,
  },
  rightColumn: {
    flex: 1,
    marginLeft: 7.5,
  },
  card: {
    borderRadius: 15,
    padding: 15,
    minHeight: 120,
    justifyContent: 'flex-start',
  },
  cardContent: {
    flex: 1,
  },
  iconContainer: {
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
});

export default ActivitiesScreen;