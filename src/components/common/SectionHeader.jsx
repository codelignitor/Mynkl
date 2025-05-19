import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../../src/app/(tabs)/styles';

const SectionHeader = ({ title }) => {
  return (
    <Text style={styles.sectionHeader}>{title}</Text>
  );
};

export default SectionHeader;