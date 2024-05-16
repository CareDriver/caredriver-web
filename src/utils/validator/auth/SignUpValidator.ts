import { SignUpInterface } from "@/components/auth/AuthInterfaces";

export const isNotEmpty = (credentials: SignUpInterface): boolean => {
    return (
        credentials.email.value.trim().length > 0 &&
        credentials.password.value.trim().length > 0 &&
        credentials.phone.value.trim().length > 0 &&
        credentials.fullName.value.trim().length > 0
    );
};

export const thereAreNotErrorsSignUp = (credentials: SignUpInterface): boolean => {
    return (
        !credentials.fullName.errorMessage &&
        !credentials.phone.errorMessage &&
        !credentials.email.errorMessage &&
        !credentials.password.errorMessage
    );
};
