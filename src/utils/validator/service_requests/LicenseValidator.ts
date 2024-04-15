import { LicenseForm, PhotoField } from "@/components/services/FormModels";

export const isValidForm = (
    license: LicenseForm | null,
    userConfirmation: PhotoField,
): boolean => {
    return (
        license !== null &&
        !license.number.message &&
        !license.expirationDate.message &&
        !license.behindPhoto.message &&
        !license.frontPhoto.message &&
        !userConfirmation.message
    );
};

export const verifyNoEmptyData = (
    license: LicenseForm,
    userConfirmation: PhotoField,
): boolean => {
    return (
        license.number.value.trim().length > 0 &&
        license.expirationDate.value !== null &&
        license.behindPhoto.value !== null &&
        license.frontPhoto.value !== null &&
        userConfirmation.value !== null
    );
};
