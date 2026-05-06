import { StyleSheet } from 'react-native';

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

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  side: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: '#2a9d8f',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Title
  title: {
    marginTop: 12,
    color: '#1a3a38',
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    color: '#4a8a84',
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 22,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 14,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  toggleLabel: {
    color: '#1a3a38',
    fontSize: 18,
    fontWeight: '600',
  },

  // Suggestion/Insight glassmorphism card
  suggestionCard: {
    width: '100%',
    borderRadius: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    // elevation: 3,
    overflow: 'hidden',
  },
  suggestionInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  suggestionDotWrap: {
    marginTop: 3,
    marginRight: 12,
  },
  suggestionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2a9d8f',
  },
  suggestionTitle: {
    color: '#1a3a38',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  suggestionSub: {
    color: '#4a8a84',
    fontSize: 13,
    lineHeight: 19,
  },

  // Conversation Style section
  sectionBlock: {
    width: '100%',
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#1a3a38',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  styleRow: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    gap: 8,
  },
  stylePill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.18)',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // elevation: 1,
  },
  stylePillSelected: {
    backgroundColor: '#6ac7bc',
    // borderColor: '#2a9d8f',
    opacity: 0.9,
  },
  stylePillText: {
    color: '#4a8a84',
    fontSize: 14,
    fontWeight: '500',
  },
  stylePillTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },

  // Mode of Communication glassmorphism card
  modeCard: {
    width: '100%',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // elevation: 3,
    overflow: 'hidden',
  },
  modeTitle: {
    color: '#1a3a38',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  optionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.1)',
  },
  optionBtnSelected: {
    backgroundColor: 'rgba(42,157,143,0.15)',
    borderColor: '#2a9d8f',
    borderWidth: 1.5,
  },
  optionText: {
    color: '#6b9ea0',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#2a9d8f',
    fontWeight: '700',
  },

  // Start button
  startButtonWrap: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    // elevation: 6,
    marginBottom: 14,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // Safety row
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  safetyText: {
    color: '#7bbfba',
    fontSize: 13,
    marginLeft: 4,
  },

  // Bottom nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(42,157,143,0.1)',
    paddingVertical: 10,
    paddingBottom: 22,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 11,
    color: '#9bbcbb',
    marginTop: 3,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#2a9d8f',
    fontWeight: '700',
  },
});

export default styles;