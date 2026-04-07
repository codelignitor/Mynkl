import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const FeelingLonelyScreen = () => {
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      text: "This really helped me feel less alone. Thank you for creating this space.",
      timestamp: "2 hours ago",
      anonymous: true
    },
    {
      id: 2,
      text: "The playlist suggestion was perfect for my mood today.",
      timestamp: "5 hours ago",
      anonymous: true
    },
    {
      id: 3,
      text: "Sometimes just knowing others understand makes all the difference.",
      timestamp: "1 day ago",
      anonymous: true
    }
  ]);

  const handleYesPress = () => {
  console.log('Yes pressed');
};

const handleListen = () => {
  console.log('Listen pressed');
};

  const handleNoPress = () => {
    console.log('No pressed');
  };

  const handleAddComment = () => {
    setShowComments(true);
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        text: comment.trim(),
        timestamp: "Just now",
        anonymous: true
      };
      setComments([newComment, ...comments]);
      setComment('');
      setShowComments(false);
    }
  };

  const handleSubmit = () => {
    // You can add any submit logic here before navigation
    console.log('Submit pressed');
    // Navigate to the next screen - adjust the route name as needed
    router.push('/home'); // or router.replace('/home') if you don't want back navigation
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5A3C" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
    style={styles.backButton}
    onPress={() => router.back()}
  >
    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
  </TouchableOpacity>
        <Text style={styles.title}>Leaving the 'Feeling Lonely' room?</Text>
        <Text style={styles.subtitle}>Did this chat make you feel better?</Text>
      </View>

      {/* Yes/No Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.yesButton} onPress={handleYesPress}>
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.noButton} onPress={handleNoPress}>
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>

      {/* Add Comment Button */}
      <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
        <Text style={styles.commentButtonText}>Add a comment</Text>
      </TouchableOpacity>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Emoji */}
      <Text style={styles.emoji}>😊</Text>

      {/* Playlist Section */}
      <Text style={styles.playlistText}>
        Would you like a mood-lifting playlist before you go?
      </Text>

      {/* Listen Button */}
      <TouchableOpacity style={styles.listenButton} onPress={handleListen}>
        <Text style={styles.listenButtonText}>▶ Listen</Text>
      </TouchableOpacity>

      {/* Bottom Input/Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.bottomButton} onPress={handleSubmit}>
          <Text style={styles.bottomButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowComments(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Comments</Text>
            <View style={styles.placeholder} />
          </View>

          <KeyboardAvoidingView
            style={styles.modalContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Share your thoughts anonymously..."
                placeholderTextColor="#999"
                value={comment}
                onChangeText={setComment}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { opacity: comment.trim() ? 1 : 0.5 }
                ]}
                onPress={handleSubmitComment}
                disabled={!comment.trim()}
              >
                <Text style={styles.submitButtonText}>Post</Text>
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            <ScrollView style={styles.commentsList}>
              {comments.map((commentItem) => (
                <View key={commentItem.id} style={styles.commentItem}>
                  <Text style={styles.commentText}>{commentItem.text}</Text>
                  <Text style={styles.commentTimestamp}>
                    Anonymous • {commentItem.timestamp}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B5A3C',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 120,
    marginBottom: 40,
  },
 
  backButton: {
    position: 'absolute',
    left: 10,
    top: -50,
    // padding: 10,
    zIndex: 1,
},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 25,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  yesButton: {
    flex: 1,
    backgroundColor: '#A67C5A',
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  noButton: {
    flex: 1,
    backgroundColor: '#A67C5A',
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  commentButton: {
    backgroundColor: '#A67C5A',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 80,
    marginHorizontal: 10,
  },
  commentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
  },
  emoji: {
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 30,
  },
  playlistText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  listenButton: {
    backgroundColor: '#5A4037',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 60,
    marginHorizontal: 10,
  },
  listenButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomContainer: {
    marginBottom: 40,
    marginHorizontal: 10,
  },
  bottomButton: {
    borderWidth: 2,
    borderColor: '#D4A574',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bottomButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 30,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  commentInputContainer: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#8B5A3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  commentItem: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#999',
  },
});

export default FeelingLonelyScreen;