import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Calendar } from 'react-native-calendars';
import { useMood } from '@/src/contexts/MoodContext';
import MoodIcon from '../MoodIcons/moodIcons';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

const moodColors = {
  happy: "#FFD700",      
  calm: "#09ededff",       
  stressed: "#8A2BE2",   
  grateful: "#32CD32",   
  sad: "#5226cdff",        
  lonely: "#00b3ffff",     
  frustrated: "#FF6347", 
  excited: "#FFD700",    
  Unknown: "#CCCCCC",
};

export default function MoodTrendsChart() {
  const { entries, refetchCalendar, loading, error, setSelectedDate } = useMood();
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
  const router = useRouter();

  const getCurrentMonthYear = (offset = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      dateObj: date
    };
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonthData = getCurrentMonthYear(currentMonthOffset);
  const currentMonthName = monthNames[currentMonthData.month];
  const currentYear = currentMonthData.year;
  
  // Fetch data whenever month offset changes
  useEffect(() => {
    const monthData = getCurrentMonthYear(currentMonthOffset);
    // API expects month as 1-12, not 0-11
    refetchCalendar(monthData.year, monthData.month + 1);
  }, [currentMonthOffset]);

  const getMonthEntries = () => {
    const monthPrefix = `${currentYear}-${(currentMonthData.month + 1).toString().padStart(2, '0')}`;
    
    return Object.keys(entries)
      .filter(dateKey => dateKey.startsWith(monthPrefix))
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
  };

  const parsed = getMonthEntries();
  
  const labels = parsed.map(i => i.day.toString());
  const values = parsed.map(i => i.value);
  
  const chartData = {
    labels: labels.length > 0 ? labels : [" "],
    datasets: [
      {
        data: values.length > 0 ? values : [0],
        color: () => '#2B4A7F',
        strokeWidth: 3,
      },
    ],
  };

  const handlePreviousMonth = () => {
    setCurrentMonthOffset(prev => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonthOffset(prev => prev + 1);
  };

  const isNextMonthInFuture = () => {
    const now = new Date();
    const nextMonth = getCurrentMonthYear(currentMonthOffset + 1);
    return (
      nextMonth.year > now.getFullYear() ||
      (nextMonth.year === now.getFullYear() && nextMonth.month > now.getMonth())
    );
  };

  // Convert entries → calendar dots
  const markedDates: Record<string, { dots: { color: string }[] }> = {};
  Object.keys(entries).forEach((date) => {
    const mood = entries[date].mood as keyof typeof moodColors;
    markedDates[date] = {
      dots: [{ color: moodColors[mood] || moodColors.Unknown }],
    };
  });

  function onDayPress(day: { dateString: string }) {
    const entry = entries[day.dateString];
    setSelectedDate(day.dateString);
    
    router.push({
      pathname: '/mood_diary/[date]',
      params: { date: day.dateString }
    });
  }

  // Get current date string for calendar display (YYYY-MM format)
  const currentCalendarMonth = `${currentYear}-${(currentMonthData.month + 1).toString().padStart(2, '0')}`;

  return (
    <> 
      <View style={styles.header}>
        {/* <Text style={styles.mainTitle}>Mood Diary</Text> */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Entries</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.wrapper}>
        {/* Month Navigation */}
        <View style={styles.monthNavigationContainer}>
          <TouchableOpacity 
            onPress={handlePreviousMonth}
            style={styles.navButton}
            disabled={loading}
          >
            <Ionicons name="chevron-back" size={24} color={loading ? "#CCCCCC" : "#2B4A7F"} />
          </TouchableOpacity>
          
          <Text style={styles.sectionTitle}>
            Mood Trends — {currentMonthName} {currentYear}
          </Text>
          
          <TouchableOpacity 
            onPress={handleNextMonth}
            style={styles.navButton}
            disabled={isNextMonthInFuture() || loading}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={isNextMonthInFuture() || loading ? "#CCCCCC" : "#2B4A7F"} 
            />
          </TouchableOpacity>
        </View>

        {/* Chart Section */}
        <View style={styles.chartContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <>
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
                withHorizontalLabels={false}
                style={styles.chart}
              />

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.moodIconsScrollView}
                contentContainerStyle={styles.moodIconsScrollContent}
              >
                {parsed.map(item => (
                  <View key={item.date} style={styles.moodIconContainer}>
                    <MoodIcon 
                      mood={item.mood} 
                      size="small"
                    />
                    <Text style={styles.dayText}>{item.day}</Text>
                  </View>
                ))}
              </ScrollView>
              
              {parsed.length === 0 && (
                <View style={styles.noEntriesContainer}>
                  <Text style={styles.noEntriesText}>
                    No mood entries for {currentMonthName} {currentYear}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1E90FF" />
              <Text style={styles.loadingText}>Loading mood calendar...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error loading calendar</Text>
              <TouchableOpacity style={styles.retryButton} onPress={refetchCalendar}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Calendar
              key={currentCalendarMonth} // Force re-render when month changes
              current={currentCalendarMonth}
              markingType="multi-dot"
              markedDates={markedDates}
              onDayPress={onDayPress}
              enableSwipeMonths={false} // Disable swipe to use arrow navigation only
              hideArrows={true} // Hide calendar's own arrows since we have custom ones
            />
          )}
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
  monthNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '94%',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1a2a3a',
    textAlign: 'center',
    flex: 1,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarContainer: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginVertical: 10,
    width: "94%",
  },
  chartContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    width: "94%",
    overflow: "hidden",
    minHeight: 250,
  },
  wrapper: {
    alignItems: "center",
  },
  chart: {
    borderRadius: 16,
    marginLeft: -35,
  },
  moodIconsScrollView: {
    marginTop: 20,
    width: '100%',
  },
  moodIconsScrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  moodIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    minWidth: 40,
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
  noEntriesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 20,
  },
  noEntriesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
});