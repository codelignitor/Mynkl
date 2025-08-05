import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getCheckInAiAnalysis } from '@/src/services/apis';
import Header from '@/src/components/common/header';
import Happy from '../../../assets/svgs/happy-icon.svg';
import Calm from '../../../assets/svgs/calm-icon.svg';
import Stressed from '../../../assets/svgs/stressed-icon.svg';
import Lonely from '../../../assets/svgs/lonely-icon.svg';
import Sad from '../../../assets/svgs/sad-icon.svg';
import Frustrated from '../../../assets/svgs/frustrated.svg';
import Grateful from '../../../assets/svgs/grateful-icon.svg';
export default function MoodScreen() {
  const [moodStrength, setMoodStrength] = useState(0.5);
  const [data , setData] = useState();
  const [loading , setLoading] = useState(false);
  const router = useRouter();
   const params = useLocalSearchParams();
   const [mood , setMood] = useState();



  const handleAiAnalysis = async() => {

   

    try {
      setLoading(true);
     
     const response = await getCheckInAiAnalysis();
      if (response ) {
        // console.log('AI Analysis Response:', response);
        setData(response);
        setMoodStrength(response.mood_strength || 0.5); // Default to 0.5 if not provided
      } else {
        console.error('No data received from AI analysis');
      }
      
    } catch (error) {
      
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleAiAnalysis();
  }, []);

 
    useEffect(() => {
      let data = null;
      try {
        data = JSON.parse(params.data as string);
        setMood(data);
        
  
      } catch {
        data = null;
      }
     
    }, [params.data]);


  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }
    
  return (
    <LinearGradient colors={['#a5f3fc', '#0ea5e9']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* Header: Back button + Centered Mood text */}
       <Header title='Mood' showBack style={{backgroundColor:'#a5f3fc'}}/>


       
        {/* Emoji */}
        
                       {data?.last_check_in_mood === 'Lonely' && <Lonely width={103} height={103}/>}
                         {data?.last_check_in_mood === 'Happy' && <Happy width={88} height={88} />}
                                     {data?.last_check_in_mood === 'Calm' && <Calm width={93} height={93} />}
                                     {data?.last_check_in_mood === 'Stressed' && <Stressed width={88} height={88} />}
                                     {data?.last_check_in_mood === 'Lonely' && <Lonely width={103} height={103} />}
                                     {data?.last_check_in_mood === 'Grateful' && <Grateful width={74} height={73} />}
                                     {data?.last_check_in_mood === 'Sad' && <Sad width={79} height={79} />}
                                     {data?.last_check_in_mood === 'Frustrated' && <Frustrated width={71} height={73} />}[]

        {/* AI Interpretation Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI INTERPRETATION</Text>
          <Text style={styles.cardText}>{data?.emotion_label}</Text>
          <Text style={styles.cardSubText}>{data?.ai_interpretation}</Text>
        </View>

        {/* Mood Strength Slider */}
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>WEAK</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={data?.mood_strength_meter}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#fff"
            thumbTintColor="#fff"
            disabled={true} // Slider is now non-interactive
          />
          <Text style={styles.sliderLabel}>STRONG</Text>
        </View>

        {/* Action Buttons */}
        {data?.suggested_actions?.map((action, idx) => (
          <TouchableOpacity
           onPress={()=>{
             if (action?.type === "playlist") {
                          Linking.openURL(action.data.url);
                        } else {
                          router.push(`/activities/${action?.data?.id}`);
                        }
           }}
           key={idx} style={styles.actionBtn}>
            <Text style={{ fontSize: 20 }}>{action.emoji}</Text>
            <Text style={styles.btnText}>{action.description}</Text>
          </TouchableOpacity>
        ))}
       

        {/* Check In Button */}
        <TouchableOpacity
          style={styles.checkInBtn}
          onPress={() => router.push('/moodpattern')}
        >
          <Text style={styles.checkInText}>View my Mood Pattern</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    
  },
  headerWrapper: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },
  moodLabelCentered: {
    marginTop: 15,
    fontSize: 22,
    color: 'black',
    fontWeight: '800',
    letterSpacing: 1,
  },
  emoji: {
    fontSize: 80,
    marginTop: 20,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal:16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 12,
    color: '#555',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cardSubText: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  sliderRow: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  sliderLabel: {
    color: 'white',
    fontSize: 12,
    width: 40,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#01497c',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    width: '90%',
  },
  btnText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  checkInBtn: {
    backgroundColor: '#99f6e4',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 30,
   
    alignItems: 'center',
  },
  checkInText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});
