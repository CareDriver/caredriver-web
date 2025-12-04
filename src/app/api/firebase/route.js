import admin from "firebase-admin";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;

export const runtime = 'edge';

const formatPrivateKey = (key) => {
  return key.replace(/\\n/g, "\n");
};

const createFirebaseAdminApp = (params) => {
  const privateKey = formatPrivateKey(params.privateKey);
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  });

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
};

const initAdmin = async () => {
  const params = {
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    privateKey: FIREBASE_PRIVATE_KEY,
  };

  return createFirebaseAdminApp(params);
};

export async function POST(request) {
  try {
    await initAdmin();
    const { email, password } = await request.json();
    const userId = nanoid(30);
    await admin.auth().createUser({
      uid: userId,
      email,
      emailVerified: false,
      password: password,
    });

    return NextResponse.json({ userId });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "error, inténtalo de nuevo por favor" });
  }
}
