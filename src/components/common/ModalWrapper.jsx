import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../../../src/app/(tabs)/styles';

const ModalWrapper = ({ 
  visible, 
  onClose, 
  title, 
  icon, 
  iconColor,
  children, 
  isChat = false 
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={isChat ? styles.chatModalContainer : styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {icon && <Icon name={icon} size={20} color={iconColor} />} {title}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default ModalWrapper;