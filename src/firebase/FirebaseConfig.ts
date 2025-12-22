"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
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

// ✅ Evitar inicializar Firebase más de una vez (Next.js safe)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let appCheckInstance: AppCheck | null = null;

export const initAppCheck = (): AppCheck | null => {
  if (typeof window === "undefined") return null;
  if (appCheckInstance) return appCheckInstance;

  const appCheckKey = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_CLIENT_KEY;

  if (!appCheckKey) {
    console.warn("App Check key missing – App Check disabled");
    return null;
  }

  try {
    // 🔧 Debug token SOLO en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.log("App Check running in DEBUG mode");
      (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckKey),
      isTokenAutoRefreshEnabled: true,
    });

    console.log("App Check initialized");
    return appCheckInstance;
  } catch (error: any) {
    console.error("Failed to initialize App Check:", error?.message || error);
    return null;
  }
};

// Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Realtime Database (multi-instance safe)
export const initializeRealtimeDatabase = (databaseURL: string) => {
  const configWithDatabaseURL = { ...firebaseConfig, databaseURL };
  const rtApp = initializeApp(configWithDatabaseURL, `realtime-${databaseURL}`);
  return getDatabase(rtApp);
};

export { app };
