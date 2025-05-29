import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8D5D0',
  },
  gradientContainer: {
    flex: 1,
    backgroundColor: '#A8D5D0', // Top color
    paddingHorizontal: 40,
    paddingTop: 100,
    paddingBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // Simulate gradient effect with a subtle overlay
  },
  iconContainer: {
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hugIconContainer: {
    width: 200,
    height: 160,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Person 1 (Left - Purple/Pink)
  person1Container: {
    position: 'absolute',
    left: 20,
    top: 0,
    zIndex: 2,
  },
  person1Head: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E879F9', // Bright pink/purple
    marginBottom: 5,
    marginLeft: 15,
  },
  person1Body: {
    width: 80,
    height: 100,
    borderRadius: 40,
    backgroundColor: '#A855F7', // Purple gradient
    position: 'relative',
  },
  person1Arm: {
    position: 'absolute',
    top: 70,
    right: -20,
    width: 60,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#A855F7',
    transform: [{ rotate: '20deg' }],
    zIndex: 3,
  },
  // Person 2 (Right - Blue/Teal)
  person2Container: {
    position: 'absolute',
    right: 20,
    top: 0,
    zIndex: 2,
  },
  person2Head: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#60A5FA', // Bright blue
    marginBottom: 5,
    marginRight: 15,
  },
  person2Body: {
    width: 80,
    height: 100,
    borderRadius: 40,
    backgroundColor: '#06B6D4', // Teal/cyan
    position: 'relative',
  },
  person2Arm: {
    position: 'absolute',
    top: 70,
    left: -20,
    width: 60,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#06B6D4',
    transform: [{ rotate: '-20deg' }],
    zIndex: 3,
  },
  // Connection between the two people (hug area)
  hugConnection: {
    position: 'absolute',
    top: 80,
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1,
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '600',
    color: '#374151', // Dark gray
    textAlign: 'center',
  },
  subtitleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#6B7280', // Medium gray
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 2,
  },
});