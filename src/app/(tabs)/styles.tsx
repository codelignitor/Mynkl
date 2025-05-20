import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#435665',
  },
  contentContainer: {
    padding: 16,
  },
 
  halfSection: {
    width: '48%',
  },
  emptyCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    borderLeftWidth: 3,
    borderLeftColor: '#555',
  },
  emptyCardText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
 // Updated styles for header and bell icon alignment
headerContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  paddingTop: 30,
  marginTop: 30,
  marginBottom: 20,
},
headerTextContainer: {
  flex: 1,
},
header: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#fff',
},
bellIconContainer: {
  padding: 5,
  marginLeft: 10,
  alignItems: 'center',
  justifyContent: 'center',
},
bellIcon: {
  // No additional styling needed here
},
  headerSection:{
    paddingTop:20,
    fontSize: 29,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  // Toggle Styles for Pills Design
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#272727',
    borderRadius: 30,
    height: 42,
    position: 'relative',
    width: '100%',
    maxWidth: 280,
  },
  toggleBackground: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    width: '50%',
    borderRadius: 25,
    backgroundColor: '#555',
    zIndex: 1,
  },
  toggleLeftPosition: {
    left: 3,
  },
  toggleRightPosition: {
    left: '50%',
    right: 3,
    marginLeft: -3,
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  mapContainer: {
    height: 300,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  mapPlaceholder: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff',
  },
  // Updated Mood Selection UI with Emoji Circles
  moodCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  moodCircleWrapper: {
    alignItems: 'center',
    width: 65,
  },
  moodCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  selectedMoodCircle: {
    borderWidth: 2,
    // borderColor: '#fff',
  },
  moodEmoji: {
    fontSize: 43,
  },
  moodName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  selectedMoodName: {
    fontWeight: 'bold',
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerEmoji: {
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 20,
  },
  selfCareTips: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
  },
  selfCareTip: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#ccc',
    textAlign: 'center',
  },
  suggestedPlaceCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 12,
    height: 80,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
    justifyContent: 'center',
  },
  suggestedPlaceTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  suggestedPlaceDescription: {
    color: '#ccc',
    fontSize: 12,
  },
  chatConnectCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 12,
    height: 80,
    borderLeftWidth: 3,
    borderLeftColor: '#4DA6FF',
    justifyContent: 'center',
  },
  chatConnectContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatIconContainer: {
    marginRight: 8,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatConnectTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  chatConnectDescription: {
    color: '#ccc',
    fontSize: 12,
  },
  // New Map Card Styles
  mapCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    height: 80,
    borderLeftWidth: 3,
    borderLeftColor: '#50C878', // Emerald green
    overflow: 'hidden',
  },
  miniMapPreview: {
    height: 60,
    width: '100%',
    backgroundColor: '#333', // Darker background for map preview
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCardText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  // Self-Care Tips Modal Styles
selfCareIntro: {
  fontSize: 15,
  color: '#ccc',
  marginBottom: 15,
  lineHeight: 22,
},
selfCareTipsContainer: {
  maxHeight: 400,
},
selfCareTipItem: {
  flexDirection: 'row',
  backgroundColor: '#222',
  padding: 15,
  borderRadius: 10,
  marginBottom: 15,
},
selfCareTipIconContainer: {
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 15,
},
selfCareTipContent: {
  flex: 1,
},
selfCareTipTitle: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 6,
},
selfCareTipDescription: {
  color: '#ccc',
  fontSize: 14,
  lineHeight: 20,
},
selfCareDailyChallenge: {
  backgroundColor: '#333',
  padding: 20,
  borderRadius: 15,
  marginTop: 10,
  marginBottom: 20,
  borderLeftWidth: 3,
  borderLeftColor: '#9F7AEA',
},
selfCareChallengeTitle: {
  color: '#9F7AEA',
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 10,
},
selfCareChallengeText: {
  color: '#fff',
  fontSize: 15,
  lineHeight: 22,
  marginBottom: 15,
},
selfCareChallengeButton: {
  backgroundColor: '#9F7AEA',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 25,
  alignSelf: 'flex-start',
},
selfCareChallengeButtonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 14,
},
  addButtonContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#50C878',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Self-Care Card Styles
  selfCareCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 12,
    height: 80,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B', // Light red
    justifyContent: 'center',
  },
  selfCareIconContainer: {
    marginRight: 8,
    marginBottom: 8,
  },
  selfCareTextContainer: {
    flex: 1,
  },
  selfCareItem: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  selfCareSeeMore: {
    color: '#FF6B6B',
    fontSize: 12,
    fontStyle: 'italic',
  },
  // Favorites Map Modal Styles
  favoritesMapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
  },
  favoritesMap: {
    height: '100%',
    width: '100%',
  },
  addFavoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#50C878',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  favoriteMarkerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  favoriteLocationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  favoriteLocationsContainer: {
    maxHeight: 200,
  },
  favoriteLocationItem: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  favoriteLocationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  favoriteLocationDescription: {
    color: '#ccc',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  chatModalContainer: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '50%', // Takes half of the screen
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 15,
  },
  otherSuggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  otherSuggestionsContainer: {
    maxHeight: 200,
  },
  otherSuggestionItem: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  otherSuggestionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  otherSuggestionDescription: {
    color: '#ccc',
    fontSize: 14,
  },
  chatMessagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  chatMessagesContent: {
    paddingVertical: 10,
  },
  messageContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '80%',
  },
  userMessageBubble: {
    backgroundColor: '#4DA6FF',
  },
  botMessageBubble: {
    backgroundColor: '#333',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4DA6FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  // check in
  checkInLink: {
  color: '#5271ff',
  fontSize: 16,
  fontWeight: 'bold',
  textDecorationLine: 'underline',
  marginVertical: 10,
  textAlign: 'center',
},
checkedInLink: {
  color: '#4CAF50',
  textDecorationLine: 'none',
},
disabledLink: {
  color: '#a0a0a0',
  textDecorationLine: 'none',
},
// Check In
rowContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 40,
  paddingHorizontal: 16,
  gap: 12,
  alignItems: 'flex-start', // Align items to the top to accommodate different heights
},
rectangularCard: {
  width: '60%', // Take up more width for the rectangular card
  height: 80,
  backgroundColor: '#4e6274',
  borderRadius: 12,
  padding: 16,
  justifyContent: 'space-between',
},
squareCard: {
  width: '35%', // Take up less width to make it square
  aspectRatio: 1, // Make it a perfect square
  backgroundColor: '#4e6274',
  borderRadius: 12,
  padding: 16,
  justifyContent: 'space-between',
},
statusCardTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'white',
},
dotsContainer: {
  flexDirection: 'row',
  marginTop: 6,
  gap: 8,
},
lightDot: {
  width: 14,
  height: 14,
  borderRadius: 7,
  backgroundColor: '#a6b2bd', // Light gray dot
},
darkDot: {
  width: 14,
  height: 14,
  borderRadius: 7,
  backgroundColor: '#2f3e4a', // Dark blue dot
},
singleDotContainer: {
  marginTop: 'auto', // Push to the bottom of the square
  alignItems: 'flex-start',
},
greenDot: {
  width: 14,
  height: 14,
  borderRadius: 7,
  backgroundColor: '#8eda99', // Bright green dot
},
darkStatusCard: {
  flex: 1,
  height: 80, // Shorter height to match image
  backgroundColor: '#4e6274', // Dark blue-gray background
  borderRadius: 12,
  padding: 16,
  justifyContent: 'space-between',
},
// Add these to your styles.js file
blueDot: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: '#4287f5', // Blue color, adjust as needed
},
purpleDot: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: '#8a4af3', // Purple color, adjust as needed
},
// Add these to your styles.js file
appIconCard: {
  flex: 1,
  height: 100, // You can adjust this value
  margin: 5,
  borderRadius: 12,
  backgroundColor: '#4e6274', // Light gray background similar to the image
  justifyContent: 'center',
  alignItems: 'center',
  padding: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 1.5,
  elevation: 2,
},
iconContainer: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#e0e0e0', // Slightly darker background for icon
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 8,
},
appIconText: {
  fontSize: 14,
  fontWeight: '500',
  color: '#333',
  textAlign: 'center',
},
// Activity
// Add these to your styles.js file
menuSectionContainer: {
  paddingTop:10,
  marginTop: 20,
  paddingHorizontal: 5,
  width: '100%',
},
menuCard: {
  width: '100%',
  height: 56,
  borderRadius: 12,
  backgroundColor: '#2a3543', // Dark blue background similar to the image
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 1.5,
  elevation: 2,
},
menuCardContent: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
},
menuIconContainer: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#4A89DC', // Light blue for icon background
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},
menuCardText: {
  fontSize: 16,
  fontWeight: '500',
  color: '#ffffff', // White text
  flex: 1,
},
chevronIcon: {
  marginLeft: 'auto',
},
// Add these styles for the larger Activities section
largeMenuCard: {
  width: '100%',
  height: 80, // Increased height
  borderRadius: 12,
  backgroundColor: '#2a3543', // Dark blue background
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 1.5,
  elevation: 2,
  marginBottom: 10,
},
largeMenuCardContent: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  height: '100%',
},
largeMenuIconContainer: {
  width: 40, // Larger icon container
  height: 40, // Larger icon container
  borderRadius: 20,
  backgroundColor: '#4A89DC', // Light blue for icon background
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 15,
},
menuTextContainer: {
  flex: 1,
  justifyContent: 'center',
},
largeMenuCardTitle: {
  fontSize: 18, // Larger font size
  fontWeight: '500',
  color: '#ffffff', // White text
},

});