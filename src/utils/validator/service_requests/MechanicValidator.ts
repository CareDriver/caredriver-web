import {
    IdCardForm,
    PersonalDataFormField,
    PhotoField,
} from "@/components/services/FormModels";

export const isValidForm = (
    personalData: PersonalDataFormField,
    userConfirmation: PhotoField,
    acceptedTerms: boolean,
    idCardForm: IdCardForm,
): boolean => {
    var isValid = !personalData.fullname.message && !personalData.photo.message;

    if (isValid) {
        isValid =
            !idCardForm.backCard.message &&
            !idCardForm.frontCard.message &&
            !idCardForm.location.message;
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
        isNotEmpty = userConfirmation.value !== null && acceptedTerms;
    }

    return isNotEmpty;
};
