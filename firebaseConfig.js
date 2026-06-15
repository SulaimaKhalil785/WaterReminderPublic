import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};

const getSafeEnv = (key) => {
  try {
    return typeof process !== "undefined" && process.env ? process.env[key] : undefined;
  } catch (error) {
    return undefined;
  }
};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey || getSafeEnv("EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: extra.firebaseAuthDomain || getSafeEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: extra.firebaseProjectId || getSafeEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: extra.firebaseStorageBucket || getSafeEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: extra.firebaseMessagingSenderId || getSafeEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: Platform.OS === "web"
    ? (extra.firebaseAppIdWeb || getSafeEnv("EXPO_PUBLIC_FIREBASE_WEB_APP_ID"))
    : (extra.firebaseAppIdAndroid || getSafeEnv("EXPO_PUBLIC_FIREBASE_APP_ID")),
  measurementId: extra.firebaseMeasurementId || getSafeEnv("EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID"),
};

let app;

try {
  if (getApps().length === 0) {
    if (!firebaseConfig.apiKey) {
      console.error("Firebase configuration is missing. Check app.json extra values.");
    }
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

const createFirestore = () => {
  if (!app) {
    return null;
  }

  if (Platform.OS === "web") {
    return getFirestore(app);
  }

  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
      useFetchStreams: false,
    });
  } catch (error) {
    return getFirestore(app);
  }
};

export const auth = app ? getAuth(app) : null;
export const firestore = createFirestore();
export const db = firestore;

export default app;
