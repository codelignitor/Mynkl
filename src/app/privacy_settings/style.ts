import { StyleSheet, Platform } from "react-native";

const CARD_SHADOW = {
  shadowColor: "#6C63FF",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 16,
  elevation: 1,
};

export const styles = StyleSheet.create({
  // ─── Root ──────────────────────────────────────────────────
  safe: {
    flex: 1,
    backgroundColor: "#fbfbfd",
    paddingTop: Platform.OS === "android" ? 40 : 20,
  },

  // ─── Header ────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: "#fbfbfd",
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...CARD_SHADOW,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1340",
    flex: 1,
    flexWrap: "wrap",
  },

  // ─── Scroll ────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  // ─── Sub-header ────────────────────────────────────────────
  subHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  shieldWrap: {
    marginTop: 1,
  },
  subHeaderText: {
    flex: 1,
    fontSize: 13,
    color: "#6B6898",
    lineHeight: 19,
    fontWeight: "400",
  },

  // ─── Section ───────────────────────────────────────────────
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6C63FF",
    letterSpacing: 0.8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },

  // ─── Card ──────────────────────────────────────────────────
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    ...CARD_SHADOW,
  },

  // ─── Row ───────────────────────────────────────────────────
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  rowText: {
    flex: 1,
  },
  rowTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1340",
  },
  infoBtn: {
    padding: 1,
  },
  rowSubtitle: {
    fontSize: 12,
    color: "#9E9BB5",
    lineHeight: 17,
    marginTop: 2,
    fontWeight: "400",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  chevron: {
    marginLeft: 4,
  },

  // ─── Divider ───────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: "#F0EFF8",
    marginLeft: 56,
  },

  // ─── Privacy Footer ────────────────────────────────────────
  privacyFooter: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    ...CARD_SHADOW,
    shadowColor: "#6C63FF",
    shadowOpacity: 0.05,
  },
  privacyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EDE9FF",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  privacyTextWrap: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1340",
    marginBottom: 4,
  },
  privacyBody: {
    fontSize: 12,
    color: "#9E9BB5",
    lineHeight: 18,
    fontWeight: "400",
  },
  privacyLink: {
    color: "#6C63FF",
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // ─── Loading / Error states ────────────────────────────────
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 14,
    color: "#9E9BB5",
    fontWeight: "500",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1340",
    textAlign: "center",
  },
  errorSub: {
    fontSize: 13,
    color: "#9E9BB5",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: "#6C63FF",
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 11,
  },
  retryBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  // ─── Tab Bar ───────────────────────────────────────────────
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0EFF8",
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    paddingTop: 10,
    paddingHorizontal: 8,
    ...CARD_SHADOW,
    shadowOffset: { width: 0, height: -2 },
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  tabActivePill: {
    width: 44,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(108, 99, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 10,
    color: "#9E9BB5",
    fontWeight: "500",
  },
  tabLabelActive: {
    color: "#6C63FF",
    fontWeight: "700",
  },
});