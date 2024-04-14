import { PersonalDataFormField, PhotoField } from "@/components/services/FormModels";

export const isValidForm = (
    personalData: PersonalDataFormField,
    userConfirmation: PhotoField,
    acceptedTerms: boolean,
): boolean => {
    var isValid = !personalData.fullname.message && !personalData.photo.message;

    if (isValid) {
        isValid = !userConfirmation.message && acceptedTerms;
    }

    return isValid;
};

export const verifyNoEmptyData = (
    personalData: PersonalDataFormField,
    userConfirmation: PhotoField,
    acceptedTerms: boolean,
): boolean => {
    var isNotEmpty =
        personalData.fullname.value.trim().length > 0 &&
        personalData.photo.value !== null;

    if (isNotEmpty) {
        isNotEmpty = userConfirmation.value !== null && acceptedTerms;
    }

    return isNotEmpty;
};
