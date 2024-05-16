import { SignUpInterface } from "@/components/auth/AuthInterfaces";
import { Services } from "@/interfaces/Services";
import { defaultServiceReq, UserInterface, UserRole } from "@/interfaces/UserInterface";
import { servicesData } from "@/interfaces/ServicesDataInterface";
import { emptyPhotoWithRef } from "@/interfaces/ImageInterface";

export const createUserData = (
    id: string,
    role: UserRole,
    credentials: SignUpInterface,
): UserInterface => {
    return {
        id: id,
        role: role,
        fullName: credentials.fullName.value,
        phoneNumber: credentials.phone.value,
        photoUrl: emptyPhotoWithRef,

        comments: [],
        vehicles: [],
        services: [Services.Normal],

        servicesData: servicesData,
        pickUpLocationsHistory: [],
        deliveryLocationsHistory: [],

        location: credentials.location,
        email: credentials.email.value.toLowerCase(),

        serviceRequests: defaultServiceReq,

        disable: false,
        deleted: false,
    };
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
