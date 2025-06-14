// components/common/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  style?: React.CSSProperties; // Allow custom styles
  rightChildren?: React.ReactNode; // Allow custom right children
}

const Header: React.FC<HeaderProps> = ({ title, showBack = true  , style ,rightChildren}) => {
  const router = useRouter();

  return (
    <View style={[styles.container , style]}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} /> 
      )}
      <Text style={styles.title}>{title}</Text>
      {rightChildren?
      <>
        {rightChildren}
</>
:
      <View style={styles.backButton} />
}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:Platform.OS === 'android' ? 34 : 0, // Adjust for Android status bar height
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    paddingBottom:18
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  title: {
  
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
});

export default Header;
