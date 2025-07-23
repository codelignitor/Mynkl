import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import styles from './style';
import { useReadyToChat, options as chatOptions } from '../../../screenHooks/_useReadytochat';

const iconMap = {
  text: { Icon: MaterialIcons, iconName: 'textsms' },
  voice: { Icon: FontAwesome, iconName: 'microphone' },
  video: { Icon: Feather, iconName: 'video' },
};

const OpenToTalkScreen = () => {
  const router = useRouter();
  const {
    isOpen,
    setIsOpen,
    selectedOption,
    setSelectedOption,
    status,
    setStatus,
    showStatusToast,
    selectedLabel,
    options,
  } = useReadyToChat();

  return (
    <LinearGradient
      colors={['#0f2e2e', '#0b5747', '#0e7c6b', '#2c5364']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.header}>mynkl</Text>
        <Text style={styles.title}>Hello!</Text>
        <Text style={styles.subtitle}>Ready for a chat?</Text>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Open to Talk</Text>
          <Switch
            value={isOpen}
            onValueChange={setIsOpen}
            trackColor={{ false: '#444', true: '#1ed760' }}
            thumbColor={isOpen ? '#fff' : '#888'}
          />
        </View>
        {/* Status Bar */}
        <View style={styles.statusBar}>
          <TouchableOpacity
            style={[
              styles.statusOption,
              status === 'available' && styles.statusOptionSelected
            ]}
            onPress={() => {
              setStatus('available');
              showStatusToast('available');
            }}
          >
            <Text style={{ fontSize: 18 }}>🟢</Text>
            <Text style={[
              styles.statusLabel,
              status === 'available' && styles.statusLabelSelected
            ]}>Available</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusOption,
              status === 'away' && styles.statusOptionSelected
            ]}
            onPress={() => {
              setStatus('away');
              showStatusToast('away');
            }}
          >
            <Text style={{ fontSize: 18 }}>🟡</Text>
            <Text style={[
              styles.statusLabel,
              status === 'away' && styles.statusLabelSelected
            ]}>Away</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusOption,
              status === 'busy' && styles.statusOptionSelected
            ]}
            onPress={() => {
              setStatus('busy');
              showStatusToast('busy');
            }}
          >
            <Text style={{ fontSize: 18 }}>🔴</Text>
            <Text style={[
              styles.statusLabel,
              status === 'busy' && styles.statusLabelSelected
            ]}>Busy</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.upbeatMsg}>
          {`You seem upbeat today—try ${selectedLabel}!`}
        </Text>
        <View style={styles.optionsRow}>
          {chatOptions.map(({ key, label }) => {
            const isSelected = selectedOption === key;
            const color = isSelected ? '#1ed760' : '#fff';
            const { Icon, iconName } = iconMap[key];
            return (
              <TouchableOpacity
                key={key}
                style={styles.optionBtn}
                onPress={() => setSelectedOption(key)}
                activeOpacity={0.7}
              >
                <Icon name={iconName as any} size={28} color={color} />
                <Text style={[styles.optionText, { color }]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.upbeatMsg2}>You seem upbeat today—try</Text>
        <View style={styles.moodInsightCard}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push('/Opentotalk/AI_matches')}
          >
            <Text style={styles.startButtonText}>
              {`Start With ${selectedLabel.charAt(0).toUpperCase() + selectedLabel.slice(1)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default OpenToTalkScreen; 