import { useMoodMap } from '@/src/screenHooks/_useMoodMap';
import React from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useMood } from '@/src/contexts/MoodContext';
// import { useAppContext } from '@/src/contexts/AppContext';

const screenWidth = Dimensions.get('window').width;

export default function MoodTrendsChart() {
  const { entries } = useMood();

  // Convert mood entries → sorted list
  const parsed = Object.keys(entries)
    .filter(d => d.startsWith("2025-11")) // filter month
    .sort()
    .map(date => {
      const day = parseInt(date.split("-")[2]);
      return {
        day,
        value: entries[date].value,
        emoji: entries[date].emoji,
        mood: entries[date].mood,
      };
    });

  // ChartKit needs arrays for labels + values
  const labels = parsed.map(i => i.day.toString());
  const values = parsed.map(i => i.value);

  const chartData = {
    labels: labels.length > 0 ? labels : [" "],
    datasets: [
      {
        data: values.length > 0 ? values : [0],
        color: () => '#1E90FF',
        strokeWidth: 2,
      },
    ],
  };

  return (
    <> 
      {/* This is your header section */}
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Mood Diary</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Entries</Text>
        </TouchableOpacity>
      </View>
      
      {/* Mood Trends */}
      <View style={styles.wrapper}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Mood Trends — Nov 2025</Text>

        <LineChart
          data={chartData}
          width={screenWidth * 0.9 - 20}

          height={160}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#1E90FF',
            },
          }}
          bezier
          style={{
            borderRadius: 16,
          }}
        />

        {/* OPTIONAL: Show emojis under chart */}
        <View style={styles.emojiRow}>
          {parsed.map(item => (
            <Text key={item.day} style={styles.emoji}>
              {item.emoji}
            </Text>
          ))}
        </View>
      </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 20, paddingTop: 50 },
  mainTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },

  chartContainer: {
  backgroundColor: "white",
  padding: 12,
  borderRadius: 12,
  marginVertical: 20,
  width: "94%",
  alignSelf: "center",
  overflow: "hidden",   // <-- IMPORTANT FIX
},
wrapper: {
  alignItems: "center",
},

  chartTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10 },

  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 10,
  },
  emoji: { fontSize: 20 },

  button: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: { fontSize: 16, fontWeight: '500' },
});

