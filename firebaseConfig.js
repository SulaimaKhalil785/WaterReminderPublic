// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform, LogBox } from "react-native";
import Constants from "expo-constants";

const firebaseExtra = Constants.expoConfig?.extra?.firebase || {};

const getEnv = (key) => {
  // Safe environment variable access for both Web and Mobile
  try {
    const env = (typeof window !== 'undefined' ? window : global)?.process?.env;
    if (env && env[key]) {
      return env[key];
    }
  } catch (e) {
    // Ignore
  }
  return '';
};

const firebaseConfig = {
  apiKey: firebaseExtra.apiKey || getEnv('FIREBASE_API_KEY'),
  authDomain: firebaseExtra.authDomain || getEnv('FIREBASE_AUTH_DOMAIN'),
  projectId: firebaseExtra.projectId || getEnv('FIREBASE_PROJECT_ID'),
  storageBucket: firebaseExtra.storageBucket || getEnv('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: firebaseExtra.messagingSenderId || getEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: Platform.select({
    android: firebaseExtra.androidAppId || getEnv('FIREBASE_ANDROID_APP_ID'),
    default: firebaseExtra.webAppId || getEnv('FIREBASE_WEB_APP_ID')
  }),
  measurementId: firebaseExtra.measurementId || getEnv('FIREBASE_MEASUREMENT_ID')
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics safely (Web only for JS SDK, or handled via Expo)
let analyticsInstance = null;
try {
  if (Platform.OS === 'web') {
    analyticsInstance = getAnalytics(app);
  }
} catch (e) {
  console.warn("Firebase Analytics initialization failed:", e);
}

export const analytics = analyticsInstance;
export const auth = getAuth(app);
export const firestore = getFirestore(app);