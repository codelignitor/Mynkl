import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { styles } from './index.style';
import { IconSymbol } from '../../ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';

interface SearchInputProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChangeText, placeholder, ...rest }) => {
  return (
    <View style={styles.container}>
      <Ionicons size={28} name="search" color="#000" />
      <TextInput
        style={styles.input}
        placeholderTextColor="#000"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || 'Search...'}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
    </View>
  );
};

export default SearchInput;
