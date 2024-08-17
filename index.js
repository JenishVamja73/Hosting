/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import analytics from '@react-native-firebase/analytics';
import { enableScreens } from 'react-native-screens';
enableScreens();


analytics().logEvent('your_event_name', {
    key1: 'value1',
    key2: 'value2',
  });

AppRegistry.registerComponent(appName, () => App);
