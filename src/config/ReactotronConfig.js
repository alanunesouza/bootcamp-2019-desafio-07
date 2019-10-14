import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import AsyncStorage from '@react-native-community/async-storage';
import reactotronSaga from 'reactotron-redux-saga';

const reactotron = Reactotron.configure({ name: 'MyApp' })
  .useReactNative()
  .setAsyncStorageHandler(AsyncStorage)
  .use(reactotronRedux())
  .use(reactotronSaga())
  .connect();

reactotron.clear();

console.tron = reactotron;
