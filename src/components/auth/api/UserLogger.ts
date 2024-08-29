import { auth } from "@/firebase/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const registerWithCredentials = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password).then((userCredentials) => {
        const user = userCredentials.user;
    })
    .catch((error) => {
        
    })

};
