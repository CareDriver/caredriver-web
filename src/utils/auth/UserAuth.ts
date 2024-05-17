import { SignUpInterface } from "@/components/auth/AuthInterfaces";
import { Services } from "@/interfaces/Services";
import { defaultServiceReq, UserInterface, UserRole } from "@/interfaces/UserInterface";
import { servicesData } from "@/interfaces/ServicesDataInterface";
import { emptyPhotoWithRef } from "@/interfaces/ImageInterface";
import { InputValidator } from "../validator/InputValidator";
import { Dispatch, SetStateAction } from "react";
import { locationList, Locations } from "@/interfaces/Locations";
import { isPhoneValid } from "../validator/auth/CredentialsValidator";

export const createUserData = (
    id: string,
    role: UserRole,
    credentials: SignUpInterface,
): UserInterface => {
    return {
        id: id,
        role: role,
        fullName: credentials.fullName.value,
        phoneNumber: credentials.phone.value,
        photoUrl: emptyPhotoWithRef,

        comments: [],
        vehicles: [],
        services: [Services.Normal],

        servicesData: servicesData,
        pickUpLocationsHistory: [],
        deliveryLocationsHistory: [],

        location: credentials.location,
        email: credentials.email.value.toLowerCase(),

        serviceRequests: defaultServiceReq,

        disable: false,
        deleted: false,
    };
};

export const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    validationFunction: InputValidator,
    credentials: SignUpInterface,
    setCredentials: Dispatch<SetStateAction<SignUpInterface>>,
) => {
    const value = e.target.value;
    const { isValid, message } = validationFunction(value);

    setCredentials({
        ...credentials,
        [e.target.name]: {
            value: value,
            errorMessage: isValid ? "" : message,
        },
    });
};

export const validatePhone = (
    phone: string,
    credentials: SignUpInterface,
    setCredentials: Dispatch<SetStateAction<SignUpInterface>>,
) => {
    const { isValid, message } = isPhoneValid(phone);

    setCredentials({
        ...credentials,
        phone: {
            ...credentials.phone,
            value: phone,
            errorMessage: isValid ? "" : message,
        },
    });
};

export const getLocation = (input: string): Locations => {
    var location = Locations.CochabambaBolivia;
    locationList.forEach((value) => {
        if (value === input) {
            location = value;
        }
    });

    return location;
};
