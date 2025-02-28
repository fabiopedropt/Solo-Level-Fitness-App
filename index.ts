import { registerRootComponent } from 'expo';
import App from './App';

// Add this to help with CORS issues in development
if (__DEV__) {
  console.log('Running in development mode');
  // This is just to log that we're in development mode
  // The actual CORS handling is done by the Expo server
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);