// style.js - Complete Unified Styles
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Main screen styles
  container: { 
    flex: 1 
  },
  gradientBackground: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0 
  },
  safeArea: { 
    flex: 1 
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingTop: 50, 
    paddingBottom: 20,
  },
  backButton: {
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#FFF' 
  },
  placeholder: { 
    width: 40 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 20, 
    paddingTop: 40 
  },
  floatingEmoji1: { 
    position: 'absolute', 
    top: 50, 
    right: 30, 
    zIndex: 2 
  },
  floatingEmoji2: { 
    position: 'absolute', 
    bottom: 120, 
    left: 30, 
    zIndex: 2 
  },
  floatingEmoji3: {
    position: 'absolute', 
    bottom: 200, 
    right: 50, 
    zIndex: 2 
  },
  emojiText: { 
    fontSize: 32 
  },
  cardsContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingVertical: 40 
  },
  scrollContent: { 
    paddingHorizontal: 10 
  },
  hugCard: {
    width: width * 0.75, 
    height: height * 0.4, 
    borderRadius: 25,
    marginHorizontal: 10, 
    elevation: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8,
  },
  firstCard: { 
    marginLeft: 20 
  },
  lastCard: { 
    marginRight: 20 
  },
  cardGradient: { 
    flex: 1, 
    borderRadius: 25, 
    padding: 20 
  },
  cardContent: { 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  emojiContainer: { 
    alignSelf: 'flex-start', 
    marginBottom: 10 
  },
  cardEmoji: { 
    fontSize: 28 
  },
  cardTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#2C2C2E', 
    marginBottom: 8 
  },
  cardDescription: { 
    fontSize: 16, 
    color: '#2C2C2E', 
    lineHeight: 22, 
    opacity: 0.8 
  },
  tapIndicator: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-end', 
    marginTop: 10 
  },
  tapText: { 
    fontSize: 12, 
    color: 'rgba(44, 44, 46, 0.6)', 
    marginLeft: 4, 
    fontWeight: '500' 
  },

  // Hug Preview Screen styles
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartContainer: {
    position: 'relative',
    marginBottom: 60,
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rippleEffect: {
    position: 'absolute',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,1)',
    borderRadius: 140,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  heart: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 12,
    zIndex: 10,
    position: 'relative',
    overflow: 'visible',
  },
  heartIcon: {
    width: 70,
    height: 63,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartShape: {
    position: 'relative',
    width: 56,
    height: 50,
  },
  heartLeft: {
    position: 'absolute',
    width: 28,
    height: 39,
    backgroundColor: '#ff6b9d',
    borderRadius: 28,
    top: 0,
    left: 0,
    transform: [{ rotate: '-45deg' }],
  },
  heartRight: {
    position: 'absolute',
    width: 28,
    height: 39,
    backgroundColor: '#ff6b9d',
    borderRadius: 28,
    top: 0,
    right: 0,
    transform: [{ rotate: '45deg' }],
  },
  heartBottom: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderTopWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ff6b9d',
    bottom: -1,
    left: 10,
  },
  heartbeatLoader: {
    position: 'absolute',
    width: 260,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -130 }, { translateY: -65 }],
  },
  heartbeatContainer: {
    position: 'absolute',
    width: 180,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartbeatLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 50,
  },
  flatLine: {
    width: 20,
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  smallPeak: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255,255,255,0.9)',
    marginBottom: 1,
  },
  largePeak: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255,255,255,0.9)',
    marginBottom: 1,
  },
  smallDip: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(255,255,255,0.9)',
    marginTop: 12,
  },
  mediumPeak: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255,255,255,0.9)',
    marginBottom: 1,
  },
  flatLineEnd: {
    width: 20,
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    gap: 20,
  },
  sendHugNowButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sendHugNowText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5FBF',
  },
  touchIcon: {
    width: 24,
    height: 24,
  },
  hugHistoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  hugHistoryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },

  // User Selection Screen styles
  sendHugContainer: { 
    flex: 1, 
    backgroundColor: '#FFF',
  },
  sendHugHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 50,
    justifyContent: 'space-between',
  },
  backButtonContainer: {
    marginTop: 20,
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sendHugTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userList: { 
    gap: 12,
    paddingBottom: 20,
  },
  userItem: {
    borderRadius: 16, 
    paddingVertical: 16, 
    paddingHorizontal: 16,
    flexDirection: 'row', 
    alignItems: 'center',
    minHeight: 56,
  },
  userIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userText: { 
    fontSize: 16, 
    color: '#333', 
    flex: 1,
    fontWeight: '500',
  },
  sendButton: {
    marginHorizontal: 20,
    marginBottom: 80,
    borderRadius: 25, 
    paddingVertical: 16, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonActive: {
    backgroundColor: '#2C2C2E',
  },
  sendButtonInactive: {
    backgroundColor: '#E0E0E0',
  },
  sendText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  sendTextActive: {
    color: '#FFF',
  },
  sendTextInactive: {
    color: '#999',
  },

  // Personal Touch Screen Styles
  personalTouchTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    color: 'white',
  },
  recipientsDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  recipientsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  hugTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  personalTouchInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 25,
    minHeight: 50,
  },
  personalTouchTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 80,
    textAlignVertical: 'top',
  },
  personalTouchEmojiContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'flex-start',
    paddingTop: 2,
  },
  personalTouchEmoji: {
    fontSize: 20,
    marginLeft: 8,
  },
  personalTouchAiMessageSection: {
    marginBottom: 30,
  },
  aiMessageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personalTouchAiMessageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  personalTouchAiMessageText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
  },
  personalTouchToggleSection: {
    marginBottom: 30,
  },
  personalTouchToggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  personalTouchToggleLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  personalTouchHapticOption: {
    paddingVertical: 10,
    marginBottom: 40,
  },
  personalTouchHapticText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },

  // Send Hug Animation Screen Message Display
  personalTouchMessageDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  personalTouchMessageSection: {
    marginBottom: 12,
  },
  personalTouchMessageTypeLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  personalTouchDisplayedMessage: {
    fontSize: 16,
    color: 'white',
    fontStyle: 'italic',
  },
  personalTouchSettingsSummary: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  personalTouchHeartIcon: {
    marginLeft: 8,
  },

  // Send Hug Animation Screen styles
  supportiveText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 32,
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    position: 'relative',
  },
  ripple: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 150,
  },
  ripple1: {
    width: 200,
    height: 200,
    top: 50,
    left: 50,
  },
  ripple2: {
    width: 150,
    height: 150,
    top: 75,
    left: 75,
  },
  ripple3: {
    width: 100,
    height: 100,
    top: 100,
    left: 100,
  },
  character: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  characterBody: {
    alignItems: 'center',
  },
  characterHead: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFB89A',
    marginBottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  characterHair: {
    position: 'absolute',
    top: -10,
    width: 50,
    height: 25,
    borderRadius: 25,
    backgroundColor: '#FF8A65',
  },
  characterFace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 5,
  },
  eye: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333',
  },
  characterTorso: {
    alignItems: 'center',
    position: 'relative',
  },
  body: {
    width: 80,
    height: 100,
    borderRadius: 40,
    backgroundColor: '#5C6BC0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  leftArm: {
    position: 'absolute',
    top: 20,
    left: -30,
    width: 40,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#FFB89A',
    transform: [{ rotate: '45deg' }],
    zIndex: 5,
  },
  rightArm: {
    position: 'absolute',
    top: 20,
    right: -30,
    width: 40,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#FFB89A',
    transform: [{ rotate: '-45deg' }],
    zIndex: 5,
  },
  groundCircle: {
    position: 'absolute',
    bottom: -20,
    width: 120,
    height: 20,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginBottom: 70,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
  },
  sendMessageButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendMessageButtonActive: {
    backgroundColor: '#5C6BC0',
  },
  sendMessageButtonInactive: {
    backgroundColor: '#E0E0E0',
  },
  sendMessageButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // History Screen Styles
  historyContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyScrollContent: {
    paddingBottom: 30,
  },
  historyHeaderCard: {
    marginTop: 10,
    marginBottom: 25,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerCardGradient: {
    padding: 25,
    alignItems: 'center',
  },
  headerCardContent: {
    alignItems: 'center',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  journeyText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 5,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    marginLeft: 5,
  },
  timelineSection: {
    flex: 1,
  },
  timeline: {
    paddingLeft: 5,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  timelineLine: {
    alignItems: 'center',
    marginRight: 15,
    zIndex: 1,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  timelineEmoji: {
    fontSize: 18,
  },
  timelineConnector: {
    width: 2,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 5,
  },
  hugCardWrapper: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  hugCardGradient: {
    padding: 20,
    borderRadius: 18,
  },
  hugCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  hugTypeInfo: {
    flex: 1,
    marginRight: 10,
  },
  hugTypeTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  hugTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '400',
  },
  hugDateBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  hugDate: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
  recipientsSection: {
    marginBottom: 15,
  },
  recipientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recipientChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
  },
  recipientName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
  },
  personalSettingsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingsLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
  },
  settingsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  settingChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  settingChipText: {
    fontSize: 10,
    color: 'white',
  },
  historyMessageSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  messageIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  messageText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    fontStyle: 'italic',
    flex: 1,
  },
  hugFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loveIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  loveText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emptyStateGradient: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyStateEmoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  emptyStateTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  encouragementBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  encouragementText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});