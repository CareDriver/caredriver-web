import {
    EnterpriseField,
    PersonalDataFormField,
    PhotoField,
    VehicleForm,
} from "@/components/services/FormModels";

export const isValidForm = (
    personalData: PersonalDataFormField,
    vehicle: VehicleForm,
    userConfirmation: PhotoField,
    acceptedTerms: boolean,
    towEnteprise: EnterpriseField,
): boolean => {
    var isValid =
        !personalData.fullname.message &&
        !personalData.photo.message &&
        !towEnteprise.message;

    isValid =
        !vehicle.license.number.message &&
        !vehicle.license.expirationDate.message &&
        !vehicle.license.behindPhoto.message &&
        !vehicle.license.frontPhoto.message;
    if (isValid) {
        isValid = !userConfirmation.message && acceptedTerms;
    }

    return isValid;
};

export const verifyNoEmptyData = (
    personalData: PersonalDataFormField,
    vehicle: VehicleForm,
    userConfirmation: PhotoField,
    acceptedTerms: boolean,
    towEnteprise: EnterpriseField,
): boolean => {
    var isNotEmpty =
        personalData.fullname.value.trim().length > 0 &&
        personalData.photo.value !== null &&
        towEnteprise.value !== null;

    isNotEmpty =
        vehicle.license.number.value.trim().length > 0 &&
        vehicle.license.expirationDate.value !== null &&
        vehicle.license.behindPhoto.value !== null &&
        vehicle.license.frontPhoto.value !== null;

    if (isNotEmpty) {
        isNotEmpty = userConfirmation.value !== null && acceptedTerms;
    }

    return isNotEmpty;
};
