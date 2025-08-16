import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop:30,
    flex: 1,
    backgroundColor: '#A7E2E0', // Light teal background like in the image
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2D5A5A',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  moodList: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  moodButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  selectedMood: {
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 50,
  },
  moodLabel: {
    fontSize: 10,
    color: '#2D5A5A',
    fontWeight: '500',
    marginTop: 2,
  },
  noteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    minHeight: 120,
  },
  textInput: {
    fontSize: 16,
    color: '#666',
    textAlignVertical: 'top',
    flex: 1,
    fontWeight: '400',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '400',
  },
  voiceButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceIcon: {
    fontSize: 20,
  },
  locationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 16,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 20,
    color: '#4A9B9B',
    marginRight: 12,
  },
  locationText: {
    fontSize: 16,
    color: '#2D5A5A',
    fontWeight: '500',
    flex: 1,
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  submitButton: {
    backgroundColor: 'linear-gradient(135deg, #E91E63, #3F51B5)',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 130,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  paramContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4A9B9B',
  },
  paramTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5A5A',
    marginBottom: 8,
  },
  paramText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '400',
  },
});