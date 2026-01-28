import React, { useState, useEffect } from 'react';
import { 
  View, Text, Dimensions, StyleSheet, TouchableOpacity, 
  ScrollView, ActivityIndicator 
} from 'react-native';
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
  
  useEffect(() => {
    const monthData = getCurrentMonthYear(currentMonthOffset);
    refetchCalendar(monthData.year, monthData.month + 1);
  }, [currentMonthOffset]);

  const getMonthEntries = () => {
    const monthPrefix = `${currentYear}-${(currentMonthData.month + 1).toString().padStart(2, '0')}`;
    
    return Object.keys(entries)
      .filter(dateKey => dateKey.startsWith(monthPrefix))
      .sort()
      .map(date => {
        const day = parseInt(date.split("-")[2]);
        const entry = entries[date];
        return {
          day,
          value: entry.value || 5,
          mood: entry.mood,
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
        data: values.length > 0 ? values : [5],
        color: () => '#2B4A7F',
        strokeWidth: 2,
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

  const currentCalendarMonth = `${currentYear}-${(currentMonthData.month + 1).toString().padStart(2, '0')}`;

  return (
    <> 
      <View style={styles.header}>
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

        {/* Chart Card */}
        <View style={styles.chartCard}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <>
              {/* Main Content Row */}
              <View style={styles.chartRow}>
                {/* Chart Area */}
                <View style={styles.chartArea}>
                  <LineChart
                    data={chartData}
                    width={screenWidth * 0.76}
                    height={200}
                    chartConfig={{
                      backgroundGradientFrom: '#fff',
                      backgroundGradientTo: '#fff',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(43, 74, 127, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#fff',
                      },
                      propsForLabels: {
                        fontSize: 10,
                      },
                      propsForVerticalLabels: {
                        fontSize: 10,
                        dy: 5,
                      },
                      propsForHorizontalLabels: {
                        fontSize: 10,
                        dx: -8,
                      },
                      propsForBackgroundLines: {
                        strokeWidth: 1,
                        stroke: '#e0e0e0',
                      },
                    }}
                    bezier
                    withVerticalLines={false}
                    withHorizontalLines={true}
                    withHorizontalLabels={false}

                    withInnerLines={false}
                    withOuterLines={false}
                    fromZero={false}
                    segments={4}
                    // formatYLabel={(value) => {
                    //   const num = parseFloat(value);
                    //   return num % 1 === 0 ? num.toString() : num.toFixed(0);
                    // }}
                    style={styles.chart}
                    decorator={() => {
                      return parsed.map((item, index) => {
                        if (labels.length <= 1) return null;
                        
                        const xPosition = (index / (labels.length - 1)) * (screenWidth * 0.7 - 60) + 30;
                        const yPosition = 200 - ((item.value - 0) / (10 - 0)) * 180;
                        
                        const mood = item.mood as keyof typeof moodColors;
                        const dotColor = moodColors[mood] || '#CCCCCC';
                        
                        return (
                          <View
                            key={index}
                            // style={[
                            //   styles.customDot,
                            //   {
                            //     left: xPosition - 6,
                            //     top: yPosition - 6,
                            //     backgroundColor: dotColor,
                            //     borderColor: '#fff',
                            //   }
                            // ]}
                          />
                        );
                      });
                    }}
                  />
                </View>
                
                {/* Vertical Emoji List - Only emojis */}
                <View style={styles.emojiListContainer}>
                  {/* <ScrollView 
                    showsVerticalScrollIndicator={false}
                    style={styles.emojiScrollView}
                    contentContainerStyle={styles.emojiScrollContent}
                  >
                    {parsed.map((item, index) => (
                      <View key={index} style={styles.emojiItem}>
                        <MoodIcon 
                          mood={item.mood} 
                          size="small"
                        />
                      </View>
                    ))}
                    
                    {parsed.length === 0 && (
                      <View style={styles.noEmojiContainer}>
                        <Text style={styles.noEmojiText}>No entries</Text>
                      </View>
                    )}
                  </ScrollView> */}
                  <View style={styles.staticEmojiColumn}>
    <MoodIcon mood="happy" size="medium" />
    <MoodIcon mood="calm" size="medium" />
    <MoodIcon mood="lonely" size="medium" />
  </View>
                </View>
              </View>
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
              key={currentCalendarMonth}
              current={currentCalendarMonth}
              markingType="multi-dot"
              markedDates={markedDates}
              onDayPress={onDayPress}
              enableSwipeMonths={false}
              hideArrows={true}
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
  chartCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
    width: "96%",
    minHeight: 260,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    // elevation: 5,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 200,
  },
  chartArea: {
    flex: 1,
    marginRight: 8,
    alignItems: 'flex-start',
  },
  chart: {
    borderRadius: 18,
    marginLeft: -18,
  },
  customDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    zIndex: 10,
  },
  emojiListContainer: {
    width: 40,
    height: 150,
    borderLeftWidth: 0.5,
    borderLeftColor: '#efeded',
    paddingLeft: 8,
    paddingTop: 12
  },
  staticEmojiColumn: {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
},
  emojiScrollView: {
    // height: 200,
  },
  emojiScrollContent: {
    // paddingRight: 4,
    alignItems: 'center',
  },
  emojiItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingVertical: 4,
    width: 40,
  },
  noEmojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  noEmojiText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  xAxisContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // marginTop: 8,
    // paddingHorizontal: 10,
    // paddingLeft: 20,
  },
  xAxisLabel: {
    alignItems: 'center',
    minWidth: 20,
  },
  xAxisText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  calendarContainer: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginVertical: 10,
    width: "96%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wrapper: {
    alignItems: "center",
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