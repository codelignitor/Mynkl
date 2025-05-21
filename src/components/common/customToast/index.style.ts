import { StyleSheet, ViewStyle } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    elevation: 4,
  } as ViewStyle,
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  message: {
    fontSize: 14,
    color: '#eee',
    marginTop: 4,
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#F44336',
  },
});