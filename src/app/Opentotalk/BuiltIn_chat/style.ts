import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#eaf8f5',
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42,157,143,0.1)',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    // elevation: 4,
    zIndex: 10,
  },
  headerBack: {
    padding: 4,
    marginRight: 6,
  },
  headerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: 'rgba(42,157,143,0.35)',
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  headerName: {
    color: '#1a3a38',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 3,
  },
  styleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42,157,143,0.1)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  styleOnlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2a9d8f',
    marginRight: 5,
  },
  styleBadgeText: {
    color: '#2a9d8f',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: 'rgba(42,157,143,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  endBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(42,157,143,0.35)',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  endBtnText: {
    color: '#2a9d8f',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Dropdown ────────────────────────────────────────────────────────────────
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  dropdown: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 108 : 88,
    right: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 4,
    minWidth: 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    // elevation: 12,
    zIndex: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  dropdownIcon: {
    marginRight: 12,
    width: 22,
    textAlign: 'center',
  },
  dropdownLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginHorizontal: 10,
  },

  // ── Chat area ───────────────────────────────────────────────────────────────
  chatArea: {
    flex: 1,
    backgroundColor: '#eaf8f5',
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },

  // ── Prompt suggestion card ──────────────────────────────────────────────────
  promptCard: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.12)',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    // elevation: 2,
  },
  promptLeft: {
    flex: 1,
  },
  promptTitle: {
    color: '#1a3a38',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  promptText: {
    color: '#4a7a74',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  promptActions: {
    flexDirection: 'row',
    gap: 10,
  },
  promptInsertBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(42,157,143,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.25)',
  },
  promptInsertText: {
    color: '#2a9d8f',
    fontSize: 14,
    fontWeight: '600',
  },
  promptEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.2)',
    gap: 4,
  },
  promptEditText: {
    color: '#4a8a84',
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Date divider ────────────────────────────────────────────────────────────
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(42,157,143,0.15)',
  },
  dateText: {
    color: '#7bbfba',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginHorizontal: 10,
  },

  // ── Message rows ────────────────────────────────────────────────────────────
  msgRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-end',
  },
  msgRowMe: {
    justifyContent: 'flex-end',
  },
  msgRowThem: {
    justifyContent: 'flex-start',
  },
  msgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(42,157,143,0.25)',
  },
  msgColumn: {
    maxWidth: '75%',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  bubbleMe: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.1)',
  },
  bubbleThem: {
    backgroundColor: 'rgba(220,246,242,0.9)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.15)',
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextMe: {
    color: '#1a3a38',
  },
  bubbleTextThem: {
    color: '#1a3a38',
  },
  msgTime: {
    fontSize: 11,
    color: '#9bbcbb',
    marginTop: 4,
  },
  msgTimeMe: {
    textAlign: 'right',
  },
  msgTimeThem: {
    textAlign: 'left',
  },

  // ── "Want another idea?" card ───────────────────────────────────────────────
  newIdeaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.15)',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    // elevation: 2,
    gap: 14,
  },
  newIdeaRight: {
    flex: 1,
  },
  newIdeaTitle: {
    color: '#1a3a38',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  newIdeaBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(42,157,143,0.4)',
    backgroundColor: 'rgba(42,157,143,0.06)',
  },
  newIdeaBtnText: {
    color: '#2a9d8f',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Composer bar ────────────────────────────────────────────────────────────
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(42,157,143,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    // elevation: 6,
    gap: 8,
  },
  emojiBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerInput: {
    flex: 1,
    backgroundColor: 'rgba(234,248,245,0.8)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 9,
    fontSize: 15,
    color: '#1a3a38',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(42,157,143,0.15)',
  },
  micBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(42,157,143,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: '#2a9d8f',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // elevation: 4,
  },

  // ── Modal UI ─────────────────────────────────────────────────────────
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

modalTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
},

modalLabel: {
  marginTop: 10,
  marginBottom: 5,
  fontWeight: "500",
},

reasonContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
},

reasonItem: {
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 20,
  backgroundColor: "#eee",
},

reasonItemActive: {
  backgroundColor: "#2a9d8f",
},

reasonText: {
  fontSize: 12,
},

modalInput: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 10,
  minHeight: 80,
  textAlignVertical: "top",
},

modalActions: {
  flexDirection: "row",
  justifyContent: "flex-end",
  marginTop: 15,
  gap: 10,
},

cancelBtn: {
  padding: 10,
},

submitBtn: {
  backgroundColor: "#2a9d8f",
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 8,
},
});

export default styles;