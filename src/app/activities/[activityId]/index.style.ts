// EventDetail/index.style.ts
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E6FAF9',
  },
  container:{
    backgroundColor:'#cdf5f2',
    flex:1
  },
  topContainer:{
    backgroundColor:'#cdf5f2',
    paddingTop:44 ,
    paddingHorizontal:22,
    borderBottomRightRadius:32,
    borderBottomLeftRadius:32
  },
  headerContainer:{
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
    alignItems: 'center',
 marginBottom: 16,
    marginTop:32
  },
  headerLabel:{
    fontSize: 36,
    fontWeight: 'semibold',
    color: '#000',
   width: '95%',
  },
  badgeContainer:{
    paddingHorizontal:12,
    borderRadius: 16,
    backgroundColor: '#97dedb',
    paddingVertical:4
  },
  rowContainer:{
    flexDirection: 'row',
  },
  itemContainer:{
  flexDirection: 'row',
  gap:8,
  marginTop:8
  },
  detailsContainer:{
    marginHorizontal:22,
    marginTop: 44
  },
  itemLabel:{
    fontSize: 22,
    color: '#000',
    fontWeight: '300',
  },
  divider:
    { height: 1, backgroundColor: '#31c0bc', marginVertical: 16 },
    descriptionLabel:{
        fontSize:22,
        fontWeight:'500'
    },
    descriptionValue:{
        fontSize: 16,
        color: 'gray',
        fontWeight: '300',
        lineHeight: 24
    },
    buttonStyle:{
        backgroundColor: '#31c0bc',
        paddingVertical: 12,
        borderRadius: 32,
        alignItems: 'center',
        marginTop: 16,
        marginHorizontal: 22,
        marginBottom:22,
    },
    buttonText:{
        fontSize: 20,
        color: '#fff',
        fontWeight: '500',
        
    },
  
  
});
