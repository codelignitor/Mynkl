import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    color: '#b3b3b3',
    fontSize: 26,
    fontWeight: '600',
  },
  headerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: 10,
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
  title: {
    marginTop: 15,
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  subtitle: {
    marginTop: 3,
    color: '#fff',
    fontSize: 30,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 120, 90, 0.35)',
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginBottom: 18,
    width: '90%',
    alignSelf: 'center',
  },
  toggleLabel: {
    color: '#fff',
    fontSize: 20,
    marginRight: 16,
  },
  upbeatMsg: {
    marginTop: 10,
    color: '#b3b3b3',
    fontSize: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
  },
  optionBtn: {
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    color: '#b3b3b3',
    fontSize: 16,
    marginTop: 6,
  },
  upbeatMsg2: {
    color: '#b3b3b3',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 12,
  },
  moodInsightCard: {
    backgroundColor: 'rgba(20, 60, 60, 0.25)',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  startButton: {
    marginTop: 18,
    backgroundColor: '#1ed760',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 36,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 18,
    backgroundColor: 'rgba(20, 60, 60, 0.18)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusOptionSelected: {
    backgroundColor: 'rgba(24, 243, 170, 0.18)',
  },
  statusLabel: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '400',
  },
  statusLabelSelected: {
    fontWeight: 'bold',
  },
});

export default styles;
