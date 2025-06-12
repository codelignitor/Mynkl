import { useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { styles } from './index-style';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { createEvent } from '@/src/services/apis';
import Toast from 'react-native-toast-message';

export const useEventCreationLogic = () => {
  // State variables
  const [selectedEventType, setSelectedEventType] = useState('cafe');
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [eventTitle, setEventTitle] = useState('');
  const [virtualHug, setVirtualHug] = useState(true);
  const [journalingPrompts, setJournalingPrompts] = useState(true);
  const [musicPlaylist, setMusicPlaylist] = useState(true);
  const [anonymousCheckins, setAnonymousCheckins] = useState(true);
  const [imageData, setImageData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState(
    ""
  );

  const [eventData , setEventData] = useState(null);

  
  const params = useLocalSearchParams();
  useEffect(() => {
    let data = null;
    let image = null;
    try {
      data = JSON.parse(params.data as string);
      image = JSON.parse( params.image as string) ;
      setEventData(data);
      setImageData(image);
      setEventTitle(data?.name || '');
      // setSelectedEventType(data?.eventType || '');
      setSelectedMood(data?.mood_tag || '');
      setInvitationMessage(data?.description || '');

    } catch {
      data = null;
    }
    console.log('Event Creation Data:', data);
  }, [params.data]);


    const uploadImage = async (image) => {
  const formData = new FormData();


  formData?.append('file', image?.assets[0]?.uri ? {
    uri: image.assets[0].uri,
    type: image.assets[0].type ||   'image/jpeg',
    name: image.assets[0].fileName || `image_${Date.now()}.jpg`,
  } : image.assets[0]);
  console.log('Uploading image:',JSON.stringify( formData));

  try {
   
    const response = await fetch('http://13.50.228.222:8000/events/upload_image', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();
    console.log('Uploaded image URL:', data.url);
    return data.url; // Return the uploaded image URL
  } catch (error) {
    console.error('Upload failed:', error);
  }
};


const previewEventHandler = async () => {
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
         event_image: imageData?.assets[0]?.uri || null,
    }
      router.push({ pathname: '/previewEvent/eventData', 
       params: { data: JSON.stringify(payload) }
    });
  
}


  const createEventHandler = async ()=>{
    try {

      setIsLoading(true);

   const url =  await  uploadImage(imageData);
     

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
         event_image_url: url,
    }

       console.log('Payload for event creation:', payload);


    
    const response = await   createEvent(payload)
    console.log('Event created successfully:', response);
    Toast.show({
      type: 'success',
      text1: 'Event Created',
      text2: 'Your event has been created successfully!',
    });
    router.push('/activity');
    } catch (error) {
     
    }
    finally {
      setIsLoading(false);
    }
  }

  

  // Event types data
const eventTypes = [
  {
    id: 'park',
    icon: 'tree-outline',
    label: 'Park /\nNature Area',
    color: '#A8D5BA',
    selectedColor: '#2ECC71',
    borderColor: '#C7EFD7',
    shadowColor: '#A8D5BA',
  },
  {
    id: 'cafe',
    icon: 'cafe-outline',
    label: 'Café /\nCoffee Shop',
    color: '#FFD59E',
    selectedColor: '#E67E22',
    borderColor: '#FFE2BA',
    shadowColor: '#FFD59E',
  },
  {
    id: 'restaurant',
    icon: 'restaurant-outline',
    label: 'Restaurant /\nEatery',
    color: '#F49FB6',
    selectedColor: '#E74C3C',
    borderColor: '#F8BCC9',
    shadowColor: '#F49FB6',
  },
  {
    id: 'bar',
    icon: 'wine-outline',
    label: 'Bar /\nLounge',
    color: '#D9A8FF',
    selectedColor: '#9B59B6',
    borderColor: '#E6C9FF',
    shadowColor: '#D9A8FF',
  },
  {
    id: 'coworking',
    icon: 'laptop-outline',
    label: 'Co-working\nSpace',
    color: '#A8C8EC',
    selectedColor: '#3498DB',
    borderColor: '#C5DDFC',
    shadowColor: '#A8C8EC',
  },
  {
    id: 'wellness',
    icon: 'heart-outline',
    label: 'Wellness Center /\nYoga',
    color: '#96DED1',
    selectedColor: '#1ABC9C',
    borderColor: '#B7F1E7',
    shadowColor: '#96DED1',
  },
  {
    id: 'event',
    icon: 'ticket-outline',
    label: 'Event\nVenue',
    color: '#FECF81',
    selectedColor: '#E67E22',
    borderColor: '#FFE2B3',
    shadowColor: '#FECF81',
  },
  {
    id: 'virtual',
    icon: 'headset-outline',
    label: 'Virtual\nSpace',
    color: '#B9B3F8',
    selectedColor: '#8E44AD',
    borderColor: '#D4CFFB',
    shadowColor: '#B9B3F8',
  },
  {
    id: 'custom',
    icon: 'extension-puzzle-outline',
    label: 'Custom\nLocation',
    color: '#CCCCCC',
    selectedColor: '#7F8C8D',
    borderColor: '#E0E0E0',
    shadowColor: '#CCCCCC',
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
    isLoading,
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
    handleBackPress,
    previewEventHandler
  };
};