// styles/stepStyles.js
import { StyleSheet } from 'react-native';

export const stepStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  questionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
  },
  questionText: {
    marginTop: 60,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 34,
  },
  questionTextSecondary: {
    fontSize: 30,
    marginTop: 100,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  questionTextThird: {
    fontSize: 30,
    marginTop: 60,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  questionSubText: {
    fontSize: 20,
    color: '#cccccc',
  },
  preferenceContainer: {
    padding: 16,
    backgroundColor: '#121212',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: '#333333',
    borderWidth: 1,
  },
  middleSection: {
    marginVertical: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  checkboxContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundCheckboxSelected: {
    borderColor: '#3498db',
  },
  roundCheckboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498db',
  },
  continueButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 32,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});