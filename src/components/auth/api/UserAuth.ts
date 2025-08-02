import { Services } from "@/interfaces/Services";
import {
  defaultServiceReq,
  UserInterface,
  UserRole,
} from "@/interfaces/UserInterface";
import { servicesData } from "@/interfaces/ServicesDataInterface";
import { EMPTY_REF_ATTACHMENT } from "@/components/form/models/RefAttachment";
import { Locations } from "@/interfaces/Locations";
import { defaultBalance, defaultMinBalance } from "@/interfaces/Payment";
import { toast } from "react-toastify";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth } from "@/firebase/FirebaseConfig";
import { nanoid } from "nanoid";
import { genDocId, genFakeId } from "@/utils/generators/IdGenerator";
import {
  getUserById,
  saveUser,
} from "@/components/app_modules/users/api/UserRequester";
import { Timestamp } from "firebase/firestore";
import { routeToRedirector } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";

export const EMPTY_USER_DATA: UserInterface = {
  id: genDocId(),
  fakeId: genFakeId(),
  role: UserRole.User,
  fullName: "",
  phoneNumber: {
    countryCode: "+591",
    number: "",
  },
  lastPhoneVerification: Timestamp.now(),
  photoUrl: EMPTY_REF_ATTACHMENT,
  createdAt: Timestamp.now(),

  vehicles: [],
  services: [Services.Normal],

  servicesData: servicesData,
  pickUpLocationsHistory: [],
  deliveryLocationsHistory: [],

  location: Locations.CochabambaBolivia,
  email: "",

  serviceRequests: defaultServiceReq,

  disable: false,
  deleted: false,

  balance: defaultBalance,
  minimumBalance: defaultMinBalance,
  homeAddress: "",
  addressPhoto: EMPTY_REF_ATTACHMENT,
};

export const signUpWithGoogle = async (
  verifiyingGoogle: boolean,
  setVerifier: (verifiyingGoogle: boolean) => void,
) => {
  if (!verifiyingGoogle) {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // const resAuth = await signInWithRedirect(auth, provider);
      // const result: UserCredential = resAuth;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        // const token = credential.accessToken;
        const user = result.user;
        await registerUserFromGoogleAuth(user, setVerifier);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export const registerUserFromGoogleAuth = async (
  user: User,
  setVerifier: (verifiyingGoogle: boolean) => void,
) => {
  setVerifier(true);
  const userFound = await toast.promise(getUserById(user.uid), {
    pending: "Verificando datos, espera por favor",
    success: "Datos validos",
    error: "Error al verificar tus datos, inténtalo de nuevo por favor",
  });
  if (!userFound) {
    let newUser: UserInterface = {
      ...EMPTY_USER_DATA,
      id: user.uid,
      fullName: user.displayName ? user.displayName.toLocaleLowerCase() : "",
      photoUrl: {
        url: user.photoURL ?? "",
        ref: "",
      },
      email: user.email ? user.email.toLocaleLowerCase().trim() : "",
    };

    try {
      await toast.promise(saveUser(user.uid, newUser), {
        pending: "Creando nueva cuenta",
        success: "Cuenta creada",
        error: "Error al crear la cuenta, inténtalo de nuevo por favor",
      });
      window.location.replace(routeToRedirector());
    } catch (e) {
      console.log(e);
      setVerifier(false);
    }
  } else {
    window.location.replace(routeToRedirector());
  }
};
