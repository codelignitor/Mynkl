import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../../app/(tabs)/styles';
import SectionHeader from '../common/SectionHeader';

const ChatAndConnect = ({ setShowChatModal }) => {
  return (
    <View style={styles.halfSection}>
      <SectionHeader title="Chat & Connect" />
      <TouchableOpacity 
        style={styles.chatConnectCard}
        onPress={() => setShowChatModal(true)}
      >
        <View style={styles.chatConnectContent}>
          <View style={styles.chatIconContainer}>
            <Icon name="comment" size={20} color="#4DA6FF" />
          </View>
          <View style={styles.chatTextContainer}>
            <Text style={styles.chatConnectTitle}>
              Talk to MoodBot
            </Text>
            <Text style={styles.chatConnectDescription}>
              Get support
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatAndConnect;