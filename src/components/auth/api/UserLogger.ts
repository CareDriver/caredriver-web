import { auth } from "@/firebase/FirebaseConfig";
import { acceptTerms } from "@/utils/requesters/AcceptTerms";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const registerWithCredentials = async (
  email: string,
  password: string,
) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredentials) => {
      const user = userCredentials.user;
      await acceptTerms(user.uid ?? "");
    })
    .catch((error) => {});
};
