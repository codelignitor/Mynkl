import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { styles } from './index.style';
import { IconSymbol } from '../../ui/IconSymbol';

interface SearchInputProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChangeText, placeholder, ...rest }) => {
  return (
    <View style={styles.container}>
    <IconSymbol size={28} name="magnifyingglass" color={'#000'} />
      <TextInput
        style={styles.input}
        placeholderTextColor={'#000'}
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