import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { styles } from '../../app/(tabs)/styles';
import ModalWrapper from '../common/ModalWrapper';

const ChatModal = ({ 
  visible, 
  onClose, 
  chatMessages, 
  chatMessage, 
  setChatMessage, 
  handleSendMessage 
}) => {
  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      title="Chat with MoodBot"
      icon="comment"
      iconColor="#4DA6FF"
      isChat={true}
    >
      <ScrollView 
        style={styles.chatMessagesContainer}
        contentContainerStyle={styles.chatMessagesContent}
      >
        {chatMessages.map(message => (
          <View 
            key={message.id} 
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer
            ]}
          >
            <View 
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userMessageBubble : styles.botMessageBubble
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        style={styles.chatInputContainer}
      >
        <TextInput
          style={styles.chatInput}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          value={chatMessage}
          onChangeText={setChatMessage}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ModalWrapper>
  );
};

export default ChatModal;