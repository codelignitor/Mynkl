import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../../app/(tabs)/styles';
import SectionHeader from '../common/SectionHeader';

const SelfCareCard = ({ setShowSelfCareModal }) => {
  return (
    <View style={styles.halfSection}>
      <SectionHeader title="Self-Care Tips" />
      <TouchableOpacity 
        style={styles.selfCareCard}
        onPress={() => setShowSelfCareModal(true)}
      >
        <View style={styles.selfCareIconContainer}>
          <Icon name="heart" size={20} color="#FF6B6B" />
        </View>
        <View style={styles.selfCareTextContainer}>
          <Text style={styles.selfCareItem}>Take a deep breath</Text>
          <Text style={styles.selfCareSeeMore}>See more tips</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SelfCareCard;