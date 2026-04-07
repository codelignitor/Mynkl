import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // ============ COMMON STYLES ============
  wrapper: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  
  // ============ WELCOME SCREEN STYLES ============
  welcomeContainer: {
    flex: 1,
    paddingHorizontal: 24,
    position: 'relative',
  },
  welcomeDecorativeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  welcomeHeartTop: {
    fontSize: 45,
    transform: [{ rotate: '-15deg' }],
  },
  welcomeHugTop: {
    fontSize: 50,
    transform: [{ rotate: '15deg' }],
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -90,
  },
  welcomeTitle: {
    fontSize: 42,
    fontWeight: '600',
    color: '#2D2D4F',
    textAlign: 'center',
    marginBottom: 4,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2D2D4F',
    textAlign: 'center',
    marginBottom: 24,
  },
  welcomeSubtitle: {
    fontSize: 22,
    fontWeight: '400',
    color: '#2D2D4F',
    textAlign: 'center',
    lineHeight: 30,
  },
  welcomeDecorativeMiddle: {
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  welcomeHeartMiddle: {
    fontSize: 45,
    transform: [{ rotate: '-17deg' }],
  },
  welcomeHugMiddle: {
    fontSize: 50,
    bottom: 100,
    transform: [{ rotate: '17deg' }],
  },
  welcomeHeartSmall: {
    position: 'absolute',
    left: 60,
    bottom: 180,
  },
  welcomeButtonContainer: {
    paddingBottom: 50,
  },
  welcomeGetStartedButton: {
    backgroundColor: '#FF9B9B',
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  welcomeButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ============ WHO CAN HUG SCREEN STYLES ============
  whoCanHugContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24
  },
  whoCanHugDecorativeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  whoCanHugHeartTop: {
    fontSize: 30,
    paddingLeft:21
  },
  whoCanHugTop: {
    fontSize: 45,
    transform: [{ rotate: '17deg' }],
  },
  whoCanHugTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2D2D4F',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 46,
  },
  whoCanHugOptionsList: {
    flex: 1,
  },
  whoCanHugOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 32
  },
  whoCanHugAffirmationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 32,
  },
  whoCanHugOptionEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  whoCanHugOptionLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 24,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  nextButtonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },

  nextButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },

  nextButton: {
    backgroundColor: '#FF9B9B',
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ============ HAPTIC FEEDBACK SCREEN STYLES ============
  hapticContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18
  },
  hapticDecorativeTop: {
    paddingTop: 40,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hapticLeftGroup: {
    position: 'relative',
  },
  hapticRightGroup: {
    position: 'relative',
  },
  hapticHeartMedium: {
    fontSize: 30,
  },
  hapticHeartLarge: {
    fontSize: 40,
  },
  hapticStarSmall: {
    fontSize: 20,
    position: 'absolute',
    top: -10,
    left: 50,
  },
  hapticStarSmall2: {
    fontSize: 20,
    position: 'absolute',
    bottom: 0,
    right: 50,
  },
  hapticContent: {
    flex: 1,
    paddingTop: 20,
  },
  hapticTitle: {
    fontSize: 41,
    fontWeight: '600',
    color: '#2D2D4F',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 46,
  },
  hapticCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hapticCardLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 26,
  },
  hapticIntensityLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  hapticIntensityWrapper: {
    width: '100%',
  },
  hapticSliderContainer: {
    width: '100%',
    marginTop: 35,
  },
  hapticSlider: {
    width: '100%',
    height: 30,
  },
  hapticLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 12,
  },
  hapticSliderLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  hapticDeviceInfo: {
    fontSize: 14,
    color: '#4c4f54ff',
    textAlign: 'center',
    marginTop: 20,
  },
  hapticButtonContainer: {
    paddingBottom: 40,
  },
  hapticCompleteButton: {
    backgroundColor: '#FF9B9B',
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  hapticButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Add to style.ts
statusMessage: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(124, 58, 237, 0.1)',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  marginBottom: 20,
},

statusText: {
  fontSize: 14,
  color: '#7C3AED',
  fontWeight: '500',
  marginLeft: 10,
},

checkInMessage: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(124, 58, 237, 0.1)',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: 'rgba(124, 58, 237, 0.3)',
},

checkInMessageText: {
  fontSize: 14,
  color: '#7C3AED',
  fontWeight: '500',
  marginLeft: 10,
},

destinationHint: {
  fontSize: 11,
  color: 'rgba(255, 255, 255, 0.7)',
  marginTop: 2,
  fontStyle: 'italic',
},
});

export { styles };