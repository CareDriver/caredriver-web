import { auth } from "@/firebase/FirebaseConfig";
import { RecaptchaVerifier } from "firebase/auth";

export const register = (phone: String) => {
    auth.languageCode = "it";
};
