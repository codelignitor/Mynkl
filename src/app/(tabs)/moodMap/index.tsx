import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { styles } from '../../../screenStyles/moodMap/_index.style';
import { useMoodMap } from '../../../screenHooks/_useMoodMap';
import { moodsData } from '../../../utils/moodsData';
import MoodMapView from '@/src/components/map/MoodMapView';
import SearchInput from '@/src/components/common/searchInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import MoodSelector from '@/src/components/mood/MoodSelector';
import Happy from '../../../assets/svgs/happy-icon.svg';
const MoodMapScreen: React.FC = () => {
  const { hugs, searchInput, setSearchInput, moodData, mapRegion, setMapRegion , loading  , callBackMapHandler , currentMarkedLocation ,selectedMood, setSelectedMood ,handleMoodSelection , highlightedPlaceHandler} = useMoodMap();

  React.useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log('Location:', location);
      setMapRegion((prev) => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));

      

      
    })();
  }, []);


  const handleMood = (moodId: string) => {
    if(moodId === selectedMood) {
      setSelectedMood('');
      handleMoodSelection('');
      return;
    }
    setSelectedMood(moodId);
    if(moodId?.name ==='Lonely')
    {
      handleMoodSelection('alone');
    return
  }
    
    handleMoodSelection(moodId?.name);

  console.log('Map Region:', mapRegion);
  }

  const currentLocations = selectedMood
    ? moodsData.find((mood) => mood.id === selectedMood)?.locations || []
    : [];

  const currentEmoji = selectedMood
    ? moodsData.find((mood) => mood.id === selectedMood)?.emoji
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <SearchInput
        onChangeText={(text) => setSearchInput(text)}
        value={searchInput}
        placeholder={"Mood Map"}
      />
     {loading && <ActivityIndicator size={'large'}/>
}

      
 <MoodSelector
          moods={moodsData} 
          selectedMood={selectedMood?.id} 
          handleMoodSelection={handleMood} 
        />   
      
      <MoodMapView
        callback={callBackMapHandler}
        mapContainerStyle={styles.mapContainerStyle}
        mapRegion={mapRegion}
        selectedMood={selectedMood?.id}
        currentLocations={moodData}
        currentEmoji={currentEmoji}
        backgroundColor={undefined}
      />

     { currentMarkedLocation  && (
      <View style={styles.activitiesContainer}>
       { currentMarkedLocation?.type === 'event' &&
       <>
      
        <View style={styles.rowContiner}>
          <Text style={styles.activitiesLabel}>Activities</Text>
          <TouchableOpacity onPress={()=> router.push('/activity')}>
          <Text style={styles.seeMore}>See More</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={()=> router.push(`/activities/${currentMarkedLocation?.event?.id}`)} style={styles.activityContainer}>
          <Image
            style={{
              height: 132,
              width: 122,
              borderTopLeftRadius: 32,
              borderBottomLeftRadius: 32,
            }}
            source={currentMarkedLocation?.event?.event_image ? {uri:currentMarkedLocation?.event?.event_image} :  require('../../../assets/images/party_pic.jpg')}
          />
          <View style={styles.activityDetailsContainer}>
            <Text style={styles.activityLabel}>{currentMarkedLocation?.name}</Text>
            {/* <Text style={styles.timeLabel}>10:00 PM · Sodal</Text> */}
          </View>
          <View style={{ position: 'absolute', right: 16 }}>
          <Ionicons name="arrow-forward-sharp" size={24} color={'#000'} />
          </View>
        </TouchableOpacity>
         </>
}
 { currentMarkedLocation?.type === 'place' &&
    <View style={{ marginTop: 8, alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 22, textAlign: 'center' }}>
        Is this place helping your mood?
      </Text>
       <View style={{ backgroundColor: '#f2f2f2', borderRadius: 8, padding: 12, marginBottom: 4 , marginTop: 8 }}>
          <Text style={{ fontSize: 15 }}>{currentMarkedLocation?.name || 'Place name here'}</Text>
                    <Text style={{ fontSize: 15 }}>{currentMarkedLocation?.description || 'Description here'}</Text>

        </View>
   
      <TouchableOpacity onPress={highlightedPlaceHandler} style={{ marginTop: 2 }}>
        <Image
          source={require('../../../assets/images/happy-icon.png')}
          style={{ width: 68, height: 68 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
}

{currentMarkedLocation?.type === 'user' && (
  <View style={{ marginTop: 8, alignItems: 'center' }}>
    <Text style={{ fontWeight: 'bold', fontSize: 22, textAlign: 'center' }}>
      Nearby user
    </Text>
    <View style={{ backgroundColor: '#f2f2f2', borderRadius: 8, padding: 12, marginBottom: 4, marginTop: 8, alignItems: 'center' }}>
      <Text style={{ fontSize: 15 }}>{currentMarkedLocation?.description || 'User description'}</Text>
    </View>
    <View style={{ flexDirection: 'row', marginTop: 12 }}>
      <TouchableOpacity
        style={{
          backgroundColor: '#4F8EF7',
          paddingVertical: 10,
          paddingHorizontal: 24,
          borderRadius: 24,
          marginRight: 12,
        }}
        onPress={() => {
          // Handle chat action
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: '#FFD700',
          paddingVertical: 10,
          paddingHorizontal: 24,
          borderRadius: 24,
        }}
        onPress={() => {
          // Handle send hug action
        }}
      >
        <Text style={{ color: '#333', fontWeight: 'bold' }}>Send Hug</Text>
      </TouchableOpacity>
    </View>
  </View>
)}
      </View>
      )}
    </SafeAreaView>
  );
};

export default MoodMapScreen;
