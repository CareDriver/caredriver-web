"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase/FirebaseConfig";

export async function acceptTerms(uid: string) {
  if (!uid) {
    return { success: false, error: "UID no válido" };
  }

  try {
    await addDoc(collection(firestore, "termsAcceptances"), {
      uid,
      acceptedAt: serverTimestamp(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
