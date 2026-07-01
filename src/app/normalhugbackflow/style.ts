import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Common Styles
  container: {
    flex: 1,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  backButton: {
    paddingLeft: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7C3AED',
    marginLeft: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 30,
    paddingHorizontal: 10,
    textAlign: 'center',
    lineHeight: 36,
  },

  // Screen 1: Hug Type Selection
  hugGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  hugCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 140,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hugCardSelected: {
    backgroundColor: '#E9D5FF',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  hugEmoji: {
    fontSize: 38,
    marginBottom: 12,
  },
  hugLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    textAlign: 'center',
    lineHeight: 22,
  },
  nextButton: {
    backgroundColor: '#E9D5FF',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 30,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7C3AED',
  },

  // Screen 2: Message Selection
  scrollContent: {
    paddingBottom: 20,
  },
  customMessageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    minHeight: 100,
  },
  customMessageInput: {
    fontSize: 16,
    color: '#2C2C2C',
    lineHeight: 22,
    minHeight: 60,
  },
  charCounter: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  messagesContainer: {
    marginBottom: 20,
  },
  messageCard: {
    backgroundColor: '#E9D5FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  messageCardSelected: {
    backgroundColor: '#C4B5FD',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  messageText: {
    fontSize: 16,
    color: '#2C2C2C',
    lineHeight: 22,
  },
  messageTextSelected: {
    fontWeight: '600',
  },
  actionButtons: {
    paddingBottom: 30,
    paddingTop: 10,
  },
  sendButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7C3AED',
  },

  // Screen 3: Hug Sent
  sentContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  hugIconContainer: {
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  hugCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(196, 181, 253, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hugEmojiLarge: {
    fontSize: 80,
  },
  handsContainer: {
    position: 'absolute',
    bottom: -20,
  },
  handsEmoji: {
    fontSize: 60,
  },
  sentTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 16,
    textAlign: 'center',
  },
  sentSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
  },

  // Screen 4: Confirmation
  confirmationContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  confirmationHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 40,
  },
  avatarContainer: {
    marginBottom: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#E9D5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDE4E4',
  },
  avatarEmoji: {
    fontSize: 60,
  },
  confirmationTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 36,
  },
  confirmationSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 50,
  },
  chatButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 80,
    marginBottom: 30,
  },
  chatButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  actionText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  separator: {
    fontSize: 16,
    color: '#6B7280',
    marginHorizontal: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  backToDashboardButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 60,
    marginTop: 'auto',
    marginBottom: 40,
  },
  backToDashboardButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});