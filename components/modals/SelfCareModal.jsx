import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../../app/(tabs)/styles';
import ModalWrapper from '../common/ModalWrapper';

const SelfCareModal = ({ visible, onClose, selfCareTips }) => {
  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Self-Care Tips"
      icon="heart"
      iconColor="#FF6B6B"
    >
      <Text style={styles.selfCareIntro}>
        Taking care of your mental and physical health is important. Here are some simple self-care practices you can incorporate into your daily routine:
      </Text>
      
      <ScrollView style={styles.selfCareTipsContainer}>
        {selfCareTips.map(tip => (
          <View key={tip.id} style={styles.selfCareTipItem}>
            <View style={[styles.selfCareTipIconContainer, { backgroundColor: tip.color }]}>
              <Icon name={tip.icon} size={24} color="#fff" />
            </View>
            <View style={styles.selfCareTipContent}>
              <Text style={styles.selfCareTipTitle}>{tip.title}</Text>
              <Text style={styles.selfCareTipDescription}>{tip.description}</Text>
            </View>
          </View>
        ))}
        
        <View style={styles.selfCareDailyChallenge}>
          <Text style={styles.selfCareChallengeTitle}>Today's Challenge</Text>
          <Text style={styles.selfCareChallengeText}>
            Take 5 minutes to sit quietly and focus on your breathing. Notice how you feel before and after.
          </Text>
          <TouchableOpacity style={styles.selfCareChallengeButton}>
            <Text style={styles.selfCareChallengeButtonText}>Complete Challenge</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ModalWrapper>
  );
};

export default SelfCareModal;