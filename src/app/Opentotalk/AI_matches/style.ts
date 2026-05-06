import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  backBtn: {
    width: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  header: {
    color: '#2a9d8f',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  title: {
    color: '#1a3a38',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 14,
    letterSpacing: 0.2,
    textAlign: 'center',
  },

  // ── "Great chat" pill ─────────────────────────────────────────────────────
  greatChatPill: {
    backgroundColor: 'rgba(42,157,143,0.12)',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.2)',
  },
  greatChatText: {
    color: '#2a9d8f',
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Avatar section ────────────────────────────────────────────────────────
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  avatarGlowRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    borderColor: 'rgba(42,157,143,0.35)',
    padding: 5,
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    // elevation: 8,
    backgroundColor: 'rgba(42,157,143,0.05)',
  },
  avatarInnerRing: {
    flex: 1,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(42,157,143,0.5)',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tagsColumn: {
    marginLeft: 14,
    alignItems: 'flex-start',
    gap: 8,
  },
  tagPill: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.2)',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  //  elevation: 1,
  },
  tagText: {
    color: '#2a7a70',
    fontSize: 13,
    fontWeight: '500',
  },

  // ── Name ──────────────────────────────────────────────────────────────────
  nameText: {
    color: '#1a3a38',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },

  // ── Compatibility Score card ───────────────────────────────────────────────
  compatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.15)',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // elevation: 3,
  },
  donutWrap: {
    alignItems: 'center',
    marginRight: 16,
  },
  donutOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 7,
    borderColor: '#2a9d8f',
    borderTopColor: 'rgba(42,157,143,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  donutInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  donutScore: {
    color: '#1a3a38',
    fontSize: 26,
    fontWeight: '800',
  },
  donutLabel: {
    color: '#4a8a84',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 17,
    fontWeight: '500',
  },
  compatLabelWrap: {
    flex: 1,
  },
  compatTitle: {
    color: '#1a3a38',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 27,
  },

  // ── Icebreaker card ────────────────────────────────────────────────────────
  icebreakerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.15)',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    // elevation: 2,
  },
  icebreakerLeft: {
    flex: 1,
    marginRight: 12,
  },
  icebreakerLabel: {
    color: '#2a9d8f',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  icebreakerText: {
    color: '#1a3a38',
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '400',
  },
  refreshBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    paddingTop: 4,
  },
  refreshLabel: {
    color: '#2a9d8f',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
    lineHeight: 16,
  },

  // ── Mode & Style label row ─────────────────────────────────────────────────
  modeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  modeLabelText: {
    color: '#2a9d8f',
    fontSize: 14,
    fontWeight: '600',
  },
  modeDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(42,157,143,0.4)',
    marginHorizontal: 10,
  },

  // ── Start Chat button ──────────────────────────────────────────────────────
  startChatBtn: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    // elevation: 6,
  },
  startChatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    paddingHorizontal: 32,
  },
  startChatText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Find Next Match button ─────────────────────────────────────────────────
  nextMatchBtn: {
    width: '100%',
    borderRadius: 30,
    paddingVertical: 17,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1.5,
    borderColor: 'rgba(42,157,143,0.4)',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // elevation: 2,
    marginBottom: 10,
  },
  nextMatchText: {
    color: '#2a9d8f',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // ── Centered loading / error / empty state ────────────────────────────────
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    minHeight: 500,
  },
  stateText: {
    color: '#2a7a70',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  retryBtn: {
    marginTop: 24,
    backgroundColor: '#2a9d8f',
    borderRadius: 24,
    paddingVertical: 13,
    paddingHorizontal: 36,
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    // elevation: 4,
  },
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default styles;