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
    color: '#07373D',
    fontSize: 24,
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
  marginTop: 24,
 
  },
  avatarGlowRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    padding: 5,
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: 'rgba(42,157,143,0.05)',
    borderColor: 'rgba(34, 200, 195, 0.28)',  // teal glow
    shadowColor: '#22C8C3',
    shadowOpacity: 0.34,
    shadowRadius: 20,
  },
  avatarInnerRing: {
    flex: 1,
    borderRadius: 80,
    borderWidth: 2,
    
    overflow: 'hidden',
    borderColor: 'rgba(34, 200, 195, 0.28)',  // teal glow
    shadowColor: '#22C8C3',
    shadowOpacity: 0.34,
    shadowRadius: 20,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

floatingTag: {
  position: 'absolute',
  backgroundColor: 'rgba(255,255,255,0.92)',
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 999,
  borderWidth: 1,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 6,
  elevation: 3,
  borderColor: 'rgba(150, 235, 235, 0.75)',
  shadowColor: 'rgba(110, 198, 195, 0.14)',
  shadowOpacity: 1,
},

tagTopRight: {
  top: 18,
  right: -70,
},

tagMiddleRight: {
  top: 60,
  right: -90,
},

tagBottomLeft: {
  top: 110,
  right: -90,
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
  backgroundColor: 'rgba(255,255,255,0.64)',
  borderRadius: 20,
  padding: 18,
  width: '100%',
  marginBottom: 16,
  borderWidth: 1,
  borderColor: 'rgba(150, 235, 235, 0.75)',
  shadowColor: 'rgba(110, 198, 195, 0.14)',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 1,
  shadowRadius: 18,
},
  donutWrap: {
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 20,
},
  donutOuter: {
  width: 130,
  height: 130,
  borderRadius: 65,
  borderWidth: 8,
  borderColor: '#22C8C3',
  borderTopColor: 'rgba(34,200,195,0.15)',
  alignItems: 'center',
  justifyContent: 'center',
  transform: [{ rotate: '-45deg' }],
},
  donutInner: {
  width: 106,
  height: 106,
  borderRadius: 53,
  backgroundColor: 'rgba(255,255,255,0.95)',
  alignItems: 'center',
  justifyContent: 'center',
  transform: [{ rotate: '45deg' }],
},
  donutScore: {
  color: '#07373D',
  fontSize: 30,
  fontWeight: '800',
  letterSpacing: -0.5,
  lineHeight: 34,
},
  donutLabel: {
  color: '#0D8F8C',
  fontSize: 11,
  textAlign: 'center',
  marginTop: 3,
  lineHeight: 15,
  fontWeight: '600',
},
  compatLabelWrap: {
  flex: 1,
  paddingLeft: 4,
},
  compatTitle: {
  color: '#07373D',
  fontSize: 18,
  fontWeight: '700',
  lineHeight: 24,
  marginBottom: 6,
},
compatSubText: {
  color: '#416873',
  fontSize: 13,
  fontWeight: '400',
  lineHeight: 19,
  marginBottom: 8,
},

compatLearnMore: {
  color: '#22C8C3',
  fontSize: 13,
  fontWeight: '600',
},

  // ── Icebreaker card ────────────────────────────────────────────────────────
  icebreakerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    marginBottom: 18,
    borderWidth: 1,
    // borderColor: 'rgba(42,157,143,0.15)',
    // shadowColor: '#2a9d8f',
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.08,
    // shadowRadius: 10,
    // elevation: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.64)',
borderColor: 'rgba(150, 235, 235, 0.75)',
shadowColor: 'rgba(110, 198, 195, 0.14)',  // use as shadowColor with opacity:1
shadowOpacity: 1,
shadowRadius: 18,
shadowOffset: { width: 0, height: 10 },
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
nextMatchBtnDisabled: {
  opacity: 0.6,
},
nextMatchLoading: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
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