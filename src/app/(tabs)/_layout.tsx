import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/src/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {Stack} from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { View, Text } from 'react-native';
import { HapticTab } from '@/src/components/HapticTab';
import { IconSymbol } from '@/src/components/ui/IconSymbol.ios';
import BlurTabBarBackground from '@/src/components/ui/TabBarBackground.ios';


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
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="mappin.and.ellipse" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill.checkmark" color={color} />,
        }}
      />
     
      
    </Tabs>
    
  );
}
