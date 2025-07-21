import React, { useState, useEffect } from 'react';
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
import { saveReflection, MeditationsoptsNearby } from '@/src/services/apis';

const { width, height } = Dimensions.get('window');

export default function FindCalmSpotScreen() {
    const [showMap, setShowMap] = useState(false);
    const [showDirections, setShowDirections] = useState(false);
    const [showReflection, setShowReflection] = useState(false);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [reflectionText, setReflectionText] = useState('');
    type Spot = typeof spots[0];
    const [selectedMarker, setSelectedMarker] = useState<Spot | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
    const [isLoadingNearbySpots, setIsLoadingNearbySpots] = useState(true); // Start with loading true
    const [apiSpots, setApiSpots] = useState<any[]>([]);

    // Empty spots array - will be populated from API
    const spots = apiSpots;

    // Auto-fetch spots when component mounts
    useEffect(() => {
        handleFetchNearbySpots();
    }, []);

    // Function to map API spots to UI format
    const mapApiSpotsToUIFormat = (apiSpots: any[]) => {
        return apiSpots.map((spot, index) => ({
            id: index + 1,
            title: spot.name || 'Meditation Spot',
            subtitle: `Total visits: ${spot.total_visits || 0} • Calm mood: ${spot.moods?.calm || 0}`,
            icon: 'location',
            iconFamily: 'Ionicons',
            backgroundColor: '#E8F5E9',
            iconColor: '#4CAF50',
            mapTitle: 'Calm',
            mapSubtitle: spot.name || 'Peaceful',
            coordinate: {
                latitude: spot.latitude || 0,
                longitude: spot.longitude || 0,
            },
            address: spot.name || 'Meditation Location',
            usersCount: spot.total_visits || 0,
            recommendedActivity: '10 minute mindful pause',
            // Keep original data for reference
            originalData: spot
        }));
    };

    // Default region centered on first spot or fallback coordinates
    const defaultRegion = spots.length > 0 ? {
      latitude: spots[0].coordinate?.latitude || 31.5204,
      longitude: spots[0].coordinate?.longitude || 74.3487,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    } : {
      latitude: 31.5204,
      longitude: 74.3487,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    // Function to handle fetching nearby meditation spots
    const handleFetchNearbySpots = async () => {
        setIsLoadingNearbySpots(true);
        try {
            // Using default coordinates (you can replace with user's actual location)
            const lat = 31.5204; // Default latitude
            const lon = 74.3487; // Default longitude (changed to 'lon' to match API)
            
            console.log('Fetching nearby meditation spots for coordinates:', { lat, lon });
            console.log('Individual values - lat:', lat, 'lon:', lon);
            console.log('Types - lat:', typeof lat, 'lon:', typeof lon);
            
            // Check if the API function exists
            console.log('MeditationsoptsNearby function:', typeof MeditationsoptsNearby);
            
            console.log('About to call API...');
            
            // Call API with correct parameter names (lat, lon)
            const response = await MeditationsoptsNearby(lat, lon);
            
            console.log('API call completed');
            console.log('Raw API response:', response);
            console.log('Response type:', typeof response);
            console.log('Response is undefined:', response === undefined);
            console.log('Response is null:', response === null);
            
            if (response === undefined) {
                console.error('🚨 API returned undefined - check your API function implementation');
                console.log('Expected response format should be an array of spots');
                setApiSpots([]);
                return;
            }
            
            console.log('✅ API Response - Nearby Meditation Spots:');
            console.log('Full Response:', JSON.stringify(response, null, 2));
            
            // Handle undefined or null response
            if (!response) {
                console.warn('⚠️ API returned undefined or null response');
                setApiSpots([]);
                return;
            }
            
            // Store the API response data
            if (response) {
                console.log('Processing API response...');
                
                // Log specific parts of the response if it has structure
                if (typeof response === 'object') {
                    console.log('Response keys:', Object.keys(response));
                    
                    if (response.data) {
                        console.log('Response data:', response.data);
                        const mappedSpots = mapApiSpotsToUIFormat(Array.isArray(response.data) ? response.data : []);
                        setApiSpots(mappedSpots);
                    }
                    else if (response.spots) {
                        console.log('Spots array:', response.spots);
                        const mappedSpots = mapApiSpotsToUIFormat(Array.isArray(response.spots) ? response.spots : []);
                        setApiSpots(mappedSpots);
                    }
                    else if (Array.isArray(response)) {
                        console.log('Number of spots found:', response.length);
                        response.forEach((spot, index) => {
                            console.log(`Spot ${index + 1}:`, spot);
                        });
                        const mappedSpots = mapApiSpotsToUIFormat(response);
                        setApiSpots(mappedSpots);
                        console.log('Mapped spots for UI:', mappedSpots);
                    }
                    else {
                        console.warn('⚠️ Response is an object but not in expected format');
                        setApiSpots([]);
                    }
                }
                else {
                    console.warn('⚠️ Response is not an object:', typeof response);
                    setApiSpots([]);
                }
            }
            
        } catch (error) {
            console.error('❌ Error fetching nearby meditation spots:', error);
            
            // Log more detailed error information with safe handling
            if (error.response) {
                console.error('Error response status:', error.response.status);
                console.error('Error response data:');
                
                // Safe logging of error details
                if (error.response.data && error.response.data.detail) {
                    console.error('API Validation Errors:');
                    if (Array.isArray(error.response.data.detail)) {
                        error.response.data.detail.forEach((err, index) => {
                            console.error(`Error ${index + 1}:`);
                            console.error('  Field:', err.loc ? err.loc.join('.') : 'unknown');
                            console.error('  Message:', err.msg || 'No message');
                            console.error('  Type:', err.type || 'No type');
                            console.error('  Input:', err.input);
                        });
                    }
                } else {
                    console.error('Error data:', JSON.stringify(error.response.data, null, 2));
                }
                
                // Suggest fixes based on the error
                if (error.response.status === 422) {
                    console.log('💡 Suggestion: The API is expecting additional required fields.');
                    console.log('Check your API documentation for required parameters like:');
                    console.log('- user_id, radius, limit, etc.');
                }
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        } finally {
            setIsLoadingNearbySpots(false);
        }
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

        const handleSaveReflection = async () => {
            if (!selectedMood || !reflectionText.trim()) return;
            setIsSaving(true);
            try {
                const payload = {
                    mood: selectedMood,
                    reflection_text: reflectionText.trim(),
                };
                console.log('Payload:', payload); // Log the payload
                const response = await saveReflection(payload);
                if (response && response.message) {
                    console.log(response.message);
                }
            } catch (error) {
                console.log('Error saving reflection:', error);
            } finally {
                setIsSaving(false);
                setShowReflection(false);
                setShowDirections(false);
                setShowMap(false);
            }
        };

        return (
            <SafeAreaView style={styles.reflectionScreenContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFF9F2" />
                
                <View style={styles.reflectionContent}>
                    <Text style={styles.reflectionTitle}>How do you feel{ '\n' }after your visit?</Text>
                    
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
                        style={[styles.saveReflectionButton, (!selectedMood || !reflectionText.trim() || isSaving) && { opacity: 0.5 }]}
                        onPress={handleSaveReflection}
                        disabled={!selectedMood || !reflectionText.trim() || isSaving}
                    >
                        <Text style={styles.saveReflectionButtonText}>{isSaving ? 'Saving...' : 'Save Reflection'}</Text>
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
                        {isLoadingNearbySpots ? (
                            <View style={{ 
                                backgroundColor: '#F5F5F5', 
                                padding: 20, 
                                borderRadius: 12, 
                                alignItems: 'center',
                                marginBottom: 20 
                            }}>
                                <Ionicons name="sync" size={48} color="#4CAF50" />
                                <Text style={{ 
                                    fontSize: 16, 
                                    color: '#666', 
                                    marginTop: 10, 
                                    textAlign: 'center' 
                                }}>
                                    Loading meditation spots...
                                </Text>
                            </View>
                        ) : spots.length === 0 ? (
                            <View style={{ 
                                backgroundColor: '#F5F5F5', 
                                padding: 20, 
                                borderRadius: 12, 
                                alignItems: 'center',
                                marginBottom: 20 
                            }}>
                                <Ionicons name="location-outline" size={48} color="#999" />
                                <Text style={{ 
                                    fontSize: 16, 
                                    color: '#666', 
                                    marginTop: 10, 
                                    textAlign: 'center' 
                                }}>
                                    No meditation spots found
                                </Text>
                                <Text style={{ 
                                    fontSize: 14, 
                                    color: '#999', 
                                    marginTop: 5, 
                                    textAlign: 'center' 
                                }}>
                                    Try refreshing or check your location
                                </Text>
                            </View>
                        ) : (
                            spots.map((spot) => (
                                <TouchableOpacity
                                    key={spot.id}
                                    style={[
                                        styles.spotCard,
                                        { backgroundColor: spot.backgroundColor || '#F0F0F0' },
                                        selectedSpot && selectedSpot.id === spot.id && { borderWidth: 2, borderColor: '#4CAF50' }
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedSpot(spot)}
                                >
                                    <View style={styles.iconContainer}>
                                        {spot.icon && spot.iconFamily ? 
                                            renderIcon(spot.icon, spot.iconFamily, spot.iconColor || '#4CAF50') :
                                            <Ionicons name="location" size={24} color="#4CAF50" />
                                        }
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.spotTitle}>{spot.title || spot.name || 'Meditation Spot'}</Text>
                                        <Text style={styles.spotSubtitle}>{spot.subtitle || spot.description || 'Peaceful location'}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>

                    {/* Refresh Button (replaces the old fetch button) */}
                    <TouchableOpacity 
                        style={{ 
                            backgroundColor: isLoadingNearbySpots ? '#ccc' : '#4CAF50', 
                            padding: 12, 
                            borderRadius: 8, 
                            alignItems: 'center', 
                            marginVertical: 10,
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}
                        onPress={handleFetchNearbySpots}
                        disabled={isLoadingNearbySpots}
                    >
                        {isLoadingNearbySpots && (
                            <Ionicons name="sync" size={16} color="white" style={{ marginRight: 8 }} />
                        )}
                        <Text style={{ color: 'white', fontWeight: '500' }}>
                            {isLoadingNearbySpots ? 'Loading...' : 'Refresh Spots'}
                        </Text>
                    </TouchableOpacity>

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