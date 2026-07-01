import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Mascot from '../../../assets/svgs/mascot.svg'; // Your main SVG image
import { MaterialIcons } from '@expo/vector-icons'; // Arrow icon
import { useRouter } from 'expo-router';
import {getaiMessage, HappinessChallenges, getUsers} from '../../../services/apis';
import { useSelector } from 'react-redux';

type User = {
  id: string;
  name: string;
  profile_pic?: string;
  // add more fields if needed
};

export default function ChallengeScreen() {
    const router = useRouter();
    const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'happiness', 'message', or 'success'
    const [selectedOption, setSelectedOption] = useState<string | null>(null); // Track selected option
    const [selectedMessage, setSelectedMessage] = useState(null); // Track selected message
    const [customMessage, setCustomMessage] = useState(''); // Track custom message
    const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
    const [selectedCommunityMemberId, setSelectedCommunityMemberId] = useState<string | null>(null);
    const [aiMessages, setAiMessages] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const userId = useSelector(state => state.auth.user_id); // your own user id
    const [users, setUsers] = useState<User[]>([]);
    const [showFriendList, setShowFriendList] = useState(false);
    const [showCommunityList, setShowCommunityList] = useState(false);

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const data = await getUsers();
          setUsers(data?.list || []);
        } catch (e) {
          // handle error
        }
      };
      fetchUsers();
    }, []);

    // Start Challenge Screen
    const StartChallengeScreen = () => (
        <LinearGradient
            colors={['#035776', '#003750']}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.bigText}>Happiness Challenge</Text>
                    <Text style={styles.smallText}>Today's mission: Brighten someone's day with a positive message</Text>
                </View>

                <View style={styles.imageContainer}>
                    <Mascot width="100%" height={250} />
                </View>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => setCurrentScreen('happiness')}
                >
                    <Text style={styles.buttonText}>Start Challenge</Text>
                    <MaterialIcons name="arrow-forward" size={22} color="#fff" style={styles.arrowIcon} />
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );

    // Happiness Challenge Screen
    const HappinessChallengeScreen = () => {
        const friends = users; // or filter if you have a way to distinguish
        const communityMembers = users; // or filter if you have a way to distinguish

        return (
            <SafeAreaView style={styles.happinessContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#035776" />
                <LinearGradient
                    colors={['#035776', '#003750']}
                    style={styles.happinessGradient}
                >
                    <View style={styles.happinessContent}>
                        {/* Header */}
                        <View style={styles.happinessHeader}>
                            <Text style={styles.happinessTitle}>Happiness</Text>
                            <Text style={styles.happinessTitle}>Challenge</Text>
                            <Text style={styles.happinessSubtitle}>Who do you want to send{'\n'}positivity to?</Text>
                        </View>

                        {/* Options */}
                        <View style={styles.optionsContainer}>
                            {/* Friend Option */}
                            <TouchableOpacity 
                                style={[
                                    styles.option,
                                    selectedOption === 'friend' && styles.selectedOption
                                ]}
                                onPress={() => {
                                    setSelectedOption('friend');
                                    setShowFriendList(true);
                                }}
                            >
                                <View style={styles.optionContent}>
                                    <View style={styles.optionLeft}>
                                        <Text style={styles.optionTitle}>Friend</Text>
                                        <Text style={styles.optionSubtitle}>Emma or Jack</Text>
                                    </View>
                                    <View style={styles.avatarContainer}>
                                        <View style={[styles.avatar, styles.avatar1]}>
                                            <Text style={styles.avatarText}>👩🏻</Text>
                                        </View>
                                        <View style={[styles.avatar, styles.avatar2]}>
                                            <Text style={styles.avatarText}>👨🏻</Text>
                                        </View>
                                    </View>
                                </View>
                                {selectedOption === 'friend' && (
                                    <View style={styles.checkmark}>
                                        <MaterialIcons name="check" size={20} color="#fff" />
                                    </View>
                                )}
                            </TouchableOpacity>

                            {/* Community Member Option */}
                            <TouchableOpacity 
                                style={[
                                    styles.option,
                                    selectedOption === 'community' && styles.selectedOption
                                ]}
                                onPress={() => {
                                    setSelectedOption('community');
                                    setShowCommunityList(true);
                                }}
                            >
                                <View style={styles.optionContent}>
                                    <View style={styles.optionLeft}>
                                        <Text style={styles.optionTitle}>Community</Text>
                                        <Text style={styles.optionTitle}>Member</Text>
                                        <Text style={styles.optionSubtitle}>Community member</Text>
                                    </View>
                                    <View style={styles.singleAvatarContainer}>
                                        <View style={[styles.avatar, styles.avatar3]}>
                                            <Text style={styles.avatarText}>👦🏾</Text>
                                        </View>
                                    </View>
                                </View>
                                {selectedOption === 'community' && (
                                    <View style={styles.checkmark}>
                                        <MaterialIcons name="check" size={20} color="#fff" />
                                    </View>
                                )}
                            </TouchableOpacity>

                            {/* Yourself Option */}
                            <TouchableOpacity 
                                style={[
                                    styles.option,
                                    selectedOption === 'yourself' && styles.selectedOption
                                ]}
                                onPress={() => {
                                    setSelectedOption('yourself');
                                    setSelectedFriendId(null);
                                    setSelectedCommunityMemberId(null);
                                    console.log('Selected Yourself:', userId);
                                }}
                            >
                                <View style={styles.optionContent}>
                                    <View style={styles.optionLeft}>
                                        <Text style={styles.optionTitle}>Yourself</Text>
                                        <Text style={styles.optionSubtitle}>Yourself</Text>
                                    </View>
                                    <View style={styles.singleAvatarContainer}>
                                        <Text style={styles.emojiAvatar}>😌</Text>
                                    </View>
                                </View>
                                {selectedOption === 'yourself' && (
                                    <View style={styles.checkmark}>
                                        <MaterialIcons name="check" size={20} color="#fff" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Next Button */}
                        <TouchableOpacity 
                            style={[
                                styles.nextButton,
                                selectedOption && styles.nextButtonActive
                            ]}
                            disabled={!selectedOption || aiLoading}
                            onPress={async () => {
                                console.log('Next button pressed');
                                if (selectedOption) {
                                    setAiLoading(true);
                                    try {
                                        console.log('Calling getaiMessage...');
                                        const data = await getaiMessage();
                                        console.log('AI message API response:', data);
                                        setAiMessages(data);
                                    } catch (error) {
                                        console.log('Error fetching AI messages:', error);
                                        Alert.alert('Error', 'Failed to load AI messages');
                                    } finally {
                                        setAiLoading(false);
                                        setCurrentScreen('message');
                                    }
                                }
                            }}
                        >
                            <Text style={styles.nextButtonText}>Next</Text>
                            {aiLoading && <ActivityIndicator color="#fff" style={{ marginLeft: 8 }} />}
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                {showFriendList && (
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 100}}>
                        <View style={{backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%', maxHeight: '70%'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10}}>Select a Friend</Text>
                            <ScrollView style={{maxHeight: 300}}>
                                {friends.length === 0 && <Text>No friends found.</Text>}
                                {friends.map(friend => (
                                    <TouchableOpacity
                                        key={friend.id}
                                        style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee'}} 
                                        onPress={() => {
                                            setSelectedFriendId(friend.id);
                                            setSelectedCommunityMemberId(null); // clear community
                                            setSelectedOption('friend');
                                            setShowFriendList(false);
                                            console.log('Selected Friend:', friend.name, friend.id);
                                        }}
                                    >
                                        <Text>{friend.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <TouchableOpacity onPress={() => setShowFriendList(false)} style={{marginTop: 10, alignSelf: 'flex-end'}}>
                                <Text style={{color: '#007AFF'}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {showCommunityList && (
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 100}}>
                        <View style={{backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%', maxHeight: '70%'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10}}>Select a Community Member</Text>
                            <ScrollView style={{maxHeight: 300}}>
                                {communityMembers.length === 0 && <Text>No community members found.</Text>}
                                {communityMembers.map(member => (
                                    <TouchableOpacity
                                        key={member.id}
                                        style={{padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee'}} 
                                        onPress={() => {
                                            setSelectedCommunityMemberId(member.id);
                                            setSelectedFriendId(null); // clear friend
                                            setSelectedOption('community');
                                            setShowCommunityList(false);
                                            console.log('Selected Community Member:', member.name, member.id);
                                        }}
                                    >
                                        <Text>{member.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <TouchableOpacity onPress={() => setShowCommunityList(false)} style={{marginTop: 10, alignSelf: 'flex-end'}}>
                                <Text style={{color: '#007AFF'}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        );
    };

    // Message Selection Screen
    const MessageSelectionScreen = () => {
        const predefinedMessages =
            aiMessages && (aiMessages as any).Messages && (aiMessages as any).Messages.length > 0
                ? (aiMessages as any).Messages.map((m: any) => m.message)
                : [
                    "You're stronger than you think.",
                    "I'm grateful you're in this world.",
                    "Today is better because of you."
                ];

        return (
            <SafeAreaView style={styles.messageContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#035776" />
                <LinearGradient
                    colors={['#035776', '#003750']}
                    style={styles.messageGradient}
                >
                    <View style={styles.messageContent}>
                        {/* Header */}
                        <View style={styles.messageHeader}>
                            <Text style={styles.messageTitle}>Pick a positive{'\n'}message or{'\n'}write your own</Text>
                        </View>

                        {/* Predefined Messages */}
                        <View style={styles.messagesContainer}>
                            {predefinedMessages.map((message: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.messageOption,
                                        selectedMessage === message && styles.selectedMessageOption
                                    ]}
                                    onPress={() => {
                                        setSelectedMessage(message);
                                        setCustomMessage('');
                                    }}
                                >
                                    <Text style={styles.messageText}>{message}</Text>
                                    {selectedMessage === message && (
                                        <View style={styles.messageCheckmark}>
                                            <MaterialIcons name="check" size={16} color="#fff" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}

                            {/* Custom Message Input */}
                            <View style={styles.customMessageContainer}>
                                <View style={styles.heartIcon}>
                                    <Text style={styles.heartEmoji}>😊</Text>
                                </View>
                                <TextInput
                                    style={[
                                        styles.customMessageInput,
                                        customMessage && styles.selectedCustomMessage
                                    ]}
                                    placeholder="Write your own message..."
                                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                    value={customMessage}
                                    onChangeText={(text) => {
                                        setCustomMessage(text);
                                        if (text) {
                                            setSelectedMessage(null);
                                        }
                                    }}
                                    multiline
                                />
                            </View>
                        </View>

                        {/* Send Button */}
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                (selectedMessage || customMessage) && styles.sendButtonActive
                            ]}
                            disabled={!selectedMessage && !customMessage}
                            onPress={handleSend}
                        >
                            <Text style={styles.sendButtonText}>Send with Kindness</Text>
                            <MaterialIcons name="arrow-forward" size={20} color="#fff" style={styles.sendArrow} />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    };

    // Success Screen
    const SuccessScreen = () => {
        const confettiElements = [
            // Hearts
            { type: 'heart', top: '15%', left: '20%' },
            { type: 'heart', top: '25%', right: '15%' },
            { type: 'heart', top: '45%', left: '10%' },
            { type: 'heart', top: '60%', right: '20%' },
            { type: 'heart', top: '75%', left: '25%' },
            
            // Confetti pieces
            { type: 'confetti', color: '#F7DC6F', top: '10%', left: '15%', rotation: '45deg' },
            { type: 'confetti', color: '#FF6B6B', top: '12%', right: '25%', rotation: '-30deg' },
            { type: 'confetti', color: '#4ECDC4', top: '18%', left: '70%', rotation: '60deg' },
            { type: 'confetti', color: '#F7DC6F', top: '22%', left: '40%', rotation: '-45deg' },
            { type: 'confetti', color: '#FF6B6B', top: '35%', right: '30%', rotation: '30deg' },
            { type: 'confetti', color: '#4ECDC4', top: '38%', left: '80%', rotation: '-60deg' },
            { type: 'confetti', color: '#F7DC6F', top: '55%', left: '15%', rotation: '45deg' },
            { type: 'confetti', color: '#FF6B6B', top: '62%', right: '35%', rotation: '-30deg' },
            { type: 'confetti', color: '#4ECDC4', top: '68%', left: '65%', rotation: '60deg' },
            { type: 'confetti', color: '#F7DC6F', top: '72%', right: '15%', rotation: '-45deg' },
            { type: 'confetti', color: '#FF6B6B', top: '80%', left: '35%', rotation: '30deg' },
            { type: 'confetti', color: '#4ECDC4', top: '85%', right: '25%', rotation: '-60deg' },
            
            // Small dots
            { type: 'dot', top: '20%', left: '50%' },
            { type: 'dot', top: '40%', left: '30%' },
            { type: 'dot', top: '65%', right: '45%' },
            { type: 'dot', top: '80%', left: '60%' },
        ];

        return (
            <SafeAreaView style={styles.successContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#035776" />
                <LinearGradient
                    colors={['#035776', '#003750']}
                    style={styles.successGradient}
                >
                    {/* Confetti Elements */}
                    {confettiElements.map((element, index) => (
                        <View
                            key={index}
                            style={[
                                styles.confettiElement,
                                {
                                    top: element.top ? parseFloat(element.top) : undefined,
                                    left: element.left ? parseFloat(element.left) : undefined,
                                    right: element.right ? parseFloat(element.right) : undefined,
                                    transform: element.rotation ? [{ rotate: element.rotation }] : undefined,
                                }
                            ]}
                        >
                            {element.type === 'heart' && (
                                <Text style={styles.heartConfetti}>💖</Text>
                            )}
                            {element.type === 'confetti' && (
                                <View style={[styles.confettiPiece, { backgroundColor: element.color }]} />
                            )}
                            {element.type === 'dot' && (
                                <View style={styles.confettiDot} />
                            )}
                        </View>
                    ))}

                    <View style={styles.successContent}>
                        {/* Success Message */}
                        <View style={styles.successTextContainer}>
                            <Text style={styles.successText}>
                                You just{'\n'}brightened{'\n'}someone's{'\n'}day ✨
                            </Text>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.successButtonsContainer}>
                            <TouchableOpacity 
                                style={styles.returnButton}
                                onPress={() => {
                                    router.push('/chat/room'); // Navigate to chat screen/file
                                }}
                            >
                                <Text style={styles.returnButtonText}>Return to Chat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.sendAnotherButton}
                                onPress={() => {
                                    // Reset all states and go back to first screen
                                    setCurrentScreen('start');
                                    setSelectedOption(null);
                                    setSelectedMessage(null);
                                    setCustomMessage('');
                                }}
                            >
                                <Text style={styles.sendAnotherButtonText}>Send Another</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    };

    const handleSend = async () => {
      // Map UI selection to API senderType
      let senderType = '';
      if (selectedOption === 'friend') senderType = 'Friend';
      else if (selectedOption === 'community') senderType = 'CommunityMember';
      else if (selectedOption === 'yourself') senderType = 'YourSelf';
      // For now, use your own userId for Yourself, or a dummy for others
      let receiverId = '';
      if (selectedOption === 'yourself') {
        receiverId = userId;
      } else if (selectedOption === 'friend') {
        receiverId = selectedFriendId || ''; // Ensure it's a string
      } else if (selectedOption === 'community') {
        receiverId = selectedCommunityMemberId || ''; // Ensure it's a string
      }

      const payload = {
        senderType,
        message: customMessage || selectedMessage,
        receiverId,
      };

      try {
        const response = await HappinessChallenges(payload);
        console.log('API response:', response);
        if (response.status === 'success') {
          Alert.alert(
            'Success',
            response.message,
            [
              {
                text: 'OK',
                onPress: () => setCurrentScreen('success')
              }
            ]
          );
        } else {
          Alert.alert('Error', response.message || 'Something went wrong');
        }
      } catch (error) {
        const err = error as any;
        if (err.response && err.response.data) {
          console.log('Backend error:', err.response.data);
          let errorMsg = '';
          if (typeof err.response.data === 'string') {
            errorMsg = err.response.data;
          } else if (err.response.data.detail) {
            if (Array.isArray(err.response.data.detail)) {
              // Only extract the msg property for display
              errorMsg = err.response.data.detail.map((d: any) => d.msg).join('\n');
            } else {
              errorMsg = err.response.data.detail.msg || JSON.stringify(err.response.data.detail);
            }
          } else if (err.response.data.message) {
            errorMsg = err.response.data.message;
          } else {
            errorMsg = JSON.stringify(err.response.data);
          }
          Alert.alert('Error', errorMsg);
        } else {
          console.log('API error:', error);
          Alert.alert('Error', 'Failed to send happiness message');
        }
      }
    };

    // Return the appropriate screen based on current state
    return currentScreen === 'start' ? <StartChallengeScreen /> : 
           currentScreen === 'happiness' ? <HappinessChallengeScreen /> : 
           currentScreen === 'message' ? <MessageSelectionScreen /> :
           <SuccessScreen />;
}

const styles = StyleSheet.create({
    // Start Challenge Screen Styles
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 40,
    },
    headerContainer: {
        alignItems: 'center',
    },
    bigText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    smallText: {
        fontSize: 25,
        color: '#cbd5e1',
        marginTop: 8,
        textAlign: 'center',
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#3B82F6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginBottom: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    arrowIcon: {
        marginTop: 2,
    },

    // Happiness Challenge Screen Styles
    happinessContainer: {
        flex: 1,
    },
    happinessGradient: {
        flex: 1,
    },
    happinessContent: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
    },
    happinessHeader: {
        marginBottom: 60,
    },
    happinessTitle: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFFFFF',
        lineHeight: 48,
    },
    happinessSubtitle: {
        fontSize: 20,
        color: '#FFFFFF',
        marginTop: 24,
        lineHeight: 26,
    },
    optionsContainer: {
        flex: 1,
        gap: 16,
    },
    option: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 4,
        position: 'relative',
    },
    selectedOption: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 2,
        borderColor: '#fff',
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    checkmark: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#22C55E',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionLeft: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#FFFFFF',
        lineHeight: 26,
    },
    optionSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    singleAvatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -8,
    },
    avatar1: {
        backgroundColor: '#F7FAFC',
        zIndex: 2,
    },
    avatar2: {
        backgroundColor: '#F7FAFC',
        zIndex: 1,
    },
    avatar3: {
        backgroundColor: '#F7FAFC',
    },
    avatarText: {
        fontSize: 24,
    },
    emojiAvatar: {
        fontSize: 40,
    },
    nextButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
        opacity: 0.5,
    },
    nextButtonActive: {
        opacity: 1,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },

    // Message Selection Screen Styles
    messageContainer: {
        flex: 1,
    },
    messageGradient: {
        flex: 1,
    },
    messageContent: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
    },
    messageHeader: {
        marginBottom: 40,
    },
    messageTitle: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#FFFFFF',
        lineHeight: 42,
    },
    messagesContainer: {
        flex: 1,
        gap: 16,
    },
    messageOption: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 16,
        padding: 20,
        position: 'relative',
    },
    selectedMessageOption: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 2,
        borderColor: '#fff',
    },
    messageText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        lineHeight: 22,
    },
    messageCheckmark: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#22C55E',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    customMessageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginTop: 8,
    },
    heartIcon: {
        backgroundColor: '#FF6B6B',
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    heartEmoji: {
        fontSize: 24,
    },
    customMessageInput: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 16,
        padding: 20,
        fontSize: 16,
        color: '#FFFFFF',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    selectedCustomMessage: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 2,
        borderColor: '#fff',
    },
    sendButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        opacity: 0.5,
    },
    sendButtonActive: {
        opacity: 1,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    sendArrow: {
        color: '#FFFFFF',
    },

    // Success Screen Styles
    successContainer: {
        flex: 1,
    },
    successGradient: {
        flex: 1,
        position: 'relative',
    },
    confettiElement: {
        position: 'absolute',
        zIndex: 1,
    },
    heartConfetti: {
        fontSize: 24,
    },
    confettiPiece: {
        width: 12,
        height: 6,
        borderRadius: 3,
    },
    confettiDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#fff',
    },
    successContent: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        paddingTop: 80,
        paddingBottom: 40,
        zIndex: 2,
    },
    successTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 50,
    },
    successButtonsContainer: {
        gap: 16,
    },
    returnButton: {
        backgroundColor: '#A8D8EA',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    returnButtonText: {
        color: '#2C3E50',
        fontSize: 18,
        fontWeight: '600',
    },
    sendAnotherButton: {
        backgroundColor: '#F7DC6F',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    sendAnotherButtonText: {
        color: '#2C3E50',
        fontSize: 18,
        fontWeight: 'bold',
    },
});