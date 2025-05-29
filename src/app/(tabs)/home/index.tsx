import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import SearchIcon from '../../../assets/svgs/SerachIcon'
import * as SplashScreen from 'expo-splash-screen';
// You'll need to import icons
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



const MoodMapScreen = () => {
  const router = useRouter();
  const {openToTalk ,isLoading ,  updateOpenToTalkHandler , moveToScreen ,selectedMood, setSelectedMood } = useHome();
  // State
  
  const [checkedIn, setCheckedIn] = useState(false);
  const [squareWidth, setSquareWidth] = useState(0);
  const squareRef = useRef(null);
      const username  = useSelector((state: RootState) => state.auth.username);

  // State to track selected sections
  const [selectedSections, setSelectedSections] = useState({
    moodMap: false,
    hugs: false,
    activities: false
  });

  // Effect to measure the square's width after layout
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

    // Delay the measurement to ensure the component is rendered
    const timer = setTimeout(measureSquare, 300);
    
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  // Handlers
  const handleMoodSelection = (id) => {
    // setSelectedMood(id);
     router.push('/addCheckIn')

  };

  const handleCheckIn = () => {
    setCheckedIn(true);
    router.push('/checkIns')
  };



  // Handler for section selection
  const handleSectionSelect = (section) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Notifications handler
  const handleNotificationsPress = () => {
    // Add your notifications logic here
    console.log('Notifications pressed');
    // You can navigate to notifications screen or show a modal here
  };



  // Computed values
  const currentEmoji = selectedMood
    ? moodsData.find((mood) => mood.id === selectedMood)?.emoji
    : null;

  // Handle layout change for the square
  const handleSquareLayout = () => {
    // Wait a bit to ensure the component is fully rendered
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
       {isLoading &&<ActivityIndicator/>}
      <ScrollView contentContainerStyle={[styles.contentContainer, { flexGrow: 1 }]}>
        {/* Header with notification bell */}
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

       { !selectedMood ?
      <>
     

        <Text style={styles.headerSection}>How are you feeling?</Text>

        {/* Mood Selection */}
        <MoodSelector 
          moods={moodsData} 
          selectedMood={selectedMood} 
          handleMoodSelection={handleMoodSelection} 
        />

         </> :
          <Text style={styles.headerSection}>I am feeling {selectedMood}</Text>
}
        
        {/* Row for sections with related dimensions */}
        <View style={styles.rowContainer}>
          {/* Check-in Section - Height will match square width */}
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
          
          {/* Open to Talk Section - Square */}
          <TouchableOpacity 
            style={styles.squareCard}
            ref={squareRef}
            onLayout={handleSquareLayout}
            onPress={updateOpenToTalkHandler}
          >
            <Text style={styles.statusCardTitle}>Open to Talk</Text>
            <View style={styles.singleDotContainer}>
              <View style={[openToTalk ?styles.greenDot : styles.lightDot]} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Second Row - App Icon Style Sections with color change on click */}
        <View style={styles.rowContainer}>
          {/* MoodMap Icon Style Section */}
          <TouchableOpacity 
            style={[
              styles.appIconCard, 
              selectedSections.moodMap && { backgroundColor: '#b7c2cc' }
            ]}
            onPress={()=> moveToScreen('/moodMap')}
          >
            <View style={styles.iconContainer}>
              <Icon name="map-marker" size={24} color="#4287f5" />
            </View>
            <Text style={styles.appIconText}>MoodMap</Text>
          </TouchableOpacity>
          
          {/* Hugs Icon Style Section */}
          <TouchableOpacity 
            style={[
              styles.appIconCard, 
              selectedSections.hugs && { backgroundColor: '#b7c2cc' }
            ]}
            onPress={()=> moveToScreen('/hugs')}
          >
            <View style={styles.iconContainer}>
              <Icon name="heart" size={24} color="#ff4f8b" />
            </View>
            <Text style={styles.appIconText}>Hugs</Text>
          </TouchableOpacity>
        </View>
        
        {/* Activities Section - Menu style with larger size */}
        <View style={styles.menuSectionContainer}>
          <TouchableOpacity 
            style={[
              styles.largeMenuCard,
              selectedSections.activities && { backgroundColor: '#b7c2cc' }
            ]}
           onPress={()=> moveToScreen('/activity')}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodMapScreen;