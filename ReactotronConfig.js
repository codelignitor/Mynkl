import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (__DEV__) {
  Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({ name: 'Mynkl Expo Dev' })
    .useReactNative({
      asyncStorage: true,
      networking: {
        ignoreUrls: /symbolicate|127\.0\.0\.1/,
      },
      errors: { veto: () => false },
      overlay: false,
    })
    .connect();

  console.tron = Reactotron; // optional: a simpler alias
}
export default Reactotron;
