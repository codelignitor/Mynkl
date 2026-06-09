import { StyleSheet, Platform } from 'react-native';

const TEAL        = '#1a9d8f';
const TEAL_DARK   = '#0f6e56';
const TEXT_DARK   = '#0d2b29';
const TEXT_MID    = '#4a7a74';
const TEXT_LIGHT  = '#8ab5b0';
const BORDER      = '#e0efed';
const CARD_BG     = '#f7fdfb';
const WHITE       = '#ffffff';
const RED_REPORT  = '#d44';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WHITE,
  },
  bgWhite: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: WHITE,
  },

  // ── Safety top-right button ──────────────────────────────────────────────────
  safetyTopBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 36,
    right: 18,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: WHITE,
  },
  safetyTopText: {
    color: TEXT_DARK,
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Back button ─────────────────────────────────────────────────────────────
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 36,
    left: 18,
    zIndex: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Scroll area ─────────────────────────────────────────────────────────────
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 116 : 92,
    paddingHorizontal: 20,
    paddingBottom: 48,
    alignItems: 'center',
  },

  // ── Headline ────────────────────────────────────────────────────────────────
  title: {
    color: TEXT_DARK,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: TEXT_MID,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '400',
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  // ── Emoji mood row ──────────────────────────────────────────────────────────
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 28,
    paddingHorizontal: 2,
  },
  emojiBtn: {
    alignItems: 'center',
    flex: 1,
  },
  emojiCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9f7',
    borderWidth: 1.5,
    borderColor: BORDER,
    marginBottom: 6,
  },
  emojiCircleSelected: {
    backgroundColor: '#e6f8f4',
    borderColor: TEAL,
    borderWidth: 2,
  },
  emojiChar: {
    fontSize: 26,
  },
  emojiLabel: {
    color: TEXT_LIGHT,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  emojiLabelSelected: {
    color: TEAL,
    fontWeight: '700',
  },

  // ── Section label ────────────────────────────────────────────────────────────
  sectionLabel: {
    alignSelf: 'flex-start',
    color: TEXT_DARK,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },

  // ── Note input ────────────────────────────────────────────────────────────────
  noteWrap: {
    width: '100%',
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    marginBottom: 20,
    minHeight: 100,
  },
  noteInput: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    color: TEXT_DARK,
    fontSize: 15,
    minHeight: 72,
    lineHeight: 22,
  },
  charCounter: {
    alignSelf: 'flex-end',
    paddingRight: 14,
    paddingBottom: 10,
    color: TEXT_LIGHT,
    fontSize: 12,
    fontWeight: '500',
  },

  // ── Connect card ────────────────────────────────────────────────────────────
  connectCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },
  connectTitle: {
    color: TEXT_DARK,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  connectSub: {
    color: TEXT_MID,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '400',
  },
  friendRequestBtn: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  friendRequestInner: {
    backgroundColor: TEAL,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  friendRequestSent: {
    backgroundColor: TEAL_DARK,
  },
  friendRequestText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // ── Submit CTA ──────────────────────────────────────────────────────────────
  submitBtn: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  submitGradient: {
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Report / Block (bottom links) ────────────────────────────────────────────
  safetyBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 14,
  },
  safetyActionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  safetyActionText: {
    color: TEXT_DARK,
    fontSize: 15,
    fontWeight: '600',
  },
  reportText: {
    color: RED_REPORT,
  },
  safetyActionTextDone: {
    color: TEXT_MID,
    fontWeight: '500',
  },

  // ── Block confirmation modal ───────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
});

export default styles;