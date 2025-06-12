import * as React from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from './index.style';
import { useEventDetail } from './useEventDetail';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import FastImageWithLoader from '@/src/components/common/fastImageWithLoader';


const EventDetail: React.FC = () => {
  const { loading , eventDetails  , joinEventHandler } = useEventDetail();

  const Item =({icon , label})=>{
    return( <View style={styles.itemContainer}>
         {icon}
            <Text style={styles.itemLabel}>{label}</Text>

        
    </View>)
  }


   if (loading) {
      return (
        <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#ffffff" />
        </SafeAreaView>
      );
    }

  return (
    <View style={styles.safeArea}>
        <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
               <View style={styles.headerContainer}>
                <Ionicons name="arrow-back" size={32} color="#000" onPress={() => {router.back()}} />
            <Text style={styles.headerLabel}>{eventDetails?.name}</Text>
            </View>
            <View style={styles.rowContainer}>
            <View style={styles.badgeContainer}>
                <Text>{eventDetails?.mood_tag}</Text>
            </View>
            </View>
            <FastImageWithLoader
              source={
                eventDetails?.event_image
                  ? { uri: eventDetails?.event_image }
                  : require('../../../assets/images/party_pic.jpg')
              }
                style={{ width: '100%', height: 200, borderRadius: 32, marginTop: 16  , marginBottom:-32 }}
                imageStyle={{ borderRadius: 32 }}
            />
        </View>
        <View style={styles.detailsContainer}>
            <Item 
            label={eventDetails?.location?.name || 'Location not specified'}
            icon={<Ionicons name="map-sharp" color='#31c0bc' size={22}/>}/>
            <Item 
            label={
              eventDetails?.event_datetime
            ? require('moment')(eventDetails.event_datetime).format('MMMM D, YYYY h:mm A')
            : 'Start time not specified'
            }
            icon={<Ionicons name="calendar-clear-outline" color='#31c0bc' size={22}/>}/>
            <Item 
            label={`Up to ${eventDetails?.list_of_users?.length} people`}
            icon={<Ionicons name="person" color='#31c0bc' size={22}/>}/>
            <Item 
            label='Public'
            icon={<Ionicons name="person" color='#31c0bc' size={22}/>}/>

            <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {eventDetails?.list_of_users.map((_, idx) => (
              <FastImageWithLoader
              source={
                eventDetails?.user_img
                  ? { uri: eventDetails?.user_img }
                  : require('../../../assets/images/avatar-pic.jpg')

              }
              imageStyle={{ borderRadius: 16 }}
                key={idx}
                style={{
                height: 38,
                width: 38,
                borderRadius: 16,
                marginRight: idx !== 14 ? 8 : 0,
                }}
               
            />
            ))}
            </ScrollView>

            </View>
           

            <View style={styles.divider} />
             <Text style={styles.descriptionLabel}>Description</Text>
             <Text style={styles.descriptionValue}>{eventDetails?.description}</Text>
             {eventDetails?.virtual_hug &&
               <Item 
            label='Virtual Hug Exchange'
            icon={<Ionicons name="checkmark-done-circle-sharp" color='#31c0bc' size={22}/>}/>
             }
             {eventDetails?.journaling_prompts &&
              <Item 
            label='Journaling Prompts'
            icon={<Ionicons name="checkmark-done-circle-sharp" color='#31c0bc' size={22}/>}/>
             }
            {eventDetails?.anonymous_check_ins &&
              <Item 
            label='Anonymous Check-Ins'
            icon={<Ionicons name="checkmark-done-circle-sharp" color='#31c0bc' size={22}/>}/>
    }
        </View>

        </ScrollView>

          <TouchableOpacity disabled={eventDetails?.joined_event} onPress={joinEventHandler} style={[styles.buttonStyle , eventDetails?.joined_event && {backgroundColor:'gray'}] }>
            <Text style={styles.buttonText}>{eventDetails?.joined_event ? 'Already Joined' : 'Join Event'  }</Text>
          </TouchableOpacity>
    </View>
  );
};

export default EventDetail;
