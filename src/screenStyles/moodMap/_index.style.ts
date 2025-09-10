import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    // Main Container Styles
    container: {
       paddingTop: Platform.OS === 'android' ? 44 : 0,
       backgroundColor:'#768898',
       flex: 1,
    },
    
    // Header Section Styles
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 12,
    },
    searchContainer: {
        flex: 1,
        maxWidth: '70%',
    },
    filterButton: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingIndicator: {
        marginVertical: 20,
    },
    
    // Map Container Styles
    mapContainerStyle: {
       height: '100%',
    },
    
    // Activities Container Styles
    activitiesContainer: {
        backgroundColor: '#768898',
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '48.5%',
    },
    activitiesLabel: {
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#fff'
    },
    rowContiner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeMore: {
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#fff'
    },
    
    // Activity Item Styles
    activityContainer: {
        borderRadius: 32,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityImage: {
        height: 132,
        width: 122,
        borderTopLeftRadius: 32,
        borderBottomLeftRadius: 32,
    },
    activityDetailsContainer: {
        paddingLeft: 14,
        flex: 1,
    },
    activityArrow: {
        position: 'absolute', 
        right: 16,
    },
    timeLabel: {
        fontSize: 16, 
        color: 'gray' 
    },
    activityLabel: {
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#000',
    },
    
    // Place Section Styles
    placeContainer: {
        marginTop: 8, 
        alignItems: 'center',
    },
    placeTitle: {
        fontWeight: 'bold', 
        fontSize: 22, 
        textAlign: 'center',
        color: '#fff',
    },
    placeInfoContainer: {
        backgroundColor: '#f2f2f2', 
        borderRadius: 8, 
        padding: 12, 
        marginBottom: 4, 
        marginTop: 8,
    },
    placeInfoText: {
        fontSize: 15,
        color: '#333',
    },
    happyIconContainer: {
        marginTop: 2,
    },
    happyIcon: {
        width: 68, 
        height: 68,
    },
    
    // User Section Styles
    userContainer: {
        marginTop: 8, 
        alignItems: 'center',
    },
    userTitle: {
        fontWeight: 'bold', 
        fontSize: 22, 
        textAlign: 'center',
        color: '#fff',
    },
    userInfoContainer: {
        backgroundColor: '#f2f2f2', 
        borderRadius: 8, 
        padding: 12, 
        marginBottom: 4, 
        marginTop: 8, 
        alignItems: 'center',
    },
    userInfoText: {
        fontSize: 15,
        color: '#333',
    },
    userButtonContainer: {
        flexDirection: 'row', 
        marginTop: 12,
    },
    chatButton: {
        backgroundColor: '#4F8EF7',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 24,
        marginRight: 12,
    },
    chatButtonText: {
        color: '#fff', 
        fontWeight: 'bold',
    },
    hugButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    hugButtonText: {
        color: '#333', 
        fontWeight: 'bold',
    },
    
    // ========== FILTER MODAL STYLES ==========
    
    // Filter Modal Container
    filterContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    
    // Filter Modal Header
    filterHeader: {
        marginTop:20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterBackButton: {
        padding: 4,
    },
    filterHeaderTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
        marginLeft: -32, // Compensate for back button
    },
    filterHeaderRight: {
        width: 32,
    },
    
    // Filter Modal Description
    filterDescription: {
        marginTop:20,
        fontSize: 16,
        color: '#666',
        paddingHorizontal: 20,
        paddingVertical: 16,
        lineHeight: 22,
    },
    
    // Filter Mood Options Container
    filterMoodContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    filterMoodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    
    // Individual Mood Button Styles
    moodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        flex: 0.48,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    selectedMoodButton: {
        borderColor: '#40E0D0',
    },
    moodEmoji: {
        fontSize: 20,
        marginRight: 8,
    },
    moodText: {
        fontSize: 16,
        fontWeight: '500',
    },
    
    // Filter Action Buttons
    filterButtonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginTop: 'auto',
    },
    applyButton: {
        backgroundColor: '#40E0D0',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 12,
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    clearButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom:30,
    },
    clearButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },

    // ========== LOCATION DETAIL MODAL STYLES ==========
    
    // Location Detail Modal Container
    locationDetailContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    
    // Location Detail Header
    locationDetailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    locationDetailTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginRight: 40, // Compensate for back button
    },
    
    // Location Detail Content
    locationDetailContent: {
        flex: 1,
    },
    locationDetailScrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
    
    // Location Card
    locationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginLeft: 8,
    },
    moodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    moodLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginLeft: 8,
    },
    checkInInfo: {
        marginTop: 8,
    },
    checkInText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    checkInBreakdown: {
        fontSize: 14,
        color: '#888',
    },
    
    // Virtual Hugs Card
    virtualHugsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    virtualHugsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    hugEmoji: {
        fontSize: 20,
        marginRight: 8,
    },
    virtualHugsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    virtualHugsDesc: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
    },
    hugButtonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    sendHugButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        flex: 1,
        alignItems: 'center',
    },
    sendHugButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '600',
    },
    openToTalkButton: {
        backgroundColor: '#90EE90',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        flex: 1,
        alignItems: 'center',
    },
    openToTalkButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '600',
    },

    // ========== MOOD IMAGES STYLES ==========
    
    // Container for mood images
    moodImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    
    // Base mood image style
    moodImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    
    // Selected mood image style
    moodImageSelected: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        borderWidth: 2,
        borderColor: '#40E0D0',
    },
    
    // Header mood image (for the "Available Moods" section)
    moodsHeaderImage: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    
    // Fallback emoji styles (if images don't load)
    moodDisplayEmoji: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 4,
    },
    
    moodDisplayEmojiSelected: {
        fontSize: 26, // Slightly larger when selected
    },

    // ========== MOODS SECTION STYLES ==========
    
    // Moods Card
    moodsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    moodsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    moodsEmoji: {
        fontSize: 20,
        marginRight: 8,
    },
    moodsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    moodsDesc: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
    },
    moodsList: {
        maxHeight: 150, // Increased height to allow more content
        minHeight: 100, // Minimum height to ensure proper display
    },
    moodsListContent: {
        paddingHorizontal: 8,
        paddingBottom: 16,
    },
    moodDisplayItem: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        margin: 4,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        minHeight: 80,
        maxWidth: '30%', // Ensure proper 3-column layout
    },
    moodDisplayItemSelected: {
        backgroundColor: '#F0FFFE',
        borderColor: '#40E0D0',
        borderWidth: 2,
        shadowColor: '#40E0D0',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    moodDisplayName: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        color: '#333',
        marginTop: 4,
        flexWrap: 'wrap',
    },
    moodDisplayNameSelected: {
        color: '#40E0D0',
        fontWeight: '600',
    },
    moodSelectedIndicator: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    
    // Comments Card
    commentsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        minHeight: 200,
        maxHeight: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    commentsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    commentsList: {
        maxHeight: 300,
        marginBottom: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        overflow: 'scroll',
    },
    commentItem: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#40E0D0',
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    commentTimestamp: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    
    // Add Comment Styles
    addCommentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        maxHeight: 80,
    },
    addCommentButton: {
        backgroundColor: '#40E0D0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addCommentButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    
    // Check In Button
    checkInButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 20,
    },
    checkInButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },

    // ========== USER PIN OVERLAY STYLES ==========
    
    // User Pin Overlay Container
    userPinOverlay: {
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: [{ translateX: -125 }], // Half of card width
        zIndex: 1000,
    },
    
    // User Expanded Card
    userExpandedCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        width: 250,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 15,
        alignItems: 'center',
    },
    
    // User Expanded Emoji
    userExpandedEmoji: {
        fontSize: 48,
        marginBottom: 8,
    },
    
    // User Expanded Info
    userExpandedInfo: {
        alignItems: 'center',
        marginBottom: 16,
    },
    userExpandedName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    userExpandedMood: {
        fontSize: 16,
        color: '#666',
        textTransform: 'capitalize',
    },
    
    // User Action Buttons
    userHugButton: {
        backgroundColor: '#FF6B6B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 8,
        width: '100%',
        gap: 6,
    },
    userHugButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    userChatButton: {
        backgroundColor: '#4ECDC4',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        width: '100%',
        gap: 6,
    },
    userChatButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    
    // ========== Modal ==========
    exploreModalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    exploreModalSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '32%',
        backgroundColor: '#338C8C',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 0,
        width: '100%',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        // Elevation for Android
        elevation: 10,
    },
    exploreSheetContainer: {
        backgroundColor: '#338C8C',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 18,
        paddingBottom: 10,
        paddingHorizontal: 0,
        minHeight: 320,
        width: '100%',
    },
    exploreSheetHandle: {
        alignItems: 'center',
        marginBottom: 10,
    },
    exploreTabsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
        gap: 10,
    },
    exploreTabButton: {
        backgroundColor: 'rgba(255,255,255,0.10)',
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 18,
        marginHorizontal: 2,
        minWidth: 90,
        alignItems: 'center',
        borderWidth: 0,
        borderColor: 'transparent',
    },
    exploreTabButtonSelected: {
        backgroundColor: '#B2DFDB',
        borderWidth: 1.5,
        borderColor: '#338C8C',
    },
    exploreTabText: {
        color: '#E0F7FA',
        fontWeight: 'bold',
        fontSize: 15,
    },
    exploreTabTextSelected: {
        color: '#338C8C',
    },
    exploreSuggestionCard: {
        backgroundColor: '#A7E6E6',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 18,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1,
    },
    exploreSuggestionIcon: {
        width: 32,
        height: 42,
        borderRadius: 16,
        backgroundColor: '#FFE066',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    exploreSuggestionText: {
        color: '#1A3C3C',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 22,
        flex: 1,
    },
    exploreSuggestionHeart: {
        marginLeft: 8,
    },
    exploreInfoCard: {
        backgroundColor: '#B2DFDB',
        borderRadius: 12,
        padding: 13,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 18,
        marginBottom: 2,
    },
    exploreInfoText: {
        color: '#1A3C3C',
        fontSize: 15,
        flex: 1,
    },
    exploreInfoClose: {
        marginLeft: 8,
    },
    exploreButton: {
        backgroundColor: '#E0F7FA',
        borderRadius: 22,
        paddingVertical: 12,
        marginHorizontal: 0,
        marginRight: 8,
        marginTop: 0,
        marginBottom: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    exploreButtonText: {
        color: '#00796B',
        fontWeight: 'bold',
        fontSize: 17,
        letterSpacing: 0.2,
    },

    // ========== USER FLOATING SECTION STYLES ==========
    userFloatingSection: {
        position: 'absolute',
        top: 120,
        left: 16,
        right: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000,
    },
    userFloatingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    userMoodIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    userMoodEmoji: {
        fontSize: 24,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    userMood: {
        fontSize: 16,
        color: '#666',
    },
    userActionButtons: {
        gap: 12,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    startChatButton: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeUserSection: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
});