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
    },
    filterButton: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
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
        paddingHorizontal: 16,
        paddingTop: 16,
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
    
    // Comments Card
    commentsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        maxHeight: 200,
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
        maxHeight: 100,
        marginBottom: 12,
    },
    commentItem: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
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
});