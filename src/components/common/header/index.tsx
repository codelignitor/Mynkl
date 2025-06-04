// components/common/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  style?: React.CSSProperties; // Allow custom styles
}

const Header: React.FC<HeaderProps> = ({ title, showBack = true  , style}) => {
  const router = useRouter();

  return (
    <View style={[styles.container , style]}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} /> // empty space for alignment
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.backButton} /> {/* Placeholder for symmetry */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    marginBottom:18
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  title: {
    marginTop:30,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
});

export default Header;
