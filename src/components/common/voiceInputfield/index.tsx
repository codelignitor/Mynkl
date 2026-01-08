// VoiceInputField.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useAudioRecorder } from '../audioRecorder';

interface VoiceInputFieldProps {
  onTextChange?: (text: string) => void;
  onSubmit?: (text: string) => void;
  placeholder?: string;
  value?: string;
}

export default function VoiceInputField({
  onTextChange,
  onSubmit,
  placeholder = 'Type a message...',
  value = '',
}: VoiceInputFieldProps) {
  const [inputText, setInputText] = useState(value);
  const {
    isRecording,
    isConverting,
    amplitude,
    recordingTime,
    formattedTime,
    startRecording,
    stopRecording,
    cancelRecording,
    transcribeCurrentAudio,
  } = useAudioRecorder();

  const amplitudeAnimation = useRef(new Animated.Value(0)).current;

  // Animate waves based on amplitude
  React.useEffect(() => {
    Animated.timing(amplitudeAnimation, {
      toValue: amplitude,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [amplitude]);

  const handleMicPress = async () => {
    if (isConverting) return;
    
    if (isRecording) {
      // Already recording, should stop and send
      const uri = await stopRecording();
      if (uri) {
        try {
          const text = await transcribeCurrentAudio();
          if (text) {
            setInputText(text);
            onTextChange?.(text);
            onSubmit?.(text);
            showToast('Voice message converted to text');
          } else {
            showToast('No speech detected');
          }
        } catch (error) {
          showToast('Failed to convert audio');
        }
      }
    } else {
      // Start recording
      const started = await startRecording();
      if (!started) {
        Alert.alert('Permission Required', 'Microphone permission is required');
      }
    }
  };

  const handleCancelRecording = () => {
    cancelRecording();
  };

  const handleTextSubmit = () => {
    if (inputText.trim()) {
      onSubmit?.(inputText);
      setInputText('');
    }
  };

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
    //   Alert.alert(message);
    }
  };

  const waveHeight = amplitudeAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [10, 25, 40],
  });

  return (
    <View style={styles.container}>
      {/* Input Container */}
      <View style={styles.inputContainer}>
        {/* Wave Animation during recording */}
        {isRecording && (
          <View style={styles.waveContainer}>
            <LottieView
              source={require('../../../assets/lottie/audio_waves_anim.json')}
              autoPlay
              loop
              style={styles.waveAnimation}
              speed={0.5 + amplitude} // Speed up with amplitude
            />
            <Text style={styles.recordingTime}>{formattedTime}</Text>
          </View>
        )}

        {/* Text Input (hidden during recording) */}
        {!isRecording && !isConverting && (
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
              onTextChange?.(text);
            }}
            placeholder={placeholder}
            multiline
            editable={!isConverting}
          />
        )}

        {/* Converting State */}
        {/* {isConverting && (
          <View style={styles.convertingContainer}>
            <ActivityIndicator size="small" color="#31c0bc" />
            <Text style={styles.convertingText}>Converting speech to text...</Text>
          </View>
        )} */}

        {/* Action Buttons */}
        {/* Action Buttons (Top Right) */}
<View style={styles.actionsContainer}>
  {isRecording ? (
    <View style={styles.recordingActions}>
      {/* Send / Tick */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleMicPress}
      >
        <Ionicons name="checkmark" size={22} color="#222020ff" />
      </TouchableOpacity>

      {/* Cancel / Cross */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleCancelRecording}
      >
        <Ionicons name="close" size={22} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={handleMicPress}
      disabled={isConverting}
    >
      {isConverting ? (
        <ActivityIndicator size="small" color="#1b1919ff" />
      ) : (
        <Ionicons name="mic" size={22} color="#6d6a6aff" />
      )}
    </TouchableOpacity>
  )}
</View>

      </View>

      {/* Helper Text */}
      {isRecording && (
        <Text style={styles.helperText}>
          Tap ✓ to send recording, ✕ to cancel
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // paddingHorizontal: 16,
    // paddingVertical: 8,
    // backgroundColor: '#FFFFFF',
    // borderTopWidth: 1,
    // borderTopColor: '#E5E5E5',
  },
  inputContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    maxHeight: 100,
    paddingRight: 8,
  },
  waveContainer: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
  },
  waveAnimation: {
    width: 180,
    height: 40,
    marginRight: 12,
  },
  recordingTime: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    padding: 11
  },
  convertingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  convertingText: {
    // marginLeft: 8,
    fontSize: 14,
    color: '#31c0bc',
    fontWeight: '500',
  },
  actionsContainer: {
  position: 'absolute',
  top: 8,
  right: 8,
},

recordingActions: {
  alignItems: 'center',
  gap: 8,
},

  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    // backgroundColor: '#31c0bc',
  },
  recordingActive: {
    // backgroundColor: '#4CAF50',
  },
  cancelButton: {
    // backgroundColor: '#FFEBEE',
    // borderWidth: 1,
    // borderColor: '#FFCDD2',
  },
  helperText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
});