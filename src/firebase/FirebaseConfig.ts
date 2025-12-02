import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

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
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export const initializeRealtimeDatabase = (databaseURL: string) => {
  const configWithDatabaseURL = { ...firebaseConfig, databaseURL };
  const app = initializeApp(configWithDatabaseURL, `realtime-${databaseURL}`);
  return getDatabase(app);
};

// Pass your reCAPTCHA v3 site key (public key) to activate()
/* const appCheckClientKey = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_CLIENT_KEY;
if (appCheckClientKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(appCheckClientKey),
    isTokenAutoRefreshEnabled: true,
  });
}
 */


// ⚠️ Solo inicializar App Check en el navegador
export function initAppCheck() {
  if (typeof window !== "undefined") {
    if (!(window as any)._appCheckInitialized) {
      initializeAppCheck(app, {
        provider: new (window as any).RecaptchaV3Provider("tu-site-key"),
        isTokenAutoRefreshEnabled: true,
      });
      (window as any)._appCheckInitialized = true; // evita inicializar dos veces
    }
  }
}

export { app, auth, firestore, storage };
