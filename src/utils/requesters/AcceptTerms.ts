"use client";

import { initAppCheck } from "@/firebase/FirebaseConfig";
import { getToken } from "firebase/app-check";

export async function acceptTerms(uid: string) {
  try {
    initAppCheck();

    const appCheck = (window as any).firebaseAppCheck;
    const { token } = await getToken(appCheck, true);

    const response = await fetch(
      "https://logtermsacceptance-27j5hqiv7a-uc.a.run.app",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Firebase-AppCheck": token,
        },
        body: JSON.stringify({ uid }),
      },
    );

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Error desconocido");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
