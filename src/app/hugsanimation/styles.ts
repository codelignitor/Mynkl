import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
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
    color: '#000',
  },
  profileButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#FF4444',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  sendSection: {
    alignItems: 'center',
    position: 'absolute',
    left: 60,
    top: '30%',
  },
  locationIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sendText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  curveContainer: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    height: 200,
  },
  curve: {
    position: 'absolute',
    top: 60,
    left: 100,
    right: 100,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
    transform: [{ rotate: '15deg' }],
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50,
  },
  ripple: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  ripple2: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
  },
  hugEmoji: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  hugEmojiText: {
    fontSize: 32,
  },
  receiversSection: {
    alignItems: 'center',
    position: 'absolute',
    right: 60,
    top: '30%',
  },
  floatingEmoji: {
    marginBottom: 10,
  },
  floatingEmojiText: {
    fontSize: 24,
  },
  receiversText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  messageText: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 30,
    marginBottom: 60,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginRight: 10,
  },
});