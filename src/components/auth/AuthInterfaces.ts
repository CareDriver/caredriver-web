import { Locations } from "@/interfaces/Locations";
import { UserRole } from "@/interfaces/UserInterface";
import { PhotoField } from "../services/FormModels";

export interface SignUpInterface {
    fullName: {
        value: string;
        errorMessage: null | string;
    };
    phone: {
        value: string;
        errorMessage: null | string;
    };
    email: {
        value: string;
        errorMessage: null | string;
    };
    password: {
        value: string;
        errorMessage: null | string;
    };
    code: {
        sent: string;
        toVerify: string;
        errorMessage: null | string;
    };
    location: Locations;
}

export interface SignUpInterfaceV2 extends SignUpInterface {
    role: UserRole;
    photo: PhotoField;
}

export const defaultSignUpValues: SignUpInterface = {
    fullName: {
        value: "",
        errorMessage: null,
    },
    phone: {
        value: "",
        errorMessage: null,
    },
    email: {
        value: "",
        errorMessage: null,
    },
    password: {
        value: "",
        errorMessage: null,
    },
    code: {
        sent: "",
        toVerify: "",
        errorMessage: null,
    },
    location: Locations.CochabambaBolivia,
};

export const defaultSignUpV2Values: SignUpInterfaceV2 = {
    ...defaultSignUpValues,
    role: UserRole.Support,
    photo: {
        value: null,
        message: null,
    },
};
