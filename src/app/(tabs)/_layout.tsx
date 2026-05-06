import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/src/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {Stack} from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { View, Text } from 'react-native';
import { HapticTab } from '@/src/components/HapticTab';
import BlurTabBarBackground from '@/src/components/ui/TabBarBackground.ios';
import { IconSymbol } from '@/src/components/ui/IconSymbol';



export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#46596a',
        tabBarInactiveTintColor: '#fff',
        headerShown: false,    
        tabBarStyle: {
          backgroundColor: '#8c9bac',
      position: 'absolute',          
      borderTopWidth: 0,    
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20, 
              
      elevation: 0,
         
         }
      }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="moodMap/index"
        options={{
          title: 'MoodMap',
          tabBarIcon: ({ color }) =>  <Ionicons name="map-sharp" size={24} color={color} />,
        }}
      />


      <Tabs.Screen
        name="recevie_hugs/index"
        options={{
          title: 'Hugs',
          tabBarIcon: ({ color }) => <Ionicons name="chatbox" size={24} color={color} />,
        }}
      />
       {/* <Tabs.Screen
        name="hugs/index"
        options={{
          title: 'Hugs',
          tabBarIcon: ({ color }) => <Ionicons name="chatbox" size={24} color={color} />,
        }}
      />
       */}
     
       <Tabs.Screen
        name="activity/index"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />

      {/* Hidden screens */}
      <Tabs.Screen
        name="Check_Ins/mood_check-in/index"
        options={{
          href: null, // 🔥 IMPORTANT
          title: 'check-in',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="moodpattern/index"
        options={{
          href: null, // 🔥 IMPORTANT
          title: 'moodpattern',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="mood-screen/index"
        options={{
          href: null, // 🔥 IMPORTANT
          title: 'mood-screen',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="wellnesssuggestions/index"
        options={{
          href: null, // 🔥 IMPORTANT
          title: 'wellnesssuggestions',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />

      

       <Tabs.Screen
        name="journal/index"
        options={{
          href: null, // 🔥 IMPORTANT
          title: 'journal',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="mood_diary/index"
        options={{
          href: null, // 🔥 IMPORTANT
          title: 'mood_diary',
          // tabBarButton: () => null,
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="mood_diary/[date]"
        options={{
          href: null, // 🔥 IMPORTANT
          title: 'mood_diary',
          // tabBarButton: () => null,
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      /> 

       <Tabs.Screen
        name="hugs_selection/index"
        options={{
          href: null, // 🔥 IMPORTANT
          title: 'hugs_selection',
          // tabBarButton: () => null, 
          tabBarIcon: ({ color }) => <Ionicons name="chatbox" size={24} color={color} />,
        }}
      />

       <Tabs.Screen
        name="Saved_places/index"
        options={{
          // href: null, // 🔥 IMPORTANT
          title: 'Saved Places',
          tabBarButton: () => null, 
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      /> 
     
    </Tabs>
    
  );
}
