import { isValidEmail, isValidName } from "./CredentialsValidator";
import { isNumber } from "@/validators/TextValidator";

export const validateSearchInput = (searchInput: string): boolean => {
    let nameValidation = isValidName(searchInput);
    if (nameValidation.isValid) {
        return true;
    } else {
        let phoneValidation =
            isNumber(searchInput) &&
            (searchInput.length === 8 || searchInput.length === 11);
        if (phoneValidation) {
            return true;
        } else {
            let emailValidation = isValidEmail(searchInput);
            return emailValidation.isValid;
        }
    }
};
