import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useHugSent } from './useHugSent';
import { styles } from './index-style';

const HugSentScreen = () => {
  const {
    // Add any logic functions here if needed
  } = useHugSent();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#A8D5D0" />
      
      <View style={styles.gradientContainer}>
        {/* Hugging Icon */}
        <View style={styles.iconContainer}>
          {/* Two people hugging illustration */}
          <View style={styles.hugIconContainer}>
            {/* Person 1 - Left side (Purple/Pink) */}
            <View style={styles.person1Container}>
              <View style={styles.person1Head} />
              <View style={styles.person1Body} />
              <View style={styles.person1Arm} />
            </View>
            
            {/* Person 2 - Right side (Blue/Teal) */}
            <View style={styles.person2Container}>
              <View style={styles.person2Head} />
              <View style={styles.person2Body} />
              <View style={styles.person2Arm} />
            </View>
            
            {/* Hug area - the connecting part */}
            <View style={styles.hugConnection} />
          </View>
        </View>

        {/* Main Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Hug sent!</Text>
        </View>

        {/* Subtitle Message */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>Small acts of kindness</Text>
          <Text style={styles.subtitleText}>make the world a</Text>
          <Text style={styles.subtitleText}>better place.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HugSentScreen;