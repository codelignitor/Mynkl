import { StyleSheet, Platform } from 'react-native';

const CARD_SHADOW = {
  shadowColor: '#c2bff7',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 4,
};

export const styles = StyleSheet.create({
  // ─── Layout ───────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 20 : 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // ─── Header helpers ───────────────────────────────────────
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    // backgroundColor: 'rgba(108, 99, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── Hero Section ─────────────────────────────────────────
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 14,
  },
  heroIconWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroIconBg: {
    width: 42,
    height: 42,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1340',
    lineHeight: 26,
    flex: 1,
  },

  // ─── Card ─────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    ...CARD_SHADOW,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1340',
  },
  cardOptional: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9E9BB5',
  },
  infoIconSmall: {
    marginLeft: 4,
  },

  // ─── Mood ─────────────────────────────────────────────────
  moodList: {
    paddingVertical: 4,
    gap: 10,
  },
  moodItem: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  moodItemSelected: {},
  moodBubble: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 244, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(108, 99, 255, 0.08)',
    marginBottom: 6,
    // glass effect
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  moodBubbleSelected: {
    borderColor: '#6C63FF',
    borderWidth: 2,
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
    shadowOpacity: 0.2,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9E9BB5',
    textAlign: 'center',
  },
  moodLabelSelected: {
    color: '#6C63FF',
    fontWeight: '700',
  },

  // ─── Note ─────────────────────────────────────────────────
  charCount: {
    fontSize: 12,
    color: '#9E9BB5',
    textAlign: 'right',
    marginTop: 4,
  },

  // ─── Place Context (At a Place / Just Personal) ───────────
  placeContextRow: {
    flexDirection: 'row',
    gap: 12,
  },
  placeContextOption: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EBEBF5',
    backgroundColor: '#FAFAFE',
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    gap: 6,
  },
  placeContextSelected: {
    borderColor: '#6C63FF',
    backgroundColor: 'rgba(108, 99, 255, 0.04)',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeContextTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1340',
    textAlign: 'center',
  },
  placeContextTitleSelected: {
    color: '#6C63FF',
  },
  placeContextSub: {
    fontSize: 12,
    color: '#9E9BB5',
    textAlign: 'center',
    lineHeight: 17,
  },

  // ─── Location Mode buttons (At a Place / Current Location) ─
  locationModeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  locationModeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#EBEBF5',
    paddingVertical: 11,
    paddingHorizontal: 10,
    backgroundColor: '#FAFAFE',
  },
  locationModeBtnSelected: {
    borderColor: '#6C63FF',
    backgroundColor: 'rgba(108, 99, 255, 0.06)',
  },
  locationModeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  locationModeBtnTextSelected: {
    color: '#6C63FF',
  },

  // ─── Active location row ──────────────────────────────────
  activeLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F5F4FF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  activeLocationIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  activeLocationName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1340',
  },
  activeLocationSub: {
    fontSize: 12,
    color: '#9E9BB5',
    marginTop: 2,
  },
  changeLink: {
    color: '#6C63FF',
    fontWeight: '600',
  },

  // ─── Anonymous Card ───────────────────────────────────────
  anonymousCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: '#FAFAFE',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.12)',
  },
  anonymousIconWrap: {
    marginTop: 2,
  },
  anonymousTextWrap: {
    flex: 1,
  },
  anonymousTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1340',
  },
  anonymousBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  anonymousBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  anonymousBadgeLabel: {
    fontSize: 11,
    color: '#6C63FF',
    fontWeight: '500',
  },

  // ─── Submit ───────────────────────────────────────────────
  submitGradient: {
    borderRadius: 30,
    marginTop: 6,
    marginBottom: 10,
    ...CARD_SHADOW,
    shadowColor: '#FF6B9D',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  submitInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    gap: 10,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  submitHeartWrap: {
    position: 'absolute',
    right: 24,
    top: '50%',
    marginTop: -11,
  },
  submitHint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9E9BB5',
    marginBottom: 20,
  },

  // ─── Social row ───────────────────────────────────────────
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  socialTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1340',
  },
  socialSub: {
    fontSize: 12,
    color: '#9E9BB5',
    marginTop: 2,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  manageBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C63FF',
  },

  // ─── Legacy / kept for compatibility ──────────────────────
  contentContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 32, fontWeight: '600', color: '#2D5A5A', textAlign: 'center', marginBottom: 40, marginTop: 20 },
  noteContainer: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 10, marginBottom: 30, minHeight: 120 },
  textInput: { fontSize: 16, color: '#666', textAlignVertical: 'top', flex: 1, fontWeight: '400' },
  locationContainer: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18, marginBottom: 16 },
  locationContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationIcon: { fontSize: 20, color: '#4A9B9B', marginRight: 12 },
  locationText: { fontSize: 16, color: '#2D5A5A', fontWeight: '500', marginBottom: 2 },
  locationSubtext: { fontSize: 14, color: '#666', fontWeight: '400', width: '90%' },
  switch: { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] },
  paramContainer: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 15, padding: 15, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#4A9B9B' },
  paramTitle: { fontSize: 16, fontWeight: '600', color: '#2D5A5A', marginBottom: 8 },
  paramText: { fontSize: 14, color: '#666', marginBottom: 4, fontWeight: '400' },
  locationInputContainer: { marginBottom: 20 },
  locationInputField: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  locationInputFieldSelected: { borderColor: '#4A9B9B', borderWidth: 2, backgroundColor: 'rgba(255,255,255,0.95)' },
  searchIcon: { marginRight: 12 },
  locationInputPlaceholder: { fontSize: 16, color: '#4A9B9B', fontWeight: '400', flex: 1 },
  selectedLocationContainer: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(74,155,155,0.3)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectedLocationContent: { flex: 1 },
  selectedLocationTitle: { fontSize: 16, color: '#2D5A5A', fontWeight: '600', marginBottom: 2 },
  selectedLocationSubtitle: { fontSize: 14, color: '#666', fontWeight: '400' },
  locationPinContainer: { marginRight: 15 },
  locationTextContainer: { flex: 1 },
  selectedLocationInstruction: { fontSize: 14, color: '#666', fontWeight: '400', marginTop: 4 },
  selectedLocationAddress: { fontSize: 12, color: '#888', marginTop: 2, fontStyle: 'italic' },
  changeLocationButton: { backgroundColor: 'transparent', paddingHorizontal: 16, paddingVertical: 8 },
  changeLocationButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  submitButton: { borderRadius: 25, paddingVertical: 18, alignItems: 'center', marginBottom: 130 },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  moodButton: { width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', marginHorizontal: 8 },
  selectedMood: { transform: [{ scale: 1.1 }] },
  voiceButton: { position: 'absolute', right: 15, bottom: 15, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  voiceIcon: { fontSize: 20 },
  recordingIndicator: { flexDirection: 'row', alignItems: 'center' },
  recordingDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF3B30', marginRight: 6 },
  recordingText: { fontSize: 12, color: '#FF3B30', fontWeight: '600' },
  transcribingContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9FF', padding: 12, borderRadius: 8, marginHorizontal: 16, marginBottom: 16 },
  transcribingText: { marginLeft: 8, color: '#4A9B9B', fontSize: 14, fontWeight: '500' },
  transcriptionPreview: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#F8F9FA', padding: 12, borderRadius: 8, marginHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E9ECEF' },
  transcriptionPreviewText: { flex: 1, color: '#495057', fontSize: 14, lineHeight: 20, marginRight: 8 },
  clearTranscriptionButton: { padding: 4 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5F5', padding: 12, borderRadius: 8, marginHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: '#FED7D7' },
  errorText: { marginLeft: 8, color: '#E53E3E', fontSize: 14, flex: 1 },
  moodItemContainer: { alignItems: 'center' },
});