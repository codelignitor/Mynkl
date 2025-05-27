import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
       paddingTop: Platform.OS === 'android' ? 44 : 0,
       backgroundColor:'#768898'
    },
    mapContainerStyle:{
       height: '100%',
    },
    activitiesContainer:{
       
        backgroundColor: '#768898',
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '42.5%',
    },
    activitiesLabel:{fontSize: 32, fontWeight: 'bold', color: '#fff'},
    rowContiner:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,},
        seeMore:{
            fontSize: 16, fontWeight: 'bold', color: '#fff'
        },
        activityContainer:{
           
            borderRadius:32,
            marginHorizontal:16
            ,backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
        },
        activityDetailsContainer:{
            paddingLeft:14,
            
           
            
        },
        timeLabel:{
fontSize: 16, color: 'gray' 
        },
        activityLabel:{fontSize: 24, fontWeight: 'bold', color: '#000' , width:'65%'},
});