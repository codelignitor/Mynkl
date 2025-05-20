import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
   
    padding: 8,
    borderRadius: 26,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,  
    },
    marginHorizontal: 16,
    marginBottom: 16,
  },
  input: {
   
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    
  },
});