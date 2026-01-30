import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace the following with your app's Firebase project configuration
 const firebaseConfig = {
    apiKey: "AIzaSyA-4T1-DBr85gmcFhDInUBar8hfqgBsJNA",
    authDomain: "fit-fob.firebaseapp.com",
    projectId: "fit-fob",
    storageBucket: "fit-fob.firebasestorage.app",
    messagingSenderId: "1026944446347",
    appId: "1:1026944446347:web:2645554ea8aec06b65898e",
    measurementId: "G-KXXVJ2MWCC"
  };

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
