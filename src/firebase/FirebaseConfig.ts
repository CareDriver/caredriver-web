import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  AppCheck,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

const app = initializeApp(firebaseConfig);

let appCheckInstance: AppCheck | null = null;

function initAppCheck() {
  if (typeof window === "undefined") return null;

  try {
    if (!appCheckInstance) {
      const appCheckKey = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_CLIENT_KEY;

      if (!appCheckKey) {
        console.warn("App Check key is missing - App Check disabled");
        return null;
      }

      // Habilitar debug token en desarrollo
      if (process.env.NODE_ENV === "development") {
        console.log("App Check: Using debug mode for development");
        // Esto generará un token de debug en la consola
        (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }

      console.log("Initializing App Check...");

      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(appCheckKey),
        isTokenAutoRefreshEnabled: true,
      });

      console.log("App Check initialized successfully");
    }
  } catch (error: any) {
    console.error("Error initializing App Check:", error?.message || error);
    // No bloquear la aplicación si falla App Check
    return null;
  }

  return appCheckInstance;
}

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage, initAppCheck };

export const initializeRealtimeDatabase = (databaseURL: string) => {
  const configWithDatabaseURL = { ...firebaseConfig, databaseURL };
  const rtApp = initializeApp(configWithDatabaseURL, `realtime-${databaseURL}`);
  return getDatabase(rtApp);
};
