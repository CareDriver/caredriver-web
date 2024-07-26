import {
    FieldStringForm,
    IdCardForm,
    PersonalDataFormField,
    PhotoField,
} from "@/components/services/FormModels";
import { InputState } from "../InputValidator";

export const isValidMechanicTools = (tools: string): InputState => {
    const nameRegex: RegExp = /^\S[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s,.-]+$/;

    if (tools.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar tus herramientas de trabajo",
        };
    } else if (!nameRegex.test(tools)) {
        return {
            isValid: false,
            message: "No puedes ingresar caracteres especiales que no sean ,.-",
        };
    } else if (tools.length > 500) {
        return {
            isValid: false,
            message:
                "No puedes ingresar mas de 500 caracteres para describir tus herramientas de trabajo",
        };
    } else {
        return {
            isValid: true,
            message: "Herramientas validas",
        };
    }
};

export const isValidForm = (
    personalData: PersonalDataFormField,
    userConfirmation: PhotoField,
    acceptedTerms: boolean,
    idCardForm: IdCardForm,
    tools: FieldStringForm,
): boolean => {
    var isValid = !personalData.fullname.message && !personalData.photo.message;

    if (isValid) {
        isValid =
            !idCardForm.backCard.message &&
            !idCardForm.frontCard.message &&
            !idCardForm.location.message;
    }

    if (isValid) {
        isValid = !tools.message;
    }

    if (isValid) {
        isValid = !userConfirmation.message && acceptedTerms;
    }

    return isValid;
};

export const verifyNoEmptyData = (
    personalData: PersonalDataFormField,
    userConfirmation: PhotoField,
    acceptedTerms: boolean,
    idCardForm: IdCardForm,
    tools: FieldStringForm,
): boolean => {
    var isNotEmpty =
        personalData.fullname.value.trim().length > 0 &&
        personalData.photo.value !== null;

    if (isNotEmpty) {
        isNotEmpty =
            idCardForm.backCard.value !== null &&
            idCardForm.frontCard.value !== null &&
            idCardForm.location.value.trim().length > 0;
    }

    if (isNotEmpty) {
        isNotEmpty = tools.value.trim().length > 0;
    }

    if (isNotEmpty) {
        isNotEmpty = userConfirmation.value !== null && acceptedTerms;
    }

    return isNotEmpty;
};
