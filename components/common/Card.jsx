import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../app/(tabs)/styles';

const Card = ({ 
  title,
  description, 
  emoji, 
  icon, 
  iconColor, 
  iconComponent,
  onPress, 
  borderColor, 
  emptyCard,
  cardStyle,
  contentStyle
}) => {
  if (emptyCard) {
    return (
      <View style={[styles.emptyCard, cardStyle]}>
        <Text style={styles.emptyCardText}>{description || 'No information available'}</Text>
      </View>
    );
  }

  const customCardStyle = {
    borderLeftColor: borderColor || '#555',
  };

  return (
    <TouchableOpacity 
      style={[
        styles.suggestedPlaceCard, 
        customCardStyle,
        cardStyle
      ]}
      onPress={onPress}
    >
      {icon && iconComponent}
      
      {emoji && title && (
        <Text style={styles.suggestedPlaceTitle}>
          {emoji} {title}
        </Text>
      )}
      
      {description && (
        <Text style={styles.suggestedPlaceDescription}>
          {description}
        </Text>
      )}
      
      {contentStyle && (
        <View style={contentStyle}>
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Card;