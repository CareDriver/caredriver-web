import { Locations } from "@/interfaces/Locations";

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

export const defaultSignUpValues = {
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
