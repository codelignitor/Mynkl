import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import styles from './style';
import { useReadyToChat, options as chatOptions } from '../../../screenHooks/_useReadytochat';
import { openToTalk, insightTips } from '../../../services/apis';

const iconMap = {
  text: { Icon: MaterialIcons, iconName: 'textsms' },
  voice: { Icon: FontAwesome, iconName: 'microphone' },
  video: { Icon: Feather, iconName: 'video' },
};

const OpenToTalkScreen = () => {
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
    loading,
    startChat,
  } = useReadyToChat();

  // State for insight tip
  const [insightTip, setInsightTip] = useState('');
  const [tipLoading, setTipLoading] = useState(true);
  const [tipError, setTipError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTip = async () => {
      setTipLoading(true);
      setTipError(null);
      try {
        console.log('Calling insightTips API...');
        const res = await insightTips();
        console.log('insightTips API response:', res);
        if (res && res.tip) {
          setInsightTip(res.tip);
        } else if (typeof res === 'string') {
          setInsightTip(res);
        } else {
          setInsightTip('No tip available.');
        }
      } catch (err) {
        console.log('insightTips API error:', err);
        setTipError('Failed to load insight tip.');
      } finally {
        setTipLoading(false);
      }
    };
    fetchTip();
  }, []);

  const router = useRouter();

  const handleStartWith = async () => {
    const response = await startChat();
    if (response) {
      router.push('/Opentotalk/AI_matches');
    }
  };

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
            onValueChange={(value) => {
              setIsOpen(value);
              if (value) {
                showStatusToast(status);
              }
            }}
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
              if (!isOpen) return;
              setStatus('available');
              showStatusToast('available');
            }}
            disabled={!isOpen}
          >
            <Text style={{ fontSize: 18, opacity: isOpen ? 1 : 0.5 }}>🟢</Text>
            <Text style={[
              styles.statusLabel,
              status === 'available' && styles.statusLabelSelected,
              !isOpen && { opacity: 0.5 }
            ]}>Available</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusOption,
              status === 'away' && styles.statusOptionSelected
            ]}
            onPress={() => {
              if (!isOpen) return;
              setStatus('away');
              showStatusToast('away');
            }}
            disabled={!isOpen}
          >
            <Text style={{ fontSize: 18, opacity: isOpen ? 1 : 0.5 }}>🟡</Text>
            <Text style={[
              styles.statusLabel,
              status === 'away' && styles.statusLabelSelected,
              !isOpen && { opacity: 0.5 }
            ]}>Away</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusOption,
              status === 'busy' && styles.statusOptionSelected
            ]}
            onPress={() => {
              if (!isOpen) return;
              setStatus('busy');
              showStatusToast('busy');
            }}
            disabled={!isOpen}
          >
            <Text style={{ fontSize: 18, opacity: isOpen ? 1 : 0.5 }}>🔴</Text>
            <Text style={[
              styles.statusLabel,
              status === 'busy' && styles.statusLabelSelected,
              !isOpen && { opacity: 0.5 }
            ]}>Busy</Text>
          </TouchableOpacity>
        </View>
        {/* Insight Tip */}
        <View style={{ marginBottom: 12 }}>
          {tipLoading ? (
            <Text style={{ color: '#fff', textAlign: 'center' }}>Loading tip...</Text>
          ) : tipError ? (
            <Text style={{ color: 'red', textAlign: 'center' }}>{tipError}</Text>
          ) : (
            <Text style={{ color: '#fff', textAlign: 'center' }}>{insightTip}</Text>
          )}
        </View>
        {/* <Text style={styles.upbeatMsg}>
          {`You seem upbeat today—try `}
        </Text> */}
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
            onPress={handleStartWith}
            disabled={loading}
          >
            <Text style={styles.startButtonText}>
              {loading ? 'Starting...' : `Start With ${selectedLabel.charAt(0).toUpperCase() + selectedLabel.slice(1)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default OpenToTalkScreen; 