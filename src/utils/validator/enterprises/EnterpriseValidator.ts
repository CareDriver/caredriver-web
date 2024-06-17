import { PhotoField } from "@/components/services/FormModels";
import { InputState } from "../InputValidator";
import { Location } from "@/utils/map/Locator";

export const isValidWorkshopName = (name: string): InputState => {
    const nameRegex: RegExp = /^[a-zA-Z\d\s]+$/;

    if (name.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar el nombre del taller",
        };
    } else if (!nameRegex.test(name)) {
        return {
            isValid: false,
            message: "El nombre solo puede contener letras del alfabeto y números",
        };
    } else if (name.length > 150) {
        return {
            isValid: false,
            message: "No puedes ingresar mas de 150 caracteres para el nombre del taller",
        };
    } else {
        return {
            isValid: true,
            message: "Nombre valido",
        };
    }
};

export const isValidCraneName = (name: string): InputState => {
    const nameRegex: RegExp = /^[a-zA-Z\d\s]+$/;

    if (name.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar el nombre de la Empresa",
        };
    } else if (!nameRegex.test(name)) {
        return {
            isValid: false,
            message: "El nombre solo puede contener letras del alfabeto y números",
        };
    } else if (name.length > 150) {
        return {
            isValid: false,
            message:
                "No puedes ingresar mas de 150 caracteres para el nombre de la Empresa",
        };
    } else {
        return {
            isValid: true,
            message: "Nombre valido",
        };
    }
};

export const isValidForm = (formData: {
    name: {
        value: string;
        message: string | null;
    };
    phone: {
        value: string;
        message: string | null;
    };
    logo: PhotoField;
    coordinates: {
        value: Location | null;
        message: string | null;
    };
}): boolean => {
    return (
        !formData.name.message &&
        !formData.phone.message &&
        !formData.logo.message &&
        !formData.coordinates.message
    );
};

export const verifyNoEmptyData = (formData: {
    name: {
        value: string;
        message: string | null;
    };
    phone: {
        value: string;
        message: string | null;
    };
    logo: PhotoField;
    coordinates: {
        value: Location | null;
        message: string | null;
    };
}): boolean => {
    return (
        formData.name.value !== null &&
        formData.logo.value !== null &&
        formData.phone.value !== null &&
        formData.coordinates.value !== null
    );
};
