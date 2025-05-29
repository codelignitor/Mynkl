import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEventCreationLogic } from './useEventCreationLogic';
import { styles } from './index-style';
import { useLocalSearchParams } from 'expo-router';

const EventCreationScreen = () => {
  const {
    selectedEventType,
    setSelectedEventType,
    selectedMood,
    setSelectedMood,
    eventTitle,
    setEventTitle,
    virtualHug,
    setVirtualHug,
    journalingPrompts,
    setJournalingPrompts,
    musicPlaylist,
    setMusicPlaylist,
    anonymousCheckins,
    setAnonymousCheckins,
    invitationMessage,
    setInvitationMessage,
    eventTypes,
    moods,
    getEventTypeStyle,
    createEventHandler,
    getEventTypeTextStyle,
    handlePublish,
    handleBackPress
  } = useEventCreationLogic();


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create an Event</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Content Container */}
        <View style={styles.mainContentContainer}>
          {/* Event Type Selection */}
          <View style={styles.section}>
            <View style={styles.eventTypeContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContainer}
              >
                {eventTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={styles.eventTypeWrapper}
                    onPress={() => setSelectedEventType(type.id)}
                    activeOpacity={0.7}
                  >
                    <View style={getEventTypeStyle(type)}>
                      <Ionicons
                        name={type.icon}
                        size={selectedEventType === type.id ? 28 : 26}
                        color={selectedEventType === type.id ? '#fff' : '#666'}
                      />
                    </View>
                    <Text style={getEventTypeTextStyle(type)}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Event Type Label */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Type</Text>
            <TouchableOpacity 
              style={styles.selectedEventContainer}
              onPress={() => {
                console.log('Edit event title clicked');
              }}
              activeOpacity={0.7}
            >
              <TextInput
                style={styles.eventTitleInput}
                value={eventTitle}
                onChangeText={setEventTitle}
                placeholder="Enter event title..."
                placeholderTextColor="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Mood Tag */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mood Tag</Text>
            <View style={styles.moodScrollContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.moodScrollContent}
              >
                {moods.map((mood) => (
                  <TouchableOpacity
                    key={mood}
                    style={[
                      styles.moodTag,
                      selectedMood === mood && styles.selectedMoodTag,
                    ]}
                    onPress={() => setSelectedMood(mood)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.moodTagText,
                        selectedMood === mood && styles.selectedMoodTagText,
                      ]}
                    >
                      {mood}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Mood Invitation Message */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Mood Invitation Message{' '}
              <Text style={styles.optionalText}>(Optional)</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={invitationMessage}
              onChangeText={setInvitationMessage}
              multiline
              placeholder="Enter your invitation message..."
            />
          </View>

          {/* Toggle Options */}
          <View style={styles.section}>
            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Ionicons name="checkmark-circle" size={20} color="#5DBEA3" />
                <Text style={styles.toggleText}>Virtual Hug Exchange</Text>
              </View>
              <Switch
                value={virtualHug}
                onValueChange={setVirtualHug}
                trackColor={{ false: '#E0E0E0', true: '#5DBEA3' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Ionicons name="checkmark-circle" size={20} color="#5DBEA3" />
                <Text style={styles.toggleText}>Journaling Prompts</Text>
              </View>
              <Switch
                value={journalingPrompts}
                onValueChange={setJournalingPrompts}
                trackColor={{ false: '#E0E0E0', true: '#5DBEA3' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Ionicons name="checkmark-circle" size={20} color="#5DBEA3" />
                <Text style={styles.toggleText}>Music Playlist</Text>
              </View>
              <Switch
                value={musicPlaylist}
                onValueChange={setMusicPlaylist}
                trackColor={{ false: '#E0E0E0', true: '#5DBEA3' }}
                thumbColor="#fff"
              />
            </View>

            {/* <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Ionicons name="checkmark-circle" size={20} color="#5DBEA3" />
                <Text style={styles.toggleText}>Anonymous Check-Ins</Text>
              </View>
              <Switch
                value={anonymousCheckins}
                onValueChange={setAnonymousCheckins}
                trackColor={{ false: '#E0E0E0', true: '#5DBEA3' }}
                thumbColor="#fff"
              />
            </View> */}
          </View>

          {/* Event Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Preview</Text>
            <TouchableOpacity 
              style={styles.previewContainer}
              onPress={() => {
                console.log('Event preview clicked');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.previewIcon}>
                <Ionicons name="document-text" size={20} color="#5DBEA3" />
              </View>
              <View style={styles.previewText}>
                <Text style={styles.previewTitle}>Create a journaling</Text>
                <Text style={styles.previewSubtitle}>space for calm minds</Text>
              </View>
              <View style={styles.previewArrow}>
                <Ionicons name="chevron-forward" size={20} color="#5DBEA3" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Publish Button */}
          <TouchableOpacity 
            style={styles.publishButton}
            onPress={createEventHandler}
            activeOpacity={0.8}
          >
            <Text style={styles.publishButtonText}>Publish Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventCreationScreen;