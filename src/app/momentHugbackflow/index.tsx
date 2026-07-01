import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  Switch,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
import { styles } from './style';
import { useMomentHugBackFlow } from './usemomenthugback';


const momentHugFlow = () => {

const {
  step,
  selectedHug,
  setSelectedHug,
  message,
  setMessage,
  isAnonymous,
  setIsAnonymous,
  hugs,
  loading,
  goToNextScreen,
  goToPreviousScreen,
  goToFirstScreen,
  handleSendHug,
} = useMomentHugBackFlow();

  // State variables needed for the three screens
//   const [selectedHug, setSelectedHug] = useState(null);
  const [aiSelected, setAISelected] = useState(false);
// Fix: Calculate isSelectHugDisabled based on selectedHug
  const isSelectHugDisabled = selectedHug === null;
  
  // Sample data
//   const hugs = [
//     { emoji: '😊', label: 'Warm\nHug' , value:'Warm Hug' },
//     { emoji: '🧕', label: 'Encouraging\nHug' , value: 'Encouraging Hug' },
//     { emoji: '🎉', label: 'Excited\nHug' , value: 'Excited Hug' },
//     { emoji: '💙', label: 'Calm\nHug' , value: 'Calm Hug' },
//   ];

  const virtualHugsSuggestions = {
    messages: [
      "Thinking of you too 💙",
      "You've got this! ✨",
      "Sending warmth! 💙",
    ]
  };


  // Screen 1: Select Hug
  const renderSelectHugScreen = () => {
    const renderCard = (item, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.card,
          selectedHug === index && { borderColor: '#7D75FF', borderWidth: 2 },
        ]}
        onPress={() => {
          setSelectedHug(index);
          setAISelected(false);
        }}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.cardLabel}>
          {item.label.split('\n').map((line, i) => (
            <Text key={i}>
              {line}
              {i !== item.label.split('\n').length - 1 && '\n'}
            </Text>
          ))}
        </Text>
      </TouchableOpacity>
    );

    return (
      // <ImageBackground
      //   source={require('../../assets/images/backgrounds/Sending a hug - Screen 7.png')}
      //   style={styles.backgroundImage}
      //   resizeMode="cover"
      // >

      <LinearGradient
          colors={[
            '#EDE7F6', // very light lavender (top-left)
            '#F3E5F5', // soft pinkish-lavender
            '#E1F5FE', // very light blue (bottom-right glow)
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.appName}>Mynkl</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.title}>send a Hug Back</Text>
          {/* <Text style={styles.subtitle}>What type of hug would{'\n'}you like to send?</Text> */}

          <View style={styles.cardGrid}>
            {renderCard(hugs[0], 0)}
            {renderCard(hugs[1], 1)}
          </View>
          <View style={styles.cardGrid}>
            {renderCard(hugs[2], 2)}
            {renderCard(hugs[3], 3)}
          </View>

          {/* <TouchableOpacity
            style={styles.radioRow}
            onPress={() => {
              setAISelected(true);
              setSelectedHug(null);
            }}
          >
            <View style={styles.radioOuter}>
              {aiSelected && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>Let AI choose based on my</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={[
              styles.buttonWrapper,
              isSelectHugDisabled && styles.disabledButton
            ]}
            onPress={goToNextScreen}
           disabled={isSelectHugDisabled}
          >
            <LinearGradient
              colors={['#B09CFF', '#7D75FF']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
        </LinearGradient>
      // </ImageBackground>
    );
  };

  // Screen 3: Personal Message
  const renderPersonalMessageScreen = () => {
    return (
      // <ImageBackground
      //   source={require('../../assets/images/backgrounds/Sending a hug - Screen 8.png')}
      //   style={styles.backgroundImage}
      //   resizeMode="cover"
      // >

      <LinearGradient
          colors={[
            '#EDE7F6', // very light lavender (top-left)
            '#F3E5F5', // soft pinkish-lavender
            '#E1F5FE', // very light blue (bottom-right glow)
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >

        
        <SafeAreaView style={styles.messageContainer}>
          <View style={styles.messageHeader}>
            <TouchableOpacity onPress={goToPreviousScreen}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.appName}>Mynkl</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messageContent}
          >
            <Text style={styles.messageTitle}>Add a Personal{'\n'}Message</Text>
            <Text style={styles.messageSubtitle}>What would you like to say?</Text>

            <TextInput
              placeholder="Type your own message..."
              placeholderTextColor="#C7C7CD"
              value={message}
              onChangeText={setMessage}
              style={styles.input}
              multiline
              textAlignVertical="top"
            />

            {virtualHugsSuggestions?.messages?.slice(0, 2).map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={styles.presetCard}
                onPress={() => setMessage(preset)}
              >
                <Text style={styles.presetText}>{preset}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={styles.addEmojiContainer}
              onPress={() => console.log('Add Emoji or GIF')}
            >
              <Text style={styles.addEmoji}>Add Emoji or GIF</Text>
            </TouchableOpacity>

            {/* <View style={styles.anonymousContainer}>
              <View>
                <Text style={styles.anonymousTitle}>Send Anonymously</Text>
                <Text style={styles.anonymousSubtitle}>
                  Send quietly. Support without being seen 🤍
                </Text>
              </View>

              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: '#E5E7EB', true: '#8B7CF6' }}
                thumbColor={'#fff'}
              />
            </View> */}

            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={handleSendHug}
            >
              <LinearGradient
                colors={['#8B7CF6', '#6972eb']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Send Hug</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
        </LinearGradient>
      // </ImageBackground>
    );
  };

  // Screen 4: Hug Confirmation
  const renderConfirmationScreen = () => {
    const router = useRouter();
    return (
      // <ImageBackground
      //   source={require('../../assets/images/backgrounds/Sending a hug - Screen 10.png')}
      //   style={styles.backgroundImage}
      //   resizeMode="cover"
      // >

      <LinearGradient
          colors={[
            '#EDE7F6', // very light lavender (top-left)
            '#F3E5F5', // soft pinkish-lavender
            '#E1F5FE', // very light blue (bottom-right glow)
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
        <SafeAreaView style={styles.confirmationSafeArea}>
          <TouchableOpacity style={styles.confirmationBackButton} onPress={goToPreviousScreen}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>

          <Text style={styles.confirmationTitle}>Your hug is{'\n'}on its way.</Text>

          <View style={styles.heartImagePlaceholder}>
            <Image 
              source={require('../../assets/images/Heart-preview.png')} 
              style={styles.characterImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.confirmationSubtitle}>You just made{'\n'}someone's day.</Text>

          <TouchableOpacity style={styles.sendAnotherButton} onPress={goToFirstScreen}>
            <Text style={styles.sendAnotherButtonText}>Send Another Hug</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => router.push('/(tabs)/recevie_hugs')}
          >
            <Text style={styles.dashboardButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </SafeAreaView>
        </LinearGradient>
      // </ImageBackground>
    );
  };

  // Fix: Conditionally render based on step
  if (step === 1) {
    return renderSelectHugScreen();
  } else if (step === 2) {
    return renderPersonalMessageScreen();
  } else if (step === 3) {
    return renderConfirmationScreen();
  }
  
  // Default fallback
  return renderSelectHugScreen();
};


export default momentHugFlow;