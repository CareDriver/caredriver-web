import { auth } from "@/firebase/FirebaseConfig";

export const registerWithCredentials = (email: String, password: String) => {
    
};


/* 

import { getAuth, signInWithEmailAndPassword, unlink } from "firebase/auth";

async function removeEmailAndPasswordAuth(email: string, password: string) {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (user) {
    await unlink(user, 'password');
    console.log('El método de autenticación por correo electrónico y contraseña se ha eliminado correctamente.');
  } else {
    console.log('No se pudo autenticar al usuario.');
  }
}

// Uso de la función
removeEmailAndPasswordAuth('usuario@example.com', 'password123');

*/