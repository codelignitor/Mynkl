import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'CONNECTED_HUGS';

export const saveConnectedHug = async (
  connection
) => {

 try {

   const existing =
     await AsyncStorage.getItem(KEY);

   const parsed =
     existing
       ? JSON.parse(existing)
       : [];

   const alreadyExists =
     parsed.some(
       x =>
       x.hugId === connection.hugId
     );

   if (!alreadyExists) {

     parsed.push(connection);

     await AsyncStorage.setItem(
       KEY,
       JSON.stringify(parsed)
     );
   }

 } catch (e) {

   console.log(e);

 }

};

export const getConnectedHug =
async (
 hugId
)=>{

 const stored =
 await AsyncStorage.getItem(KEY);

 const parsed =
 stored
 ? JSON.parse(stored)
 : [];

 return parsed.find(
   x =>
   x.hugId == hugId
 );

};