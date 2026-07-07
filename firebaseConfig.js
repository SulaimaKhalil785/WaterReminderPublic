import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Prioritize config from expo-constants (EAS) then process.env
const extra = Constants.expoConfig?.extra?.firebase || {};

const firebaseConfig = {
  // Use Android-specific API Key for Android, and Web API Key for everything else (Web/iOS)
  apiKey: Platform.OS === 'android'
    ? (extra.androidApiKey || process.env.FIREBASE_ANDROID_API_KEY)
    : (extra.webApiKey || process.env.FIREBASE_WEB_API_KEY),

  authDomain: extra.authDomain || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: extra.projectId || process.env.FIREBASE_PROJECT_ID,
  storageBucket: extra.storageBucket || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: extra.messagingSenderId || process.env.FIREBASE_MESSAGING_SENDER_ID,

  appId: Platform.OS === 'android'
    ? (extra.androidAppId || process.env.FIREBASE_ANDROID_APP_ID)
    : (extra.webAppId || process.env.FIREBASE_WEB_APP_ID),

  measurementId: extra.measurementId || process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
