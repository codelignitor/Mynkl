import React, { useState, useRef, useEffect } from 'react'; 
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import SearchIcon from '../../../assets/svgs/SerachIcon';
import * as SplashScreen from 'expo-splash-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import MoodSelector from '@/src/components/mood/MoodSelector';
// Data
import { moodsData } from '../../../utils/moodsData';
import { selfCareTipsData } from '../../../utils/selfCareData';

// Styles
import { styles } from '../../../screenStyles/styles';
import { useHome } from '../../../screenHooks/_useHome';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { useMoodMap } from '../../../screenHooks/_useMoodMap';

const MoodMapScreen = () => {
  const router = useRouter();
  const {
    openToTalk,
    isLoading,
    updateOpenToTalkHandler,
    moveToScreen,
    selectedMood,
    setSelectedMood,
    handleSubmitAddCheckin
  } = useHome();

  const [checkedIn, setCheckedIn] = useState(false);
  const [squareWidth, setSquareWidth] = useState(0);
  const squareRef = useRef(null);
  const username = useSelector((state: RootState) => state.auth.username);

  const [selectedSections, setSelectedSections] = useState({
    moodMap: false,
    hugs: false,
    activities: false
  });

  useEffect(() => {
    const measureSquare = () => {
      if (squareRef.current) {
        try {
          squareRef.current.measure((x, y, width, height, pageX, pageY) => {
            if (width > 0) {
              setSquareWidth(width);
            }
          });
        } catch (error) {
          console.log('Error measuring square:', error);
        }
      }
    };

    const timer = setTimeout(measureSquare, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleMoodSelection = (mood) => {
    handleSubmitAddCheckin(mood);
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
    router.push('/addCheckIn');
  };

  const handleSectionSelect = (section) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNotificationsPress = () => {
    console.log('Notifications pressed');
  };

  const currentEmoji = selectedMood
    ? moodsData.find((mood) => mood.id === selectedMood)?.emoji
    : null;

  const handleSquareLayout = () => {
    setTimeout(() => {
      if (squareRef.current) {
        try {
          squareRef.current.measure((x, y, width, height, pageX, pageY) => {
            if (width > 0) {
              setSquareWidth(width);
            }
          });
        } catch (error) {
          console.log('Error in onLayout measurement:', error);
        }
      }
    }, 200);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <ActivityIndicator />}
      <ScrollView contentContainerStyle={[styles.contentContainer, { flexGrow: 1 }]}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.header}>Hello, {username}</Text>
          </View>
          <TouchableOpacity 
            style={styles.bellIconContainer} 
            onPress={handleNotificationsPress}
          >
            <Icon name="bell-outline" size={25} color="#ffffff" style={styles.bellIcon} />
          </TouchableOpacity>
        </View>

       {/* { !selectedMood ?
      <>
      */}

        <Text style={styles.headerSection}>How are you feeling?</Text>

        {/* Mood Selection */}
        <MoodSelector 
          moods={moodsData} 
          selectedMood={selectedMood} 
          handleMoodSelection={handleMoodSelection} 
        />

         {/* </> :
          <Text style={styles.headerSection}>I am feeling {selectedMood}</Text>
}
         */}
        {/* Row for sections with related dimensions */}
        <View style={styles.rowContainer}>
          <TouchableOpacity 
            style={[
              styles.rectangularCard, 
              squareWidth > 0 && { height: squareWidth }
            ]} 
            onPress={handleCheckIn}
          >
            <Text style={styles.statusCardTitle}>Check-in</Text>
            <View style={styles.dotsContainer}>
              <View style={styles.lightDot} />
              <View style={styles.lightDot} />
              <View style={styles.darkDot} />
              <View style={styles.darkDot} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.squareCard}
            ref={squareRef}
            onLayout={handleSquareLayout}
            onPress={() => router.push('/Opentotalk/StartChat')}
          >
            <Text style={styles.statusCardTitle}>Open to Talk</Text>
            <View style={styles.singleDotContainer}>
              <View style={[openToTalk ? styles.greenDot : styles.lightDot]} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.rowContainer}>
          <TouchableOpacity 
            style={[
              styles.appIconCard, 
              selectedSections.moodMap && { backgroundColor: '#b7c2cc' }
            ]}
            onPress={() => {
              moveToScreen('/moodMap');
            }}
          >
            <View style={styles.iconContainer}>
              <Icon name="map-marker" size={24} color="#4287f5" />
            </View>
            <Text style={styles.appIconText}>MoodMap</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.appIconCard, 
              selectedSections.hugs && { backgroundColor: '#b7c2cc' }
            ]}
            onPress={() => moveToScreen('/donation_hugs')}
          >
            <View style={styles.iconContainer}>
              <Icon name="heart" size={24} color="#ff4f8b" />
            </View>
            <Text style={styles.appIconText}>Hugs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSectionContainer}>
          <TouchableOpacity 
            style={[
              styles.largeMenuCard,
              selectedSections.activities && { backgroundColor: '#b7c2cc' }
            ]}
            onPress={() => moveToScreen('/activity_suggestions/suggestions/activity_suggestion')}
          >
            <View style={styles.largeMenuCardContent}>
              <View style={styles.largeMenuIconContainer}>
                <Icon name="run" size={28} color="#ffffff" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.largeMenuCardTitle}>Activities</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#8c8c8c" style={styles.chevronIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.menuSectionContainer, { marginTop: 4, marginBottom: 38 }]}>
          <TouchableOpacity 
            style={[styles.largeMenuCard, { backgroundColor: '#b7c2cc' }]}
            onPress={() => { 
              router.push({
                pathname: '/Check_Ins/mood_check-in',
                params: { data: JSON.stringify(selectedMood) }
              });
            }}
          >
            <View style={styles.largeMenuCardContent}>
              <View style={styles.largeMenuIconContainer}>
                <Icon name="pin" size={28} color="#ffffff" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.largeMenuCardTitle}>CheckIn Analysis</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#8c8c8c" style={styles.chevronIcon} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodMapScreen;
