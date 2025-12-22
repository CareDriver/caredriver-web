"use client";

import { app, initAppCheck } from "@/firebase/FirebaseConfig";
import { getToken } from "firebase/app-check";

export async function acceptTerms(uid: string) {
  try {
    const appCheck = initAppCheck();
    if (!appCheck) return;
    const { token } = await getToken(appCheck, true);

    console.log("UID antes de fetch:", uid);
    console.log("JSON enviado:", JSON.stringify({ uid }));

    const response = await fetch(
      "https://us-central1-caredriver-3ecad.cloudfunctions.net/logTermsAcceptance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Firebase-AppCheck": token,
        },
        body: JSON.stringify({
          uid: uid,
        }),
      },
    );

    console.log(response);

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Error desconocido");
    return { success: true };
  } catch (error) {
    console.log("Error accepting terms:", error);
    return { success: false, error: (error as Error).message };
  }
}
