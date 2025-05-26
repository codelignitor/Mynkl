import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 44 : 0,
   
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 64,
  },
  moodList: {
    marginBottom: 20,
  },
  moodButton: {
    alignItems: "center",
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  selectedMood: {
    backgroundColor: "#cce5ff",
    borderColor: "#007BFF",
  },
  moodEmoji: {
    fontSize: 32,
  },
  moodLabel: {
    marginTop: 4,
    fontSize: 14,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 100,

    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 14,
    flexShrink: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});