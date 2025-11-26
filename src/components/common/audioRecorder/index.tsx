import React, { useEffect, useState } from 'react';
import { View, Button, Text, Alert ,StyleSheet, TouchableOpacity } from 'react-native';
import {
  Audio,
  InterruptionModeIOS,
  InterruptionModeAndroid,
  AVPlaybackStatus,
} from 'expo-av';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AudioRecorderPlayer({recordedUri, setRecordedUri}) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  // const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Microphone permission is required to record audio.');
      }
    };

    requestPermissions();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const startRecording = async () => {
    try {
      const permission = await Audio.getPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Microphone permission is required to record audio.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // Get full details of the recording file
      let fileInfo = null;
      if (uri) {
        fileInfo = await Audio.Sound.createAsync({ uri });
      }

      setRecordedUri(uri || null);
      setRecording(null);
      setIsRecording(false);

      // Log or use the details as needed
      if (uri && fileInfo) {
        console.log('Recording details:', {
          uri,
          ...fileInfo,
        });
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const playSound = async () => {
    if (!recordedUri) return;

    try {
      const { sound: playbackSound } = await Audio.Sound.createAsync({ uri: recordedUri });
      setSound(playbackSound);

      playbackSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if ('didJustFinish' in status && status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      await playbackSound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  };

  const stopSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Failed to stop sound:', error);
    }
  };

  return (
    <View  style={{  }}>
      

      {recordedUri ? (
       
       <>
        <View >
         
        <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 70, right: 0, top: 22 }}>
            <LottieView
                source={require('../../../assets/lottie/audio_waves_anim.json')}
                autoPlay={isPlaying}
                loop={isPlaying}
            
                style={[{ position: 'absolute', left: 0, right: 50, width: 196, height: 66, alignItems: 'center', justifyContent: 'center' }]}
            />
        </View>
                     <TouchableOpacity
            style={{position:'absolute', left:0 , right:0 , top:60 , alignItems:'center' , justifyContent:'center'}}
            // title={isPlaying ? 'Stop Playback' : 'Play Recording'}
            onPress={isPlaying ? stopSound : playSound}
          >
           <Ionicons name={isPlaying? "pause" : "play"} color='#31c0bc' size={22}/>
            </TouchableOpacity>
                   </View>
          {/* <Text style={{ marginTop: 10, fontSize: 12 }}>Audio URI: {recordedUri}</Text> */}
        </>
      ):
      <>
        <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' , position:'absolute' , left:130 , right:0,  }}
            // title={isPlaying ? 'Stop Playback' : 'Play Recording'}
            onPress={isRecording ? stopRecording : startRecording}
          >
           <LottieView
           
                      source={isRecording ?require('../../../assets/lottie/stop_mic_anim.json') : require('../../../assets/lottie/play_mic_anim.json')}
                      autoPlay
                      loop
                      style={[StyleSheet.absoluteFill , { width: 56, height: 56 }]}
                    />
                    </TouchableOpacity>
                      <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' , position:'absolute' , left:0 , right:0, top:60  }}
            // title={isPlaying ? 'Stop Playback' : 'Play Recording'}
            onPress={isRecording ? stopRecording : startRecording}
          >
           <Text style={{ color: '#fff', fontSize: 16 , backgroundColor:'#31c0bc' , padding:8 , borderRadius:8 }}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
          </TouchableOpacity>

                    </>
                    
      }

    </View>
  );
}
