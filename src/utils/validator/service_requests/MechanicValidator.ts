import {
    EnterpriseField,
    PersonalDataFormField,
    PhotoField,
} from "@/components/services/FormModels";

export const isValidForm = (
    personalData: PersonalDataFormField,
    enterpriseField: EnterpriseField,
    userConfirmation: PhotoField,
    acceptedTerms: boolean,
): boolean => {
    var isValid =
        !personalData.fullname.message &&
        !personalData.photo.message &&
        !enterpriseField.value;

    if (isValid) {
        isValid = !userConfirmation.message && acceptedTerms;
    }

    return isValid;
};

export const verifyNoEmptyData = (
    personalData: PersonalDataFormField,
    enterpriseField: EnterpriseField,
    userConfirmation: PhotoField,
    acceptedTerms: boolean,
): boolean => {
    var isNotEmpty =
        personalData.fullname.value.trim().length > 0 &&
        personalData.photo.value !== null &&
        enterpriseField.value !== null;

    if (isNotEmpty) {
        isNotEmpty = userConfirmation.value !== null && acceptedTerms;
    }

    return isNotEmpty;
};
