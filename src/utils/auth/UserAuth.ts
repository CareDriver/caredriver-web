import { SignUpInterface, SignUpInterfaceV2 } from "@/components/auth/AuthInterfaces";
import { Services } from "@/interfaces/Services";
import { defaultServiceReq, UserInterface, UserRole } from "@/interfaces/UserInterface";
import { servicesData } from "@/interfaces/ServicesDataInterface";
import { emptyPhotoWithRef, ImgWithRef } from "@/interfaces/ImageInterface";
import { InputValidator } from "../validator/InputValidator";
import { Dispatch, SetStateAction } from "react";
import { locationList, Locations } from "@/interfaces/Locations";
import { isPhoneValid } from "../validator/auth/CredentialsValidator";
import { defaultBalance, defaultMinBalance } from "@/interfaces/Payment";
import { getUserById, saveUser } from "../requests/UserRequester";
import { toast } from "react-toastify";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    User,
    UserCredential,
} from "firebase/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { auth } from "@/firebase/FirebaseConfig";

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
        email: credentials.email.value.toLowerCase().trim(),

        serviceRequests: defaultServiceReq,

        disable: false,
        deleted: false,

        balance: defaultBalance,
        minimumBalance: defaultMinBalance,
    };
};

export const createUserDataWithPhoto = (
    id: string,
    role: UserRole,
    credentials: SignUpInterface,
    photo: ImgWithRef | null,
): UserInterface => {
    var newUser = {
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

        balance: defaultBalance,
        minimumBalance: defaultMinBalance,
    };
    if (photo) {
        newUser = {
            ...newUser,
            photoUrl: photo,
        };
    }

    return newUser;
};

export const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    validationFunction: InputValidator,
    credentials: SignUpInterface,
    setCredentials: Dispatch<SetStateAction<SignUpInterface>>,
) => {
    const value = e.target.value;
    const { isValid, message } = validationFunction(value);

    setCredentials({
        ...credentials,
        [e.target.name]: {
            value: value,
            errorMessage: isValid ? "" : message,
        },
    });
};

export const handleInputChangeV2 = (
    e: React.ChangeEvent<HTMLInputElement>,
    validationFunction: InputValidator,
    credentials: SignUpInterfaceV2,
    setCredentials: Dispatch<SetStateAction<SignUpInterfaceV2>>,
) => {
    const value = e.target.value;
    const { isValid, message } = validationFunction(value);

    setCredentials({
        ...credentials,
        [e.target.name]: {
            value: value,
            errorMessage: isValid ? "" : message,
        },
    });
};

export const validatePhone = (
    phone: string,
    credentials: SignUpInterface,
    setCredentials: Dispatch<SetStateAction<SignUpInterface>>,
) => {
    const { isValid, message } = isPhoneValid(phone);

    setCredentials({
        ...credentials,
        phone: {
            ...credentials.phone,
            value: phone,
            errorMessage: isValid ? "" : message,
        },
    });
};

export const validatePhoneV2 = (
    phone: string,
    credentials: SignUpInterfaceV2,
    setCredentials: Dispatch<SetStateAction<SignUpInterfaceV2>>,
) => {
    const { isValid, message } = isPhoneValid(phone);

    setCredentials({
        ...credentials,
        phone: {
            ...credentials.phone,
            value: phone,
            errorMessage: isValid ? "" : message,
        },
    });
};

export const getLocation = (input: string): Locations => {
    var location = Locations.CochabambaBolivia;
    locationList.forEach((value) => {
        if (value === input) {
            location = value;
        }
    });

    return location;
};

export const getRole = (input: string, roles: UserRole[]): UserRole => {
    var roleFound = roles[0];
    roles.forEach((value) => {
        if (value === input) {
            roleFound = value;
        }
    });

    return roleFound;
};

export const signUpWithGoogle = async (
    router: AppRouterInstance,
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
                await registerUserFromGoogleAuth(user, setVerifier, router);
            }
        } catch (error) {
            console.log(error);
        }
    }
};

export const registerUserFromGoogleAuth = async (
    user: User,
    setVerifier: (verifiyingGoogle: boolean) => void,
    router: AppRouterInstance,
) => {
    setVerifier(true);
    const userFound = await toast.promise(getUserById(user.uid), {
        pending: "Verificando datos, espera por favor",
        success: "Datos validos",
        error: "Error al verificar tus datos, intentalo de nuevo por favor",
    });
    if (!userFound) {
        var emptyUserData: UserInterface = createUserData(user.uid, UserRole.User, {
            email: {
                value: user.email ? user.email : "",
                errorMessage: null,
            },
            fullName: {
                value: user.displayName ? user.displayName : "",
                errorMessage: null,
            },
            location: Locations.CochabambaBolivia,
            password: {
                value: "",
                errorMessage: null,
            },
            phone: {
                value: "",
                errorMessage: null,
            },
            code: {
                sent: "string",
                toVerify: "string",
                errorMessage: null,
            },
        });
        emptyUserData = {
            ...emptyUserData,
            photoUrl: {
                url: user.photoURL ? user.photoURL : "",
                ref: "",
            },
        };
        try {
            await toast.promise(saveUser(user.uid, emptyUserData), {
                pending: "Creando nueva cuenta",
                success: "Cuenta creada",
                error: "Error al crear la cuenta, intentalo de nuevo por favor",
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
