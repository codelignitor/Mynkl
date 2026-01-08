import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  Image 
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import {weatherGraph } from '@/src/services/apis';


/* ─────────── Weather Enum ──────────── */
enum WeatherType {
  Sunny = "Sunny",
  Cloudy = "Cloudy",
  Foggy = "Foggy",
  Drizzle = "Drizzle",
  Rainy = "Rainy",
  FreezingRain = "Freezing Rain",
  Snowy = "Snowy",
  Thunderstorm = "Thunderstorm",
  Clear = "Clear", // Add Clear to enum
}

// Import weather icons
const weatherIcons = {
  Sunny: require("@/src/assets/icons/Sunny.png"),
  Cloudy: require("@/src/assets/icons/Cloudy.png"),
  Foggy: require("@/src/assets/icons/Cloudy.png"),
  Drizzle: require("@/src/assets/icons/Rainy.png"),
  Rainy: require("@/src/assets/icons/Rainy.png"),
  Snowy: require("@/src/assets/icons/Snowy.png"),
  Thunderstorm: require("@/src/assets/icons/Lightning.png"),
  Clear: require("@/src/assets/icons/Sunny.png"), // Map Clear to Sunny icon
};

/* ─────────── Mood → Value Mapping ──────────── */
const moodToValue = (mood?: string | null) => {
  switch (mood?.toLowerCase()) {
    case "happy": return 8;
    case "calm": return 7;
    case "neutral": return 5;
    case "sad": return 3;
    case "lonely": return 3;
    case "frustrated": return 2;
    case "stressed": return 2;
    default: return 5;
  }
};

/* ─────────── Weather Tag Component ──────────── */
const WeatherTag = ({ weather, timestamp }: { weather?: string | null; timestamp?: string }) => {
  if (!weather) return null;

  const iconSource = weatherIcons[weather as keyof typeof weatherIcons] || weatherIcons.Sunny;

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}`; // Day/Month
    } catch {
      return '';
    }
  };

  return (
    <View style={styles.tagContainer}>
      {iconSource && (
        <Image 
          source={iconSource} 
          style={styles.weatherIcon}
          resizeMode="contain"
        />
      )}
      {timestamp && (
        <Text style={styles.dateText}>{formatDate(timestamp)}</Text>
      )}
    </View>
  );
};

const WeatherScreen = () => {
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState([]);
  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    fetchWeatherAnalysis();
  }, []);

  const fetchWeatherAnalysis = async () => {
    try {
      const data = await weatherGraph();

      setGraphData(data.graph_data ?? []);
      setAiMessage(data.ai_interpretation ?? "No interpretation available.");
    } catch (error) {
      console.log("API Error:", error);
      setAiMessage("Unable to load insights right now.");
    } finally {
      setLoading(false);
    }
  };

  const chartPoints = graphData.map((item) => moodToValue(item.mood));

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
     <LinearGradient colors={["#8fd3f4", "#84fab0"]} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        <Text style={styles.title}>Weather</Text>
        <Text style={styles.subtitle}>Rain or shine = mood decline.</Text>
        <Text style={styles.sectionTitle}>Past 30 Days</Text>

        {graphData.length > 0 ? (
          <LineChart
            data={{
              labels: graphData.map(() => ""),
              datasets: [{ data: chartPoints }],
            }}
            width={Dimensions.get("window").width * 0.9}
            height={160}
            withVerticalLabels={true}
            withHorizontalLabels={false}
            withInnerLines={false}
            withOuterLines={true}
            chartConfig={{
              color: () => `rgba(255,255,255,1)`,
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              fillShadowGradientOpacity: 0,
            }}
            bezier
            style={styles.chart}
          />
        ) : (
          <Text style={styles.noData}>No chart data available</Text>
        )}

        {/* Horizontal Scrollable Weather Icons */}
        <View style={styles.weatherScrollContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {graphData.length > 0 ? (
              graphData.map((item, index) => (
                <WeatherTag 
                  key={index} 
                  weather={item.weather} 
                  timestamp={item.timestamp}
                />
              ))
            ) : (
              <Text style={styles.noData}>No weather data available</Text>
            )}
          </ScrollView>
        </View>

        {/* AI Insight Box */}
        <View style={styles.aiBox}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI+</Text>
          </View>
          <Text style={styles.aiMessage}>{aiMessage}</Text>
        </View>

        {/* Bottom Tabs */}
        <View style={styles.tabRow}>
          {["Sleep", "Activities", "Weather", "Social"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, tab === "Weather" && styles.activeTab]}
            >
              <Text style={[styles.tabText, tab === "Weather" && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

/* ─────────── Styles ──────────── */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 70 
  },
  scrollContent: { 
    alignItems: "center",
    paddingBottom: 30,
  },
  loader: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  title: { 
    fontSize: 30, 
    fontWeight: "800", 
    color: "#012b4e" 
  },
  subtitle: { 
    fontSize: 14, 
    color: "#01385d90", 
    marginBottom: 15 
  },
  sectionTitle: { 
    color: "#01385d", 
    fontWeight: "600",
    marginBottom: 10,
  },
  chart: { 
    marginVertical: 10, 
    borderRadius: 16, 
    marginLeft: -50
  },
  noData: { 
    color: "#01385d", 
    marginTop: 8 
  },
  
  /* Weather Scroll Container */
  weatherScrollContainer: {
    width: Dimensions.get('window').width - 40, // Full width minus padding
    height: 80, // Fixed height for scroll area
    marginVertical: 12,
  },
  horizontalScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  
  /* Weather Tag */
  tagContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 50, // Minimum width for each tag
  },
  weatherIcon: {
    width: 39,
    height: 39,
  },
  dateText: {
    fontSize: 10,
    color: "#01385d",
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  tagText: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: "#01385d" 
  },

  /* AI Box */
  aiBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.55)",
    padding: 15,
    width: "88%",
    borderRadius: 14,
    marginTop: 20,
    marginBottom: 10,
  },
  aiBadge: {
    backgroundColor: "#ff6b3d",
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  aiBadgeText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 12,
  },
  aiMessage: { 
    flex: 1, 
    color: "#012b4e", 
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
  },

  /* Tabs */
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginTop: 25,
    marginBottom: 30
  },
  tab: {
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  activeTab: { 
    backgroundColor: "#007aff" 
  },
  tabText: { 
    color: "#00284a", 
    fontWeight: "500" 
  },
  activeTabText: { 
    color: "#fff" 
  },
});

export default WeatherScreen;