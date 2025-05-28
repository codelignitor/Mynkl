import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { styles } from '../../../screenStyles/moodMap/_index.style';
import { useMoodMap } from '../../../screenHooks/_useMoodMap';
import { moodsData } from '../../../utils/moodsData';
import MoodMapView from '@/src/components/map/MoodMapView';
import SearchInput from '@/src/components/common/searchInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';

const MoodMapScreen: React.FC = () => {
  const { hugs, searchInput, setSearchInput, moodData, mapRegion, setMapRegion } = useMoodMap();
  const [selectedMood, setSelectedMood] = React.useState(moodsData[3]?.id);

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

      <MoodMapView
        mapContainerStyle={styles.mapContainerStyle}
        mapRegion={mapRegion}
        selectedMood={selectedMood}
        currentLocations={moodData}
        currentEmoji={currentEmoji}
        backgroundColor={undefined}
      />

      <View style={styles.activitiesContainer}>
        <View style={styles.rowContiner}>
          <Text style={styles.activitiesLabel}>Activities</Text>
          <Text style={styles.seeMore}>See More</Text>
        </View>

        <View style={styles.activityContainer}>
          <Image
            style={{
              height: 132,
              width: 122,
              borderTopLeftRadius: 32,
              borderBottomLeftRadius: 32,
            }}
            source={require('../../../assets/images/party_pic.jpg')}
          />
          <View style={styles.activityDetailsContainer}>
            <Text style={styles.activityLabel}>Live Music Mestup</Text>
            <Text style={styles.timeLabel}>10:00 PM · Sodal</Text>
          </View>
          <View style={{ position: 'absolute', right: 16 }}>
          <Ionicons name="arrow-forward-sharp" size={24} color={'#000'} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MoodMapScreen;
