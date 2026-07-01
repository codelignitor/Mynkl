import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8D5D0',
  },
  gradientContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 50,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 36,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 30,
  },
  anonymousCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  normalCard: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  normalCardGradient: {
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  cardContent: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
    position: 'relative',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personIconsContainer: {
    width: 60,
    height: 60,
    position: 'relative',
  },
  personIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
  },
  personIcon1: {
    backgroundColor: '#A855F7',
    left: 0,
    top: 14,
    zIndex: 1,
  },
  personIcon2: {
    backgroundColor: '#3B82F6',
    right: 0,
    top: 14,
    zIndex: 2,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
  },
  sparkle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  sparkle1: {
    width: 3,
    height: 8,
    top: 2,
    right: 8,
    transform: [{ rotate: '20deg' }],
  },
  sparkle2: {
    width: 8,
    height: 3,
    top: 5,
    right: 5,
    transform: [{ rotate: '20deg' }],
  },
  sparkle3: {
    width: 2,
    height: 6,
    top: 8,
    right: 2,
    transform: [{ rotate: '45deg' }],
  },
  anonymousCardText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#4A5568',
    textAlign: 'center',
  },
  normalCardText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});