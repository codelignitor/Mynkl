import { useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { styles } from './index-style';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { createEvent } from '@/src/services/apis';
import Toast from 'react-native-toast-message';

export const useEventCreationLogic = () => {
  // State variables
  const [selectedEventType, setSelectedEventType] = useState('journaling');
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [eventTitle, setEventTitle] = useState('');
  const [virtualHug, setVirtualHug] = useState(true);
  const [journalingPrompts, setJournalingPrompts] = useState(true);
  const [musicPlaylist, setMusicPlaylist] = useState(true);
  const [anonymousCheckins, setAnonymousCheckins] = useState(true);
  const [invitationMessage, setInvitationMessage] = useState(
    ""
  );

  const [eventData , setEventData] = useState(null);

  
  const params = useLocalSearchParams();
  useEffect(() => {
    let data = null;
    try {
      data = JSON.parse(params.data as string);
      setEventData(data);
      setEventTitle(data?.name || '');
      // setSelectedEventType(data?.eventType || '');
      setSelectedMood(data?.mood_tag || '');
      setInvitationMessage(data?.description || '');

    } catch {
      data = null;
    }
    console.log('Event Creation Data:', data);
  }, [params.data]);


  const createEventHandler =()=>{
    try {

    const payload = {
      ...(typeof eventData === 'object' && eventData !== null ? eventData : {}),
      journaling_prompts: journalingPrompts,
      music_playlist: musicPlaylist,
      virtual_hug: virtualHug,
      type: selectedEventType,
       eventType: selectedEventType,
      mood: selectedMood,
      description: invitationMessage.trim(),
       name: eventTitle.trim(),
      mood_tag: selectedMood,
    }

       console.log('Payload for event creation:', payload);


    
    const response =    createEvent(payload)
    console.log('Event created successfully:', response);
    Toast.show({
      type: 'success',
      text1: 'Event Created',
      text2: 'Your event has been created successfully!',
    });
    router.push('/activity');
    } catch (error) {
      
    }
  }

  

  // Event types data
  const eventTypes = [
    {
      id: 'mindfulness',
      icon: 'person',
      label: 'Mindfulness/\nMeditation',
      color: '#D4C5F9',
      selectedColor: '#9B59B6',
      borderColor: '#E8D5FF',
      shadowColor: '#D4C5F9',
    },
    {
      id: 'group',
      icon: 'people',
      label: 'Group Talk\nor Support Space',
      color: '#A8C8EC',
      selectedColor: '#3498DB',
      borderColor: '#C5DDFC',
      shadowColor: '#A8C8EC',
    },
    {
      id: 'journaling',
      icon: 'document-text',
      label: 'Journaling\nCircle',
      color: '#5DBEA3',
      selectedColor: '#16A085',
      borderColor: '#7DCEA0',
      shadowColor: '#5DBEA3',
    },
    {
      id: 'music',
      icon: 'musical-notes',
      label: 'Music &\nChill',
      color: '#E6B8FF',
      selectedColor: '#AF7AC5',
      borderColor: '#F0C5FF',
      shadowColor: '#E6B8FF',
    },
    {
      id: 'fitness',
      icon: 'barbell-outline',
      label: 'Wellness &\nFitness',
      color: '#FFB366',
      selectedColor: '#E67E22',
      borderColor: '#FFC999',
      shadowColor: '#FFB366',
    },
    {
      id: 'creative',
      icon: 'color-palette-outline',
      label: 'Creative\nWorkshop',
      color: '#FF9AA2',
      selectedColor: '#E74C3C',
      borderColor: '#FFB3B8',
      shadowColor: '#FF9AA2',
    },
    {
      id: 'other',
      icon: 'add-circle',
      label: 'Other\nEvent',
      color: '#B8B8B8',
      selectedColor: '#7F8C8D',
      borderColor: '#CCCCCC',
      shadowColor: '#B8B8B8',
    },
  ];

  const handleBackPress = () => {
     
      router.back();
     
    };

  // Moods data
  const moods = ['Happy' , 'Calm', 'Stressed', 'Lonely'];

  // Style functions
  const getEventTypeStyle = (type) => {
    const isSelected = selectedEventType === type.id;
    return {
      ...styles.eventTypeItem,
      backgroundColor: isSelected ? type.selectedColor : type.color,
      borderWidth: isSelected ? 2 : 0,
      borderColor: isSelected ? type.borderColor : 'transparent',
      ...(Platform.OS === 'ios' && {
        shadowColor: type.shadowColor,
        shadowOffset: {
          width: 0,
          height: isSelected ? 4 : 2,
        },
        shadowOpacity: isSelected ? 0.3 : 0.15,
        shadowRadius: isSelected ? 6 : 3,
      }),
      ...(Platform.OS === 'android' && {
        elevation: isSelected ? 8 : 4,
      }),
      transform: [{ scale: isSelected ? 1.05 : 1 }],
    };
  };

  const getEventTypeTextStyle = (type) => {
    const isSelected = selectedEventType === type.id;
    return {
      ...styles.eventTypeText,
      color: isSelected ? type.selectedColor : '#333',
      fontWeight: isSelected ? '700' : '500',
      fontSize: isSelected ? 11 : 10,
    };
  };

  // Event handlers
  const handlePublish = () => {
    console.log('Publishing event with data:', {
      eventType: selectedEventType,
      eventTitle: eventTitle,
      mood: selectedMood,
      invitationMessage,
      features: {
        virtualHug,
        journalingPrompts,
        musicPlaylist,
        anonymousCheckins,
      }
    });
    
    // Example actions:
    // navigation.navigate('EventPublished');
    // showSuccessMessage();
    // submitEventToAPI();
  };

  return {
    // State
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
    createEventHandler,
    
    // Data
    eventTypes,
    moods,
    
    // Functions
    getEventTypeStyle,
    getEventTypeTextStyle,
    handlePublish,
    handleBackPress
  };
};