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

export const EMPTY_USER_DATA: UserInterface = {
    id: genDocId(),
    fakeId: genFakeId(),
    role: UserRole.User,
    fullName: "",
    phoneNumber: "",
    photoUrl: EMPTY_REF_ATTACHMENT,

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
                const fakeId = nanoid(30);
                const user = result.user;
                await registerUserFromGoogleAuth(user, fakeId, setVerifier);
            }
        } catch (error) {
            console.log(error);
        }
    }
};

export const registerUserFromGoogleAuth = async (
    user: User,
    fakeId: string,
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
            fakeId: fakeId,
            fullName: user.displayName
                ? user.displayName.toLocaleLowerCase()
                : "",
            photoUrl: {
                url: user.photoURL ? user.photoURL : "",
                ref: "",
            },
            email: user.email ? user.email.toLowerCase().trim() : "",
        };

        try {
            await toast.promise(saveUser(user.uid, newUser), {
                pending: "Creando nueva cuenta",
                success: "Cuenta creada",
                error: "Error al crear la cuenta, inténtalo de nuevo por favor",
            });
            window.location.replace("/redirector");
            setVerifier(false);
        } catch (e) {
            console.log(e);
            setVerifier(false);
        }
    } else {
        setVerifier(false);
        window.location.replace("/redirector");
    }
};
