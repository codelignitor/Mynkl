// src/components/map/PlaceMapMarker.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

interface Props {
  name: string;
  summaryLabel: string;
  displayCheckins: string;
  isSelected?: boolean;
}

const PlaceMapMarker: React.FC<Props> = ({
  name,
  summaryLabel,
  displayCheckins,
  isSelected = false,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Label above marker */}
      {isSelected && (
        <View style={styles.nameLabel}>
          <Text
            style={styles.nameLabelText}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      )}

      {/* Custom Marker Image */}
      <View style={styles.markerContainer}>
        <Image
          source={require('../../assets/images/PlaceMarker.png')}
          style={[
            styles.markerImage,
            isSelected && styles.markerSelected,
          ]}
          resizeMode="contain"
        />

        {/* Checkin Count */}
        {!!displayCheckins && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {displayCheckins}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },

  nameLabel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,

    maxWidth: 140,
  },

  nameLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },

  markerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  markerImage: {
    width: 42,
    height: 54,
  },

  markerSelected: {
    width: 54,
    height: 68,
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,

    backgroundColor: '#FF6B9D',

    minWidth: 20,
    height: 20,

    borderRadius: 10,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 4,

    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  badgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 9,
  },
});

export default React.memo(PlaceMapMarker);