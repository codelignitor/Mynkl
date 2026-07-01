import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  // Select Hug Screen Styles
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  backgroundImage: {
  flex: 1,
  width: '100%',
  height: '100%',
},
  header: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    
    justifyContent: 'space-between',
    marginBottom: 10,
  },
   backButton: {
    width: 30,
    alignItems: 'flex-start',
  },
  appName: {
    fontSize: 26,
    fontWeight: '600',
    alignItems: 'center',
    color: '#555',
  },
  title: {
    fontSize: 37,
    fontWeight: '700',
    color: '#000',
    marginTop: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 21,
    color: '#777',
    marginBottom: 24,
    marginTop: 6,
    textAlign: 'center',
  },
  cardGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    
  },
  card: {
    backgroundColor: '#fff',
    width: 140,
    height: 150,
    borderRadius: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
    color: '#000',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: '#716bff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#716bff',
  },
  radioText: {
    fontSize: 14,
    color: '#333',
  },
  buttonWrapper: {
    width: '80%',
    paddingTop: 30,
  },
  
  disabledButton: {
    opacity: 0.5,
  },
  
  button: {
    borderRadius: 99,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
// Personal Message Screen Styles
  messageContainer: {
    flex: 1,
    // backgroundColor: '#F5F3FF',
  },
  messageHeader: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  messageContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    flexGrow: 1,
  },
  messageTitle: {
    fontSize: 38,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  messageSubtitle: {
    fontSize: 25,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
    marginBottom: 20,
    minHeight: 80,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  presetCard: {
    height: 90,
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  presetText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '400',
    lineHeight: 22,
  },
  addEmojiContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  addEmoji: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  anonymousContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
},

anonymousTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#111827',
  paddingLeft: 4,
},

anonymousSubtitle: {
  fontSize: 13,
  color: '#6B7280',
  marginTop: 4,
  paddingLeft: 4,
},

  // Confirmation Screen Styles
  confirmationContainer: {
    flex: 1,
  },
  confirmationSafeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  confirmationBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  confirmationTitle: {
    fontSize: 38,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
    marginTop: -40,
  },
  heartImagePlaceholder: {
    width: 180,
    height: 180,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 90,
  },
  heartPlaceholderText: {
    fontSize: 80,
  },
  characterImage:{
    width: 180,
    height: 180,
  },
  confirmationSubtitle: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    color: '#555',
    marginBottom: 80,
  },
  sendAnotherButton: {
    backgroundColor: '#7D75FF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 999,
    marginBottom: 16,
    width: '100%',
  },
  sendAnotherButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dashboardButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 999,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
  },
  dashboardButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});