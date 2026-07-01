import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mood: {
    fontSize: 28,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  text: {
    fontSize: 16,
    marginTop: 8,
  },
  location: {
    fontSize: 12,
    color: '#007BFF',
    marginTop: 8,
  },
});