import React, { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { transcribeAudio } from '@/src/services/apis';
import { Alert } from 'react-native';

interface AudioRecorderLogicProps {
  onRecordingStart?: () => void;
  onRecordingStop?: (uri: string) => void;
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: string) => void;
}

export function useAudioRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [amplitude, setAmplitude] = useState(0); // For wave animation
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);


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


  const startRecording = async (): Promise<boolean> => {
    try {
      const permission = await Audio.getPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Microphone permission is required');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });


      const { recording: newRecording } = await Audio.Recording.createAsync(
        {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
          isMeteringEnabled: true, // Enable for wave animation
        },
        (recordingStatus) => {
          // Update amplitude for wave animation
          if (recordingStatus.isRecording && recordingStatus.metering) {
            // Normalize amplitude between 0 and 1
            const normalizedAmplitude = Math.max(0, Math.min(1, recordingStatus.metering / -160));
            setAmplitude(normalizedAmplitude);
          }
        }
      );

      setRecording(newRecording);
      setIsRecording(true);
      
      // Start timer for recording duration
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  };

  const stopRecording = async (): Promise<string | null> => {
    try {
      if (!recording) return null;

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      setRecording(null);
      setIsRecording(false);
      setAudioUri(uri || null);
      setAmplitude(0);

      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return null;
    }
  };

  const cancelRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
        setIsRecording(false);
        setAmplitude(0);
        setAudioUri(null);
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setRecordingTime(0);
    } catch (error) {
      console.error('Failed to cancel recording:', error);
    }
  };

  const transcribeCurrentAudio = async (): Promise<string | null> => {
    if (!audioUri) return null;
    
    try {
      setIsConverting(true);
      
      const audioFile = {
        uri: audioUri,
        type: 'audio/m4a',
        name: `recording-${Date.now()}.m4a`,
      };

      const result = await transcribeAudio(audioFile);
      const transcribedText = result.text?.trim();
      console.log('Transcription successful:', transcribedText);
      setIsConverting(false);
      return transcribedText || null;
    } catch (error) {
      console.error('Transcription error:', error);
      setIsConverting(false);
      throw error;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    // State
    isRecording,
    isConverting,
    audioUri,
    amplitude,
    recordingTime,
    formattedTime: formatTime(recordingTime),
    
    // Methods
    startRecording,
    stopRecording,
    cancelRecording,
    transcribeCurrentAudio,
  };
}