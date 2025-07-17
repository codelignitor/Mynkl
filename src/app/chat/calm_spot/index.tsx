import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ScrollView,
    Image,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import MoodMapView from '@/src/components/map/MoodMapView';
import { styles } from './style';

const { width, height } = Dimensions.get('window');

export default function FindCalmSpotScreen() {
    const [showMap, setShowMap] = useState(false);
    const [showDirections, setShowDirections] = useState(false);
    const [showReflection, setShowReflection] = useState(false);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [reflectionText, setReflectionText] = useState('');
    type Spot = typeof spots[0];
    const [selectedMarker, setSelectedMarker] = useState<Spot | null>(null);

    const spots = [
        {
            id: 1,
            title: 'Park bench area',
            subtitle: 'Calm rating: High',
            icon: 'tree',
            iconFamily: 'FontAwesome5',
            backgroundColor: '#E8F5E9',
            iconColor: '#4CAF50',
            mapTitle: 'Calm',
            mapSubtitle: 'Park',
            coordinate: {
                latitude: 31.5204,
                longitude: 74.3487,
            },
            address: '320 Riverside Dr',
            usersCount: 10,
            recommendedActivity: '10 minute mindful pause',
        },
        {
            id: 2,
            title: 'Riverside walk',
            subtitle: 'User mood: Relaxed',
            icon: 'water',
            iconFamily: 'MaterialCommunityIcons',
            backgroundColor: '#E3F2FD',
            iconColor: '#2196F3',
            mapTitle: 'Peaceful',
            mapSubtitle: 'Peaceful',
            coordinate: {
                latitude: 31.5304,
                longitude: 74.3587,
            },
            address: '320 Riverside Dr',
            usersCount: 10,
            recommendedActivity: '10 minute mindful pause',
        },
        {
            id: 3,
            title: 'Café quiet zone',
            subtitle: 'Ideal for mindful breaks',
            icon: 'coffee',
            iconFamily: 'FontAwesome5',
            backgroundColor: '#FFF3E0',
            iconColor: '#FF9800',
            mapTitle: 'Grounding',
            mapSubtitle: 'Oakwood',
            coordinate: {
                latitude: 31.5104,
                longitude: 74.3387,
            },
            address: '320 Riverside Dr',
            usersCount: 10,
            recommendedActivity: '10 minute mindful pause',
        },
    ];

    // Default region centered on first spot
    const defaultRegion = spots.length > 0 ? {
      latitude: spots[0].coordinate.latitude,
      longitude: spots[0].coordinate.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    } : {
      latitude: 31.5204,
      longitude: 74.3487,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    const renderIcon = (iconName: string, iconFamily: string, color: string, size: number = 24) => {
        switch (iconFamily) {
            case 'FontAwesome5':
                return <FontAwesome5 name={iconName as any} size={size} color={color} />;
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
            default:
                return <Ionicons name={iconName as any} size={size} color={color} />;
        }
    };

    const mapStyle = [
        {
            elementType: 'geometry',
            stylers: [{ color: '#E8F5E9' }],
        },
        {
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#ffffff' }],
        },
        {
            elementType: 'labels.text.fill',
            stylers: [{ color: '#4CAF50' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#E0E0E0' }],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#B3E5FC' }],
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#C8E6C9' }],
        },
    ];

    // Reflection Screen
    if (showReflection) {
        const moods = [
            { emoji: '😊', label: 'Great', value: 'great' },
            { emoji: '😌', label: 'Calm', value: 'calm' },
            { emoji: '😐', label: 'Neutral', value: 'neutral' },
            { emoji: '😞', label: 'Down', value: 'down' },
        ];

        return (
            <SafeAreaView style={styles.reflectionScreenContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFF9F2" />
                
                <View style={styles.reflectionContent}>
                    <Text style={styles.reflectionTitle}>How do you feel{'\n'}after your visit?</Text>
                    
                    <View style={styles.moodsContainer}>
                        {moods.map((mood) => (
                            <TouchableOpacity
                                key={mood.value}
                                style={[
                                    styles.moodButton,
                                    selectedMood === mood.value && styles.selectedMoodButton
                                ]}
                                onPress={() => setSelectedMood(mood.value)}
                            >
                                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                <Text style={styles.moodLabel}>{mood.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.reflectionInputContainer}>
                        <TextInput
                            style={styles.reflectionTextInput}
                            placeholder="Share a reflection..."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={6}
                            value={reflectionText}
                            onChangeText={setReflectionText}
                            textAlignVertical="top"
                        />
                        <TouchableOpacity style={styles.sendIconButton}>
                            <Ionicons name="send" size={20} color="#4CAF50" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={styles.saveReflectionButton}
                        onPress={() => {
                            // Handle save reflection
                            setShowReflection(false);
                            setShowDirections(false);
                            setShowMap(false);
                        }}
                    >
                        <Text style={styles.saveReflectionButtonText}>Save Reflection</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Directions Screen
    if (showDirections && selectedMarker) {
        return (
            <SafeAreaView style={styles.directionsScreenContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFF9F2" />
                
                {/* Back button */}
                <TouchableOpacity
                    style={styles.directionsBackButton}
                    onPress={() => setShowDirections(false)}
                >
                    <Ionicons name="arrow-back" size={28} color="#222" />
                </TouchableOpacity>

                <ScrollView style={{ flex: 1, paddingTop: 60 }}>
                    {/* Location Header */}
                    <View style={styles.directionsTitleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.directionsTitle}>Riverside Walk</Text>
                            <Text style={styles.directionsSubtitle}>{selectedMarker.address}</Text>
                        </View>
                        <View style={styles.directionsIcon}>
                            {renderIcon('water', 'MaterialCommunityIcons', '#2196F3', 32)}
                        </View>
                    </View>

                    {/* User feedback */}
                    <View style={styles.directionsInfoRow}>
                        <Ionicons name="star" size={18} color="#FFD700" style={styles.directionsInfoIcon} />
                        <Text style={styles.directionsInfoText}>{selectedMarker.usersCount} users felt calm here today</Text>
                    </View>

                    {/* Recommendation */}
                    <View style={styles.directionsInfoRow}>
                        <Ionicons name="leaf" size={18} color="#4CAF50" style={styles.directionsInfoIcon} />
                        <Text style={styles.directionsInfoText}>Recommended: {selectedMarker.recommendedActivity}</Text>
                    </View>

                    {/* Meditation Card */}
                    <View style={styles.meditationCard}>
                        <Text style={styles.meditationCardTitle}>Calm Meditation Playlist</Text>
                        
                        {/* Meditation Image */}
                        <View style={styles.meditationCardImage}>
                            <LinearGradient
                                colors={['#B2DFDB', '#80CBC4']}
                                style={{ flex: 1, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
                            >
                                <MaterialCommunityIcons name="water" size={40} color="#004D47" />
                            </LinearGradient>
                        </View>

                        {/* Track Info */}
                        <View style={styles.meditationTrackRow}>
                            <Text style={styles.meditationTrackTitle}>Flowing Stream</Text>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.meditationProgressRow}>
                            <Text style={styles.meditationProgressTime}>0:25</Text>
                            <View style={styles.meditationProgressBarBg}>
                                <View style={styles.meditationProgressBarFill} />
                            </View>
                            <Text style={styles.meditationProgressTime}>12:02</Text>
                        </View>

                        {/* Controls */}
                        <View style={styles.meditationControlsRow}>
                            <TouchableOpacity>
                                <Ionicons name="play-skip-back" size={24} color="#4CAF50" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.meditationPlayButton}>
                                <Ionicons name="play" size={24} color="white" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity>
                                <Ionicons name="play-skip-forward" size={24} color="#4CAF50" />
                            </TouchableOpacity>
                        </View>

                        {/* Start Meditation Button */}
                        <TouchableOpacity 
                            style={styles.startMeditationButton}
                            onPress={() => setShowReflection(true)}
                        >
                            <Text style={styles.startMeditationButtonText}>Start Meditation</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    if (showMap) {
      // Map view mode
      return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {/* Gradient Header with Title */}
          <LinearGradient
            colors={["#6EC6CA", "#C8E6C9"]}
            style={styles.mapHeaderGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.mapHeaderContainer}>
              <Text style={styles.mapHeaderText}>Meditation Spots{"\n"}Near You</Text>
            </View>
          </LinearGradient>
          {/* Back button */}
          <TouchableOpacity
            style={styles.mapBackButton}
            onPress={() => setShowMap(false)}
          >
            <Ionicons name="arrow-back" size={28} color="#338C8C" />
          </TouchableOpacity>
          <MoodMapView
            mapRegion={defaultRegion}
            selectedMood={null}
            currentLocations={spots.map(s => ({
              id: s.id,
              name: s.title,
              latitude: s.coordinate.latitude,
              longitude: s.coordinate.longitude,
              mood: s.mapTitle || 'Calm',
              description: s.subtitle,
            }))}
            currentEmoji={null}
            backgroundColor={undefined}
            mapContainerStyle={{ flex: 1 }}
            callback={setSelectedMarker}
          />
         {/* Bottom Card and Get Directions Button */}
         {selectedMarker && (
           <View style={styles.bottomCardContainer}>
             <View style={styles.bottomCard}>
               <Text style={styles.cardTitle}>{selectedMarker.title || 'Riverside Trail'}</Text>
               <Text style={styles.cardSubtitle}>Felt peaceful by 12 users</Text>
             </View>
             <TouchableOpacity 
               style={styles.getDirectionsButton}
               onPress={() => setShowDirections(true)}
             >
               <Text style={styles.getDirectionsButtonText}>Get Directions <Ionicons name="chevron-forward" size={20} color="#fff" /></Text>
             </TouchableOpacity>
           </View>
         )}
        </View>
      );
    }

    return (
        <LinearGradient
            colors={['#C8926B', '#7FB4C7']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Text style={styles.title}>Find a Calm</Text>
                    <Text style={styles.title}>Spot Nearby</Text>
                    <Text style={styles.subtitle}>Here are peaceful places</Text>
                    <Text style={styles.subtitle}>to pause and breathe today.</Text>

                    <View style={styles.spotsContainer}>
                        {spots.map((spot) => (
                            <TouchableOpacity
                                key={spot.id}
                                style={[styles.spotCard, { backgroundColor: spot.backgroundColor }]}
                                activeOpacity={0.8}
                            >
                                <View style={styles.iconContainer}>
                                    {renderIcon(spot.icon, spot.iconFamily, spot.iconColor)}
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.spotTitle}>{spot.title}</Text>
                                    <Text style={styles.spotSubtitle}>{spot.subtitle}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.mapButton}
                        activeOpacity={0.8}
                        onPress={() => setShowMap(true)}
                    >
                        <Text style={styles.mapButtonText}>View on Map</Text>
                        <Ionicons name="chevron-forward" size={24} color="white" />
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}