import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Alert,
  Vibration,
  FlatList,
  TextInput,
  Animated,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './style';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const ChooseHugTypeScreen = () => {
  // Screen state management
  const [currentScreen, setCurrentScreen] = useState('hugPreview'); // Start with hugPreview
  const [selectedHugType, setSelectedHugType] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedUserNames, setSelectedUserNames] = useState('');
  const [message, setMessage] = useState('');
  const [hugHistory, setHugHistory] = useState([]);

  // Personal Touch screen states
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [senderNameDisplay, setSenderNameDisplay] = useState(true);
  const [personalMessage, setPersonalMessage] = useState('');
  const [useAIMessage, setUseAIMessage] = useState(true);

  // Animations
  const [rippleAnimation] = useState(new Animated.Value(0));
  const [scaleAnimation] = useState(new Animated.Value(1));

  // Heart loader animations
  const zigzagAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  
  const rippleAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const hugTypes = [
    {
      id: 1,
      title: 'Warm Hug',
      description: 'Wrap them in\nin warmth',
      emoji: '⚡',
      colors: ['#FF6B6B', '#FF5252', '#FF4444'],
      rippleType: 'red',
      message: 'Sending warm energy their way! 🔥',
    },
    {
      id: 2,
      title: 'Cheer Hug',
      description: 'Add some spark\nto their day',
      emoji: '😊',
      colors: ['#FFD93D', '#FFC93C', '#FFB74D'],
      rippleType: 'yellow',
      message: 'Brightening their day with joy! ✨',
    },
    {
      id: 3,
      title: 'Comfort Hug',
      description: 'Wrap them in\nwarmth',
      emoji: '🤗',
      colors: ['#FFB6C1', '#FF91A4', '#FF69B4'],
      rippleType: 'pink',
      message: 'Wrapping them in comfort and care! 💕',
    },
    {
      id: 4,
      title: 'Calm Hug',
      description: 'Send peace and\nstillness',
      emoji: '😌',
      colors: ['#A8E6CF', '#88D8A3', '#7FCDCD'],
      rippleType: 'default',
      message: 'Sending peaceful vibes their way! 🌿',
    },
  ];

  const users = [
    { id: '1', name: 'Mynkl', color: '#E6E0FF' },
    { id: '2', name: 'Gock', color: '#FFE6C7' },
    { id: '3', name: 'Betan', color: '#C7F0F0' },
    { id: '4', name: 'Now', color: '#FFD6D6' },
    { id: '5', name: 'Toper', color: '#F0F0C7' },
    { id: '6', name: 'Coman', color: '#E6E0FF' },
  ];

  // Add hug to history
  const addToHugHistory = (hugType, recipients, message) => {
    try {
      const newHugEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        hugType: hugType || { title: 'Unknown Hug', emoji: '🤗' },
        recipients: recipients || [],
        message: message || '',
        timestamp: new Date(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        personalSettings: {
          anonymousMode,
          senderNameDisplay,
          personalMessage: personalMessage.trim(),
          useAIMessage,
        },
      };
      
      setHugHistory(prev => [newHugEntry, ...prev]);
      console.log('Hug added to history:', newHugEntry);
    } catch (error) {
      console.error('Error adding hug to history:', error);
    }
  };

  // Get hug count for selected users
  const getHugCountForSelectedUsers = () => {
    try {
      const selectedUsers = users.filter(user => selectedUserIds.includes(user.id));
      
      return selectedUsers.map(user => {
        const hugCount = hugHistory.filter(hug => 
          hug.recipients && hug.recipients.some(recipient => recipient.id === user.id)
        ).length;
        
        return {
          ...user,
          hugCount: hugCount
        };
      });
    } catch (error) {
      console.error('Error calculating hug counts:', error);
      return [];
    }
  };

  // Navigation functions
  const goToChooseHugType = () => {
    setCurrentScreen('chooseHugType');
  };

  const goToUserSelection = (hugType) => {
    setSelectedHugType(hugType);
    setCurrentScreen('userSelection');
  };

  const goToPersonalTouch = () => {
    if (selectedUserIds.length > 0) {
      const selectedUsers = users.filter(user => selectedUserIds.includes(user.id));
      const userNames = selectedUsers.map(user => user.name).join(', ');
      setSelectedUserNames(userNames);
      setCurrentScreen('personalTouch');
    } else {
      Alert.alert(
        'No Users Selected',
        'Please select at least one user to send hugs to.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const goToSendHug = () => {
    setCurrentScreen('sendHug');
  };

  const goToHugHistory = () => {
    setCurrentScreen('hugHistory');
  };

  // Back button handlers
  const handleBackPress = () => {
    switch (currentScreen) {
      case 'hugPreview':
        // This is the first screen - you might want to go to a parent screen or exit
        console.log('Back pressed from first screen');
        break;
      case 'chooseHugType':
        setCurrentScreen('hugPreview');
        break;
      case 'userSelection':
        setCurrentScreen('chooseHugType');
        setSelectedHugType(null);
        break;
      case 'personalTouch':
        setCurrentScreen('userSelection');
        break;
      case 'sendHug':
        setCurrentScreen('personalTouch');
        break;
      case 'hugHistory':
        setCurrentScreen('hugPreview');
        break;
      default:
        setCurrentScreen('hugPreview');
    }
  };

  // Reset to initial state
  const resetToStart = () => {
    setCurrentScreen('hugPreview');
    setSelectedHugType(null);
    setSelectedUserIds([]);
    setSelectedUserNames('');
    setMessage('');
    setPersonalMessage('');
    setAnonymousMode(true);
    setSenderNameDisplay(true);
    setUseAIMessage(true);
  };

  // Handle hug type selection
  const handleHugTypeSelect = (hugType) => {
    Vibration.vibrate([0, 100, 50, 100]);
    goToUserSelection(hugType);
  };

  // Handle user selection
  const handleUserSelect = (userId) => {
    if (!userId) return;
    
    setSelectedUserIds(prev => {
      const newSelection = prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      
      console.log('Selected user IDs:', newSelection);
      return newSelection;
    });
  };

  // Handle sending message
  const handleSendMessage = () => {
    const selectedUsers = users.filter(user => selectedUserIds.includes(user.id));
    
    if (selectedUsers.length === 0) {
      Alert.alert(
        'No Recipients',
        'Please go back and select users to send the hug to.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    // Determine the final message based on personal touch settings
    let finalMessage = '';
    if (personalMessage.trim()) {
      finalMessage = personalMessage.trim();
    } else if (useAIMessage && selectedHugType) {
      finalMessage = selectedHugType.message;
    } else {
      finalMessage = 'Sending you a warm hug! 🤗';
    }

    // Add to hug history
    addToHugHistory(
      selectedHugType || { title: 'Custom Hug', emoji: '🤗' },
      selectedUsers,
      finalMessage
    );

    Alert.alert(
      'Hug Sent! 🤗',
      `Your ${selectedHugType ? selectedHugType.title.toLowerCase() : 'hug'} has been sent to ${selectedUserNames}!${anonymousMode ? ' (Sent anonymously)' : ''}`,
      [
        {
          text: 'Send Another',
          style: 'default',
          onPress: () => {
            setMessage('');
            setPersonalMessage('');
            setSelectedHugType(null);
            setSelectedUserIds([]);
            setSelectedUserNames('');
            setCurrentScreen('chooseHugType');
          },
        },
        {
          text: 'Done',
          style: 'cancel',
          onPress: resetToStart,
        },
      ]
    );
  };

  // Animation effects for hugPreview screen
  useEffect(() => {
    if (currentScreen === 'hugPreview') {
      // Heartbeat animation
      const createHeartbeatAnimation = (anim, delay) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );
      };

      // Start heartbeat animations
      const heartbeatAnimations = zigzagAnims.map((anim, index) => 
        createHeartbeatAnimation(anim, index * 600)
      );
      heartbeatAnimations.forEach(animation => animation.start());

      // Ripple animation
      const createRippleAnimation = (anim, delay) => {
        return Animated.loop(
          Animated.timing(anim, {
            toValue: 1,
            duration: 2500,
            delay,
            useNativeDriver: true,
          })
        );
      };

      // Start ripple animations
      const rippleAnimationsList = rippleAnims.map((anim, index) => 
        createRippleAnimation(anim, index * 800)
      );
      rippleAnimationsList.forEach(animation => animation.start());

      return () => {
        heartbeatAnimations.forEach(animation => animation.stop());
        rippleAnimationsList.forEach(animation => animation.stop());
      };
    }
  }, [currentScreen]);

  // Animation effects for sendHug screen
  useEffect(() => {
    if (currentScreen === 'sendHug') {
      // Start ripple animation
      const rippleAnimationLoop = () => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(rippleAnimation, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(rippleAnimation, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const rippleAnim = rippleAnimationLoop();
      rippleAnim.start();

      // Character breathing animation
      const breathingAnimation = () => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnimation, {
              toValue: 1.05,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnimation, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const breathingAnim = breathingAnimation();
      breathingAnim.start();

      return () => {
        rippleAnim.stop();
        breathingAnim.stop();
      };
    }
  }, [currentScreen]);

  // Animation interpolations
  const rippleScale = rippleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 2],
  });

  const rippleOpacity = rippleAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.6, 0],
  });

  // Heart Icon Component
  const HeartIcon = () => (
    <View style={styles.heartIcon}>
      <View style={styles.heartShape}>
        <View style={[styles.heartLeft]} />
        <View style={[styles.heartRight]} />
        <View style={styles.heartBottom} />
      </View>
    </View>
  );

  // Heartbeat Line Component
  const HeartbeatLine = ({ animValue }) => {
    const animatedStyle = {
      opacity: animValue.interpolate({
        inputRange: [0, 0.3, 0.7, 1],
        outputRange: [0, 1, 1, 0],
      }),
      transform: [
        {
          translateX: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 100],
          }),
        },
      ],
    };

    return (
      <Animated.View style={[styles.heartbeatContainer, animatedStyle]}>
        <View style={styles.heartbeatLine}>
          <View style={styles.flatLine} />
          <View style={styles.smallPeak} />
          <View style={styles.largePeak} />
          <View style={styles.smallDip} />
          <View style={styles.mediumPeak} />
          <View style={styles.flatLineEnd} />
        </View>
      </Animated.View>
    );
  };

  // Ripple Effect Component
  const RippleEffect = ({ animValue, size }) => {
    const animatedStyle = {
      opacity: animValue.interpolate({
        inputRange: [0, 0.2, 0.5, 0.8, 1],
        outputRange: [1, 0.9, 0.8, 0.5, 0],
      }),
      transform: [
        {
          scale: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
          }),
        },
      ],
    };

    return (
      <Animated.View
        style={[
          styles.rippleEffect,
          { width: size, height: size },
          animatedStyle,
        ]}
      />
    );
  };

  // Screen 1: Hug Preview Screen (First Screen)
  if (currentScreen === 'hugPreview') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={['#8B5FBF', '#6B46C1', '#553C9A']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackPress}
            >
              <Ionicons name="chevron-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Send Love</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Heart Container with Loader Animation */}
          <View style={styles.centerContainer}>
            <View style={styles.heartContainer}>
              {/* Ripple Effects */}
              <RippleEffect animValue={rippleAnims[0]} size={200} />
              <RippleEffect animValue={rippleAnims[1]} size={240} />
              <RippleEffect animValue={rippleAnims[2]} size={280} />
              
              {/* Heart with Heartbeat Lines */}
              <View style={styles.heart}>
                <HeartIcon />
                <View style={styles.heartbeatLoader}>
                  <HeartbeatLine animValue={zigzagAnims[0]} />
                  <HeartbeatLine animValue={zigzagAnims[1]} />
                  <HeartbeatLine animValue={zigzagAnims[2]} />
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Buttons */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={styles.sendHugNowButton}
              onPress={goToChooseHugType}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']}
                style={styles.buttonGradient}
              >
                <Text style={styles.sendHugNowText}>Send a Hug</Text>
                <View style={styles.touchIcon}>
                  <Ionicons name="radio-button-off" size={24} color="#8B5FBF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.hugHistoryButton}
              onPress={goToHugHistory}
            >
              <Text style={styles.hugHistoryText}>View Hug History</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Screen 2: Choose Hug Type (Second Screen)
  if (currentScreen === 'chooseHugType') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={['#2C2C3E', '#1A1A2E', '#16213E']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Ionicons name="chevron-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose a Hug Type</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <View style={styles.floatingEmoji1}>
              <Text style={styles.emojiText}>😆</Text>
            </View>
            <View style={styles.floatingEmoji2}>
              <Text style={styles.emojiText}>😊</Text>
            </View>
            <View style={styles.floatingEmoji3}>
              <Text style={styles.emojiText}>🙂</Text>
            </View>

            <View style={styles.cardsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={width * 0.8}
                snapToAlignment="center"
              >
                {hugTypes.map((hugType, index) => (
                  <TouchableOpacity
                    key={hugType.id}
                    style={[
                      styles.hugCard,
                      index === 0 && styles.firstCard,
                      index === hugTypes.length - 1 && styles.lastCard,
                    ]}
                    onPress={() => handleHugTypeSelect(hugType)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={hugType.colors}
                      style={styles.cardGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.cardContent}>
                        <View style={styles.emojiContainer}>
                          <Text style={styles.cardEmoji}>{hugType.emoji}</Text>
                        </View>
                        <Text style={styles.cardTitle}>{hugType.title}</Text>
                        <Text style={styles.cardDescription}>
                          {hugType.description}
                        </Text>
                        <View style={styles.tapIndicator}>
                          <Ionicons name="hand-left" size={16} color="rgba(44, 44, 46, 0.6)" />
                          <Text style={styles.tapText}>Tap to continue</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Screen 3: User Selection (Third Screen)
  if (currentScreen === 'userSelection') {
    return (
      <SafeAreaView style={styles.sendHugContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        
        <View style={styles.sendHugHeader}>
          <TouchableOpacity 
            onPress={handleBackPress}
            style={styles.backButtonContainer}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.sendHugTitle}>Select Recipients</Text>
          <View style={styles.headerSpacer} />
        </View>

        {selectedHugType && (
          <View style={[styles.selectedHugTypeDisplay, { padding: 16, backgroundColor: 'rgba(139, 95, 191, 0.1)', marginHorizontal: 16, borderRadius: 8, marginBottom: 8 }]}>
            <Text style={[styles.selectedHugTypeText, { fontSize: 16, color: '#333', textAlign: 'center' }]}>
              Sending: {selectedHugType.emoji} {selectedHugType.title}
            </Text>
          </View>
        )}

        <View style={styles.contentContainer}>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.userList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.userItem, { backgroundColor: item.color }]}
                onPress={() => handleUserSelect(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.userIconContainer}>
                  <Ionicons 
                    name="person" 
                    size={20} 
                    color="#666" 
                  />
                </View>
                <Text style={styles.userText}>{item.name}</Text>
                {selectedUserIds.includes(item.id) ? (
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                ) : (
                  <Ionicons name="chevron-down" size={18} color="#999" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.sendButton,
            selectedUserIds.length > 0 ? styles.sendButtonActive : styles.sendButtonInactive
          ]}
          onPress={goToPersonalTouch}
          disabled={selectedUserIds.length === 0}
        >
          <Text style={[
            styles.sendText,
            selectedUserIds.length > 0 ? styles.sendTextActive : styles.sendTextInactive
          ]}>
            {selectedUserIds.length > 0 ? 'Continue' : 'Select Users'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Screen 4: Personal Touch Screen (NEW - Fourth Screen)
  if (currentScreen === 'personalTouch') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#4A90E2', '#7B68EE', '#9966CC']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Personal Touch</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Main Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.personalTouchTitle}>Personal Touch</Text>

            {/* Recipients Display */}
            <View style={styles.recipientsDisplay}>
              <Text style={styles.recipientsLabel}>Sending to: {selectedUserNames}</Text>
              <Text style={styles.hugTypeLabel}>
                {selectedHugType?.emoji} {selectedHugType?.title}
              </Text>
            </View>

            {/* Text Message Input */}
            <View style={styles.personalTouchInputContainer}>
              <TextInput
                style={styles.personalTouchTextInput}
                placeholder="Optional Text Message"
                placeholderTextColor="#999"
                value={personalMessage}
                onChangeText={setPersonalMessage}
                multiline
                maxLength={200}
              />
              <View style={styles.personalTouchEmojiContainer}>
                <TouchableOpacity onPress={() => setPersonalMessage(prev => prev + '😍')}>
                  <Text style={styles.personalTouchEmoji}>😍</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPersonalMessage(prev => prev + '😘')}>
                  <Text style={styles.personalTouchEmoji}>😘</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* AI Message Section */}
            <View style={styles.personalTouchAiMessageSection}>
              <View style={styles.aiMessageHeader}>
                <Text style={styles.personalTouchAiMessageLabel}>Use AI Message</Text>
                <Switch
                  value={useAIMessage}
                  onValueChange={setUseAIMessage}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={useAIMessage ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
              {useAIMessage && (
                <Text style={styles.personalTouchAiMessageText}>
                  {selectedHugType?.message || "You're not alone. I'm rooting for you 😊"}
                </Text>
              )}
            </View>

            {/* Toggle Options */}
            <View style={styles.personalTouchToggleSection}>
              <View style={styles.personalTouchToggleItem}>
                <Text style={styles.personalTouchToggleLabel}>Anonymous Mode</Text>
                <Switch
                  value={anonymousMode}
                  onValueChange={setAnonymousMode}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={anonymousMode ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>

              <View style={styles.personalTouchToggleItem}>
                <Text style={styles.personalTouchToggleLabel}>Sender Name Display</Text>
                <Switch
                  value={senderNameDisplay}
                  onValueChange={setSenderNameDisplay}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={senderNameDisplay ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
            </View>

            {/* Haptic Feedback */}
            <TouchableOpacity style={styles.personalTouchHapticOption}>
              <Text style={styles.personalTouchHapticText}>Haptic Feedback: Enable Hug Vibration</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Continue Button */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={styles.sendHugNowButton}
              onPress={goToSendHug}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']}
                style={styles.buttonGradient}
              >
                <Text style={styles.sendHugNowText}>Continue to Send</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const router = useRouter();
  // Screen 5: Send Hug Animation (Fifth Screen - Previously Fourth)
  if (currentScreen === 'sendHug') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={['#FF9A9E', '#FECFEF', '#FECFEF']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackPress}
            >
              <Ionicons name="chevron-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{selectedUserNames}</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.supportiveText}>Supportive user{'\n'}sends hug</Text>
            
            {/* Character and Animation Container */}
            <View style={styles.characterContainer}>
              {/* Ripple Effects */}
              <Animated.View 
                style={[
                  styles.ripple,
                  styles.ripple1,
                  {
                    transform: [{ scale: rippleScale }],
                    opacity: rippleOpacity,
                  }
                ]}
              />
              <Animated.View 
                style={[
                  styles.ripple,
                  styles.ripple2,
                  {
                    transform: [{ scale: rippleScale }],
                    opacity: rippleOpacity,
                  }
                ]}
              />
              <Animated.View 
                style={[
                  styles.ripple,
                  styles.ripple3,
                  {
                    transform: [{ scale: rippleScale }],
                    opacity: rippleOpacity,
                  }
                ]}
              />
              
              {/* 3D Character */}
              <Animated.View 
                style={[
                  styles.character,
                  {
                    transform: [{ scale: scaleAnimation }]
                  }
                ]}
              >
                {/* Character Body */}
                <View style={styles.characterBody}>
                  {/* Head */}
                  <View style={styles.characterHead}>
                    <View style={styles.characterFace}>
                      <View style={styles.eye} />
                      <View style={styles.eye} />
                    </View>
                    <View style={styles.characterHair} />
                  </View>
                  
                  {/* Arms and Body */}
                  <View style={styles.characterTorso}>
                    <View style={styles.leftArm} />
                    <View style={styles.rightArm} />
                    <View style={styles.body} />
                  </View>
                </View>
              </Animated.View>

              {/* Ground Circle */}
              <View style={styles.groundCircle} />
            </View>
          </View>

          {/* Message Display and Send Button */}
          <View style={styles.messageContainer}>
            <View style={styles.personalTouchMessageDisplay}>
              {/* Show Personal Message or AI Message */}
              {personalMessage.trim() ? (
                <View style={styles.personalTouchMessageSection}>
                  <Text style={styles.personalTouchMessageTypeLabel}>Your Personal Message:</Text>
                  <Text style={styles.personalTouchDisplayedMessage}>"{personalMessage.trim()}"</Text>
                </View>
              ) : useAIMessage && selectedHugType ? (
                <View style={styles.personalTouchMessageSection}>
                  <Text style={styles.personalTouchMessageTypeLabel}>AI Message:</Text>
                  <Text style={styles.personalTouchDisplayedMessage}>"{selectedHugType.message}"</Text>
                </View>
              ) : (
                <View style={styles.personalTouchMessageSection}>
                  <Text style={styles.personalTouchMessageTypeLabel}>Default Message:</Text>
                  <Text style={styles.personalTouchDisplayedMessage}>"Sending you a warm hug! 🤗"</Text>
                </View>
              )}
              
              {/* Settings Summary */}
              <View>
                <Text style={styles.personalTouchSettingsSummary}>
                  {anonymousMode ? '🔒 Anonymous' : '👤 With Name'} • 
                  {senderNameDisplay ? ' Name Shown' : ' Name Hidden'}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.sendHugNowButton}
              onPress={() => router.push('/(tabs)/hugsanimation')}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']}
                style={styles.buttonGradient}
              >
                <Text style={styles.sendHugNowText}>Send Hug Now</Text>
                <Ionicons name="heart" size={20} color="#FF9A9E" style={styles.personalTouchHeartIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Screen 6: Hug History Screen
  if (currentScreen === 'hugHistory') {
    const hugCountData = getHugCountForSelectedUsers();
    const filteredHistory = hugHistory.filter(hug => 
      hug.recipients && hug.recipients.some(recipient => 
        selectedUserIds.includes(recipient.id)
      )
    );

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={['#667eea', '#764ba2', '#6B73FF']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackPress}
            >
              <Ionicons name="chevron-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>💕 Hug Journey</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.historyContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.historyScrollContent}
          >
            {/* Beautiful Header Card */}
            <View style={styles.historyHeaderCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                style={styles.headerCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.headerCardContent}>
                  <Text style={styles.welcomeText}>Your Heartfelt</Text>
                  <Text style={styles.journeyText}>Hug Journey</Text>
                  <Text style={styles.subtitleText}>
                    Every hug tells a story of connection 🌟
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {/* History Timeline */}
            <View style={styles.timelineSection}>
              <Text style={styles.sectionTitle}>📚 Hug Timeline</Text>
              {hugHistory.length > 0 ? (
                <View style={styles.timeline}>
                  {hugHistory.map((item, index) => {
                    if (!item || !item.hugType) return null;
                    
                    return (
                    <View key={item.id} style={styles.timelineItem}>
                      {/* Timeline Line */}
                      <View style={styles.timelineLine}>
                        <View style={styles.timelineDot}>
                          <Text style={styles.timelineEmoji}>
                            {item.hugType?.emoji || '🤗'}
                          </Text>
                        </View>
                        {index < hugHistory.length - 1 && (
                          <View style={styles.timelineConnector} />
                        )}
                      </View>
                      
                      {/* Hug Card */}
                      <View style={styles.hugCardWrapper}>
                        <LinearGradient
                          colors={[
                            'rgba(255, 255, 255, 0.2)', 
                            'rgba(255, 255, 255, 0.1)'
                          ]}
                          style={styles.hugCardGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <View style={styles.hugCardHeader}>
                            <View style={styles.hugTypeInfo}>
                              <Text style={styles.hugTypeTitle}>
                                {item.hugType?.title || 'Hug'}
                              </Text>
                              <Text style={styles.hugTime}>
                                {item.time || 'Unknown time'}
                              </Text>
                            </View>
                            <View style={styles.hugDateBadge}>
                              <Text style={styles.hugDate}>
                                {item.date || 'Unknown date'}
                              </Text>
                            </View>
                          </View>
                          
                          <View style={styles.recipientsSection}>
                            <Text style={styles.recipientsLabel}>Sent with love to:</Text>
                            <View style={styles.recipientsList}>
                              {(item.recipients || []).map((recipient, recipientIndex) => (
                                <View key={recipientIndex} style={styles.recipientChip}>
                                  <Text style={styles.recipientName}>
                                    {recipient?.name || 'Unknown'}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </View>
                          
                          {/* Personal Settings Display */}
                          {item.personalSettings && (
                            <View style={styles.personalSettingsSection}>
                              <Text style={styles.settingsLabel}>Settings:</Text>
                              <View style={styles.settingsChips}>
                                {item.personalSettings.anonymousMode && (
                                  <View style={styles.settingChip}>
                                    <Text style={styles.settingChipText}>🔒 Anonymous</Text>
                                  </View>
                                )}
                                {item.personalSettings.senderNameDisplay && (
                                  <View style={styles.settingChip}>
                                    <Text style={styles.settingChipText}>👤 Name Shown</Text>
                                  </View>
                                )}
                                {item.personalSettings.useAIMessage && (
                                  <View style={styles.settingChip}>
                                    <Text style={styles.settingChipText}>🤖 AI Message</Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          )}
                          
                          {item.message && item.message.trim() && (
                            <View style={styles.historyMessageSection}>
                              <View style={styles.messageIcon}>
                                <Ionicons name="chatbubble-ellipses" size={16} color="rgba(255, 255, 255, 0.8)" />
                              </View>
                              <Text style={styles.messageText}>"{item.message}"</Text>
                            </View>
                          )}
                          
                          <View style={styles.hugFooter}>
                            <View style={styles.loveIndicator}>
                              <Text style={styles.loveText}>Made with 💖</Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </View>
                    </View>
                    );
                  }).filter(Boolean)}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <LinearGradient
                    colors={[
                      'rgba(255, 255, 255, 0.2)', 
                      'rgba(255, 255, 255, 0.1)'
                    ]}
                    style={styles.emptyStateGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.emptyStateContent}>
                      <Text style={styles.emptyStateEmoji}>🌙</Text>
                      <Text style={styles.emptyStateTitle}>No Hugs Yet</Text>
                      <Text style={styles.emptyStateSubtitle}>
                        Your hug journey is just beginning...
                      </Text>
                      <View style={styles.encouragementBadge}>
                        <Text style={styles.encouragementText}>Start spreading love! 💕</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // Default return (should not reach here)
  return null;
};

export default ChooseHugTypeScreen;