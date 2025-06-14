import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, Animated, ScrollView } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
// import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory-native';

const HugReceivedScreen = () => {
  // State to track hug count and progress
  const [hugStats, setHugStats] = useState({
    received: 12,
    sent: 8,
    streak: 5,
    total: 20
  });

  // Hug history for graph
  const [hugHistory, setHugHistory] = useState([
    { x: 1, y: 5 },
    { x: 2, y: 8 },
    { x: 3, y: 6 },
    { x: 4, y: 10 },
    { x: 5, y: 12 },
  ]);

  const [progressAnim] = useState(new Animated.Value(0));
  const progressPercentage = Math.min((hugStats.received / 50) * 100, 100);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [hugStats.received]);



  const handleSendHugBack = () => {
    // Update stats first
    setHugStats(prev => ({
      ...prev,
      sent: prev.sent + 1,
      total: prev.total + 1
    }));

    setHugHistory(prev => [
      ...prev,
      { x: prev.length + 1, y: hugStats.received + 1 }
    ]);

    // Route to your send hug screen
    // Replace '/your-send-hug-path' with the actual path of your screen
    router.push('/sendHugs')
    
    
    // If you need to pass state to the next screen, you can do:
    // history.push('/your-send-hug-path', { 
    //   hugStats: hugStats,
    //   someOtherData: 'value'
    // });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>mynkl</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.hugIconContainer}>
            <Image source={require('../../../assets/images/HugLogo1.jpg')} style={styles.hugImage} />
          </View>

          <Text style={styles.hugReceivedText}>You received a hug!</Text>

          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              Take things step by step.{'\n'}
              You got this!
            </Text>
          </View>

          <TouchableOpacity style={styles.hugBackButton} onPress={handleSendHugBack}>
            <View style={styles.arrowContainer}>
              <Feather name="chevron-right" size={20} color="white" />
            </View>
            <Text style={styles.hugBackButtonText}>Send a Hug Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.communityButton}>
            <View style={styles.circleContainer}>
              <AntDesign name="plus" size={15} color="white" />
            </View>
            <Text style={styles.communityText}>Community Support</Text>
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Hug Stats</Text>

            <View style={styles.statsSummary}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{hugStats.received}</Text>
                <Text style={styles.statLabel}>Received</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{hugStats.sent}</Text>
                <Text style={styles.statLabel}>Sent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{hugStats.streak}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>
                {hugStats.received}/50 hugs to next level
              </Text>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }
                  ]}
                />
                <View style={[styles.milestone, { left: '25%' }]} />
                <View style={[styles.milestone, { left: '50%' }]} />
                <View style={[styles.milestone, { left: '75%' }]} />
              </View>
            </View>

            <View style={styles.levelContainer}>
              <Text style={styles.levelText}>
                Level {Math.floor(hugStats.total / 50) + 1}
              </Text>
              <Text style={styles.levelDescription}>
                {progressPercentage >= 75
                  ? 'Almost to next level!'
                  : progressPercentage >= 50
                  ? 'Halfway there!'
                  : progressPercentage >= 25
                  ? 'Making progress!'
                  : 'Just getting started!'}
              </Text>
            </View>
          </View>

          {/* Hug Graph */}
          {/* <View style={styles.graphContainer}>
            <Text style={styles.graphTitle}>Hug Progress Over Time</Text>
            <VictoryChart theme={VictoryTheme?.material}>
              <VictoryAxis
                dependentAxis
                tickFormat={(tick) => `${tick}`}
                style={{ tickLabels: { fontSize: 10 } }}
              />
              <VictoryAxis
                tickFormat={(tick) => `Day ${tick}`}
                style={{ tickLabels: { fontSize: 10 } }}
              />
              <VictoryLine
                data={hugHistory}
                interpolation="natural"
                style={{
                  data: { stroke: "#3a4a59", strokeWidth: 2 }
                }}
              />
            </VictoryChart>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f9',
  },
  header: {
    paddingTop: 50,
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    marginTop: 20,
    paddingTop: 20,
    fontSize: 30,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  mainContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  hugIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#a0b2c0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  hugImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  hugReceivedText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#333',
    marginBottom: 25,
  },
  messageBox: {
    backgroundColor: '#e8edf1',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  hugBackButton: {
    backgroundColor: '#3a4a59',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    width: '100%',
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  arrowContainer: {
    marginLeft: 15,
    marginRight: 0,
  },
  hugBackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
    textAlign: 'center',
    paddingRight: 20,
  },
  communityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8edf1',
    borderRadius: 20,
    width: '100%',
    height: 48,
    marginBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  circleContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#374a59',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  communityText: {
    fontSize: 16,
    color: '#374a59',
    fontWeight: '500',
  },
  statsContainer: {
    backgroundColor: '#e8edf1',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    marginTop: 10,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3a4a59',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#d0d8e0',
    borderRadius: 4,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3a4a59',
    borderRadius: 4,
    position: 'absolute',
    left: 0,
  },
  milestone: {
    position: 'absolute',
    width: 4,
    height: 8,
    backgroundColor: '#d0d8e0',
    zIndex: 2,
  },
  levelContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3a4a59',
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  graphContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginTop: 30,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3a4a59',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default HugReceivedScreen;