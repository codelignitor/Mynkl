import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import styles from './style';
import useInsights from '../../../screenHooks/_useInsights';

const screenWidth = Dimensions.get('window').width;

const InsightsScreen = () => {
  const router = useRouter();
  const { moodChartData, chartConfig, suggestions } = useInsights();

  return (
    <LinearGradient
      colors={["#0a2323", "#1b2d3a", "#1b3a2a", "#0a2323"]}
      locations={[0, 0.4, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/Opentotalk/feedback')}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.header}>mynkl</Text>
        <Text style={styles.title}>Insights & Connections</Text>

        {/* Weekly Mood Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Weekly Mood</Text>
          <View style={styles.moodRow}>
            <Text style={styles.emoji}>😊</Text>
            <Text style={styles.emoji}>😐</Text>
            <Text style={styles.emoji}>😞</Text>
          </View>
          <View style={{ alignItems: 'center', marginTop: 8 }}>
            <LineChart
              data={moodChartData}
              width={screenWidth - 60}
              height={120}
              chartConfig={chartConfig}
              bezier
              withDots={true}
              withShadow={false}
              withInnerLines={false}
              withOuterLines={false}
              style={{ borderRadius: 12 }}
            />
          </View>
          <View style={styles.graphLabels}>
            <Text style={styles.graphLabel}>Before</Text>
            <Text style={styles.graphLabel}>After</Text>
          </View>
        </View>

        {/* Engagement Tracker Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Engagement Tracker</Text>
          <View style={styles.engagementRow}>
            <Text style={styles.engagementLabel}>Chats</Text>
            <Text style={styles.engagementLabel}>
              Positive Matches <Text style={styles.engagementValue}>5</Text>
            </Text>
          </View>
        </View>

        {/* AI Suggestions Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Suggestions</Text>
          {suggestions.map((s, i) => (
            <View key={i} style={styles.suggestionBox}>
              <Text style={styles.suggestionText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Report/Block Options */}
        <View style={styles.reportRow}>
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color="#b3b3b3"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.reportText}>Report/Block Options</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default InsightsScreen;
