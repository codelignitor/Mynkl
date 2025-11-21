import React from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useMood } from '@/src/contexts/MoodContext';
import MoodIcon from '../MoodIcons/moodIcons';

const screenWidth = Dimensions.get('window').width;

export default function MoodTrendsChart() {
  const { entries } = useMood();

  // Convert mood entries → sorted list
  const parsed = Object.keys(entries)
    .filter(d => d.startsWith("2025"))
    .sort()
    .map(date => {
      const day = parseInt(date.split("-")[2]);
      return {
        day,
        value: entries[date].value,
        mood: entries[date].mood,
        date: date,
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
      {/* Header section */}
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
            width={screenWidth * 0.9}
            height={170}
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

          {/* Optimized MoodIcons row */}
          <View style={styles.moodIconsRow}>
            {parsed.map(item => (
              <View key={item.date} style={styles.moodIconContainer}>
                <MoodIcon 
                  mood={item.mood} 
                  size="small"    //small size 
                />
                <Text style={styles.dayText}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: { 
    alignItems: 'center', 
    marginBottom: 20, 
  },
  mainTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  chartContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    width: "94%",
    overflow: "hidden",
  },
  wrapper: {
    alignItems: "center",
  },
  chartTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 12 
  },
  moodIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Better distribution
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 18,
  },
  moodIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20, // Ensures consistent spacing
  },
  dayText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
    marginTop: 6,
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: { 
    fontSize: 16, 
    fontWeight: '500' 
  },
});