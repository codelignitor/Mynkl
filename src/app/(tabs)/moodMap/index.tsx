import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ImageBackground } from 'react-native';
import {styles} from '../../../screenStyles/moodMap/_index.style';
import { useMoodMap } from '../../../screenHooks/_useMoodMap';
import { moodsData } from '../../../utils/moodsData';
import MoodMapView from '@/src/components/map/MoodMapView';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import SearchInput from '@/src/components/common/searchInput';
import { IconSymbol } from '@/src/components/ui/IconSymbol';
import Ionicons from '@expo/vector-icons/Ionicons';



const MoodMapScreen: React.FC = () => {

    const {hugs, searchInput , setSearchInput , moodData} = useMoodMap();

   
      const [mapRegion, setMapRegion] = React.useState({
        latitude: 31.5833,
        longitude: 74.3000,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      const [selectedMood, setSelectedMood] = React.useState(moodsData[3]?.id);

       const currentLocations = selectedMood
          ? moodsData.find((mood) => mood.id === selectedMood)?.locations || []
          : [];
        const currentEmoji = selectedMood
          ? moodsData.find((mood) => mood.id === selectedMood)?.emoji
          : null;


     
    return (
       <SafeAreaView style={styles.container}>
        <SearchInput 
  onChangeText={(text) => {
    
    setSearchInput(text);
  }} value={searchInput}  placeholder={"Mood Map"}/>
      <MoodMapView
      mapContainerStyle={styles.mapContainerStyle}
          mapRegion={mapRegion}
          selectedMood={selectedMood}
          currentLocations={moodData}
          currentEmoji={currentEmoji} backgroundColor={undefined}        /> 
          <View style={styles.activitiesContainer}>
            <View style={styles.rowContiner}>
                <Text style={styles.activitiesLabel}>Activities</Text>
                <Text style={styles.seeMore}>See More</Text>
            </View>

            <View style={styles.activityContainer}>
                <Image style={{height:132, width:122 , borderTopLeftRadius:32 , borderBottomLeftRadius:32}} source={require('../../../assets/images/party_pic.jpg')}/>
                <View style={styles.activityDetailsContainer}>
                    <Text style={styles.activityLabel}>Live Music Mestup</Text>
                     <Text style={styles.timeLabel}>10:00 PM . Sodal</Text>
                </View>
                <Ionicons name="arrow-forward-sharp" size={24} color={'#000'} />
                
            </View>

          </View>
          </SafeAreaView>
       
    );
};



export default MoodMapScreen;