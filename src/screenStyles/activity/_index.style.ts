import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  topMargin: {
    height: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  placeholderWidth: {
    width: 40,
  },
  username: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
  },
  postContainer: {
    padding: 15,
  },
  postText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 20,
  },
  eventContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 15,
    height: 400,
  },
  emptyImageSpace: {
    height: '70%',
    backgroundColor: '#2C2C2C',
  },
  eventDetails: {
    height: '30%',
    padding: 12,
    justifyContent: 'center',
  },
  eventTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventTime: {
    color: '#cccccc',
    fontSize: 14,
    marginTop: 4,
  },
  horizontalSectionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
    marginBottom: 35,
  },

  // Guided Meditation
  firstSectionWrapper: {
    flex: 1,
    marginRight: 8,
    flexDirection: 'column',
  },
  firstHorizontalSection: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: '#2C2C2C',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 8,
  },
  firstSectionTextBox: {
    height: 40,
  },
  firstSectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  firstSectionSubtext: {
    color: '#cccccc',
    fontSize: 20,
    marginTop: 2,
    fontWeight: 'bold',
  },

  // Hirdlulness
  secondHorizontalSection: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 15,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
  
    justifyContent: 'center',
  },
  secondSectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondSectionSubtext: {
    color: '#cccccc',
    fontSize: 18,
    marginTop: 2,
    fontWeight: 'bold',
  },

  // Exercise
  thirdSectionBox: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'flex-start',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  thirdSectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
  },
  thirdSectionSubtitle: {
    color: '#cccccc',
    fontSize: 14,
    marginTop: 5,
  },

  // Create Colortu Art
  fourthSectionBox: {
    flex: 1.2,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  fourthSectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fourthSectionSubtitle: {
    color: '#cccccc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventImage:{
    width: '100%',
    height: 280,
    borderRadius: 20,
   
  },
  secondEventImage:{
    width: '100%',
    height: 80,
    borderRadius: 20,
  },
  thirdEventImage:{
    width: '100%',
    height: '100%',
    borderRadius: 20,
    position: 'absolute',
    top: 0,

    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }
});