// components/CustomToast.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';
import { styles } from './index.style';

interface CustomToastProps extends BaseToastProps {}

const CustomToast: React.FC<CustomToastProps> = ({ text1, text2, type }) => {
  return (
    <View style={[styles.container, type === 'error' ? styles.error : styles.success]}>
      <Text style={styles.title}>{text1}</Text>
      {text2 ? <Text style={styles.message}>{text2}</Text> : null}
    </View>
  );
};



export default CustomToast;
