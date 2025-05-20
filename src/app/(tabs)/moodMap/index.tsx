import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ImageBackground } from 'react-native';
import {styles} from './index.style';
import { useMoodMap } from './useMoodMap';
import { moodsData } from '../moodsData';
import MoodMapView from '@/src/components/map/MoodMapView';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import SearchInput from '@/src/components/common/searchInput';
import { IconSymbol } from '@/src/components/ui/IconSymbol';


const MoodMapScreen: React.FC = () => {

    const {hugs} = useMoodMap();

    const [searchInput , setSearchInput] = React.useState('');
      const [mapRegion, setMapRegion] = React.useState({
        latitude: 37.78825,
        longitude: -122.4324,
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
        <SearchInput value={searchInput} onChangeText={setSearchInput} placeholder={"Mood Map"}/>
      <MoodMapView
      mapContainerStyle={styles.mapContainerStyle}
          mapRegion={mapRegion}
          selectedMood={selectedMood}
          currentLocations={currentLocations}
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
                <IconSymbol size={28} name="arrow.forward" color={'#000'} />
            </View>

          </View>
          </SafeAreaView>
       
    );
};



export default MoodMapScreen;