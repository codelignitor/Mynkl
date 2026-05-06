import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#e4f8f4',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  // ── Back button ─────────────────────────────────────────────────────────────
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 36,
    left: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Scroll area ─────────────────────────────────────────────────────────────
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 110 : 88,
    paddingHorizontal: 22,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // ── Headline ────────────────────────────────────────────────────────────────
  title: {
    color: '#1a3a38',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 6,
  },
  moodHighlight: {
    color: '#2a9d8f',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: '#4a8a84',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 28,
    fontWeight: '400',
    lineHeight: 22,
  },

  // ── Emoji mood row ──────────────────────────────────────────────────────────
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 4,
  },
  emojiBtn: {
    alignItems: 'center',
    flex: 1,
  },
  emojiCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1.5,
    borderColor: 'rgba(42,157,143,0.12)',
    marginBottom: 6,
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // elevation: 1,
  },
  emojiCircleSelected: {
    backgroundColor: 'rgba(42,157,143,0.12)',
    borderColor: '#2a9d8f',
    borderWidth: 2,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    // elevation: 4,
  },
  emojiChar: {
    fontSize: 26,
  },
  emojiLabel: {
    color: '#7bbfba',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  emojiLabelSelected: {
    color: '#2a9d8f',
    fontWeight: '700',
  },

  // ── Optional note ───────────────────────────────────────────────────────────
  sectionLabel: {
    alignSelf: 'flex-start',
    color: '#2a9d8f',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  noteWrap: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.15)',
    marginBottom: 22,
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    // elevation: 2,
  },
  noteInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#1a3a38',
    fontSize: 15,
    minHeight: 56,
    lineHeight: 22,
  },

  // ── Connect card ────────────────────────────────────────────────────────────
  connectCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.12)',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    // elevation: 3,
  },
  connectTitle: {
    color: '#1a3a38',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  friendRequestBtn: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    // elevation: 5,
  },
  friendRequestBtnActive: {
    shadowOpacity: 0.15,
  },
  friendRequestGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendRequestText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Safety card ─────────────────────────────────────────────────────────────
  safetyCard: {
    width: '100%',
    // backgroundColor: 'rgba(255,255,255,0.65)',
    // borderRadius: 18,
    // padding: 16,
    marginBottom: 22,
    // borderWidth: 1,
    // borderColor: 'rgba(224,92,92,0.1)',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 6,
    // elevation: 2,
    alignItems: 'center',
  },
  safetyTitle: {
    color: '#1a3a38',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  safetyDesc: {
    color: '#7bbfba',
    fontSize: 13,
    marginBottom: 14,
    fontWeight: '400',
  },
  safetyBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  safetyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 18,
    // paddingVertical: 10,
    // borderRadius: 20,
    // borderWidth: 1.5,
    // borderColor: 'rgba(224,92,92,0.4)',
    // backgroundColor: 'rgba(255,255,255,0.7)',
  },
  safetyBtnActive: {
    // color: '#e05c5c',
    // borderColor: '#e05c5c',
  },
  safetyBtnText: {
    color: '#2a9d8f',
    fontSize: 14,
    fontWeight: '600',
  },
  safetyBtnTextActive: {
    color: '#e05c5c',
  },

  // ── Submit CTA ──────────────────────────────────────────────────────────────
  submitBtn: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    // elevation: 6,
  },
  submitGradient: {
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Next link ───────────────────────────────────────────────────────────────
  nextBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  nextText: {
    color: '#2a9d8f',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default styles;