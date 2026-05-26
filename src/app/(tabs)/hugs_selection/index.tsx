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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './style';
import { useVirtualHugLogic } from './VirtualHugLogic';
import { router, useRouter } from 'expo-router';
import { getUsers } from '@/src/services/apis';
import GifPickerModal from './gifpickermodal';

const VirtualHugFlow = () => {
 const [showLonelyUser, setShowLonelyUser] = useState(false);
  const {
    // State
    currentScreen,
    selectedHug,
    aiSelected,
    activeTab,
    searchText,
    selectedFriends,
    message,
    lastCheckInMood,    
    isSelectHugDisabled,
    // Data
    hugs,
    friends,
    presets,
    hugPrompts,
    aiSuggestion,
    loadingRevealSetting,

    filteredUsers,
    communityUsers,
    bestUser,          
    isAnonymous,
    setIsAnonymous,

    // Navigation functions
    goToNextScreen,
    goToPreviousScreen,
    goToFirstScreen,
    
    // Action functions
    toggleFriendSelection,
    handleSendHug,
    setSelectedHug,
    setAISelected,
    setActiveTab,
    setSearchText,
    setMessage,
    virtualHugsSuggestions,
    // Add these new ones:
  selectedGif,
  setSelectedGif,
  isGifModalVisible,
  setIsGifModalVisible,
  fetchGifs,
currentHugType
    
  } = useVirtualHugLogic();

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
       <ImageBackground
        source={require('../../../assets/images/backgrounds/Sending a hug - Screen 7.png')} // Set your image path
        style={styles.backgroundImage}
        resizeMode="cover"
      >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style = {styles.backButton}> 
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.appName}>Mynkl</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.title}>Select a Hug</Text>
        <Text style={styles.subtitle}>What type of hug would{'\n'}you like to send?</Text>

        <View style={styles.cardGrid}>
          {renderCard(hugs[0], 0)}
          {renderCard(hugs[1], 1)}
        </View>
        <View style={styles.cardGrid}>
          {renderCard(hugs[2], 2)}
          {renderCard(hugs[3], 3)}
        </View>

        <TouchableOpacity
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
        </TouchableOpacity>

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
      </ImageBackground>
    );
  };

  // Screen 2: Choose Recipient
  const renderChooseRecipientScreen = () => {
    
   
    const renderFriendItem = ({ item }) => {
      const isSelected = selectedFriends.includes(item?.id);
      
      return (
        <TouchableOpacity 
          key={item.id}
          style={[styles.friendItem, isSelected && styles.selectedFriendItem]}
          onPress={() => toggleFriendSelection(item?.id)}
        >
          <Image source={{ uri: item?.profile_pic ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" }} style={styles.avatar} />
          <Text style={[styles.friendName, isSelected && styles.selectedFriendName]}>
            {item?.name}
          </Text>
          {isSelected && (
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      );
    };


   

    return (
       <ImageBackground
        source={require('../../../assets/images/backgrounds/Sending a hug - Screen 9.png')} // Set your image path
        style={styles.backgroundImage}
        resizeMode="cover"
      >
      <SafeAreaView style={styles.recipientContainer}>
        {/* Header */}
        <View style={styles.recipientHeader}>
          <TouchableOpacity style={styles.backButton} onPress={goToPreviousScreen}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mynkl</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.recipientTitle}>Choose Recipient</Text>
            <Text style={styles.recipientSubtitle}>Who would you like to send{'\n'}the hug to?</Text>

            {/* Tab Navigation */}
<View style={styles.tabContainer}>
  <TouchableOpacity
    style={[
      styles.tabButton,
      activeTab === 'Friend List' && styles.activeTabButton,
    ]}
    onPress={() => setActiveTab('Friend List')}
  >
    <Text
      style={[
        styles.tabButtonText,
        activeTab === 'Friend List' && styles.activeTabText,
      ]}
    >
      Friend List
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.tabButton,
      activeTab === 'Community Match' && styles.activeTabButton,
    ]}
    onPress={() => setActiveTab('Community Match')}
  >
    <Text
      style={[
        styles.tabButtonText,
        activeTab === 'Community Match' && styles.activeTabText,
      ]}
    >
      Community Match
    </Text>
  </TouchableOpacity>
</View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#999"
              />
            </View>

            {/* Lonely Message Card */}
<TouchableOpacity
  style={styles.lonelyMessage}
  onPress={() => {
    if (lastCheckInMood?.toLowerCase() === 'lonely') {
      setShowLonelyUser(prev => !prev);
    }
  }}
  activeOpacity={0.8}
>
  <View style={styles.heartIcon}>
    <Text style={styles.heartEmoji}>💗</Text>
  </View>
  <Text style={styles.lonelyText}>
    {aiSuggestion?.messages ?? "Feeling lonely? Send a hug to someone!"}
  </Text>
  {lastCheckInMood?.toLowerCase() === 'lonely' && (
    <Ionicons
      name={showLonelyUser ? "chevron-up" : "chevron-down"}
      size={18}
      color="#7D75FF"
    />
  )}
</TouchableOpacity>

{/* List */}
<View style={styles.friendsListContainer}>
  {showLonelyUser && lastCheckInMood?.toLowerCase() === 'lonely' ? (
    bestUser && renderFriendItem({ item: bestUser })
  ) : (
    filteredUsers?.map((item) => renderFriendItem({ item }))
  )}
</View>
          </View>
        </ScrollView>

        {/* Next Button */}
        {selectedFriends.length > 0 && (
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={goToNextScreen}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" style={styles.nextArrow} />
          </TouchableOpacity>
        )}
      </SafeAreaView>
      </ImageBackground>
    );
  };

  // Screen 3: Personal Message
  const renderPersonalMessageScreen = () => {
    return (
       <ImageBackground
        source={require('../../../assets/images/backgrounds/Sending a hug - Screen 8.png')} // Set your image path
        style={styles.backgroundImage}
        resizeMode="cover"
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
          // keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.messageContent}
        >

        {/* <View style={styles.messageContent}> */}
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

            {hugPrompts.slice(0, 2).map((prompt, index) => (
  <TouchableOpacity
    key={index}
    style={styles.presetCard}
    onPress={() => setMessage(prompt)}
  >
    <Text style={styles.presetText}>{prompt}</Text>
  </TouchableOpacity>
))}

          {/* Updated button to open modal */}
          <TouchableOpacity 
            style={styles.addEmojiContainer}
            onPress={() => setIsGifModalVisible(true)} // <-- Open modal here
          >
            {/* Show selected GIF preview if exists */}
            {selectedGif ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image 
                  source={{ uri: selectedGif.url }} 
                  style={{ width: 40, height: 40, borderRadius: 8 }}
                />
                <Text style={styles.addEmoji}>Change GIF</Text>
              </View>
            ) : (
              <Text style={styles.addEmoji}>Add Emoji or GIF</Text>
            )}
          </TouchableOpacity>

          <View style={styles.anonymousContainer}>
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
                disabled={loadingRevealSetting}
              />
            </View>

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
       
        {/* Add the Modal component here */}
        <GifPickerModal
          visible={isGifModalVisible}
          onClose={() => setIsGifModalVisible(false)}
          onSelectGif={(gif) => {
            setSelectedGif(gif);
            setIsGifModalVisible(false);
          }}
          selectedGifId={selectedGif?.id}
          fetchGifs={fetchGifs}
          hugType={currentHugType} // Pass the current hug type
        />

      </SafeAreaView>
      </ImageBackground>
    );
  };

  // Screen 4: Hug Confirmation
  const renderConfirmationScreen = () => {
    const router = useRouter();
    return (
      // <LinearGradient
      //   colors={['#FDF2FF', '#F3F0FF']}
      //   style={styles.confirmationContainer}
      // >
         <ImageBackground
        source={require('../../../assets/images/backgrounds/Sending a hug - Screen 10.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.confirmationSafeArea}>
          {/* Back Button */}
          <TouchableOpacity style={styles.confirmationBackButton} onPress={goToPreviousScreen}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.confirmationTitle}>Your hug is{'\n'}on its way.</Text>

          {/* Heart Image - Using placeholder since we don't have the image */}
          <View style={styles.heartImagePlaceholder}>
            {/* <Text style={styles.heartPlaceholderText}>💝</Text> */}
            {/* Replace this View with your Image component */}
              <Image 
                source={require('../../../assets/images/Heart-preview.png')} 
                style={styles.characterImage}
                resizeMode="contain"
              />
          </View>

          {/* Subtitle */}
          <Text style={styles.confirmationSubtitle}>You just made{'\n'}someone's day.</Text>

          {/* Send Another Hug Button */}
          <TouchableOpacity style={styles.sendAnotherButton} onPress={goToFirstScreen}>
            <Text style={styles.sendAnotherButtonText}>Send Another Hug</Text>
          </TouchableOpacity>

          {/* Back to Dashboard Button */}
          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => router.push('/(tabs)/recevie_hugs')} // <-- '/dashboard'  route
          >
            <Text style={styles.dashboardButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </SafeAreaView>
      {/* </LinearGradient> */}
      </ImageBackground>
    );
  };

  // Main render function
  return (
    <>
      {currentScreen === 'selectHug' && renderSelectHugScreen()}
      {currentScreen === 'chooseRecipient' && renderChooseRecipientScreen()}
      {currentScreen === 'personalMessage' && renderPersonalMessageScreen()}
      {currentScreen === 'confirmation' && renderConfirmationScreen()}
    </>
  );
};

export default VirtualHugFlow;