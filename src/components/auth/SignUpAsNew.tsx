"use client";

import { auth } from "@/firebase/FirebaseConfig";
import { servicesData } from "@/interfaces/ServicesDataInterface";
import { saveUser } from "@/utils/requests/UserRequester";
import { InputValidator } from "@/utils/validator/InputValidator";
import {
    isPhoneValid,
    isValidEmail,
    isValidName,
    isValidPassword,
} from "@/utils/validator/auth/CredentialsValidator";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { locationList, Locations } from "@/interfaces/Locations";
import PhoneForm from "../form/PhoneForm";
import { defaultServiceReq, UserInterface } from "@/interfaces/UserInterface";
import { Services } from "@/interfaces/Services";

const SignUpAsNew = () => {
    const router = useRouter();
    const [formState, setFormState] = useState({
        loading: false,
        errorMessage: "",
    });
    const [credentials, setCredentials] = useState({
        fullName: {
            value: "",
            errorMessage: "",
        },
        phone: {
            value: "",
            errorMessage: "",
        },
        email: {
            value: "",
            errorMessage: "",
        },
        password: {
            value: "",
            errorMessage: "",
        },
        location: Locations.CochabambaBolivia,
    });

    const signUp = async (e: FormEvent) => {
        setFormState({
            ...formState,
            loading: true,
        });
        e.preventDefault();
        var wasSuccess = false;

        createUserWithEmailAndPassword(
            auth,
            credentials.email.value,
            credentials.password.value,
        )
            .then((res) => {
                wasSuccess = true;

                const emptyUserData: UserInterface = {
                    id: res.user.uid,
                    fullName: credentials.fullName.value,
                    phoneNumber: credentials.phone.value,
                    photoUrl: "",

                    comments: [],
                    vehicles: [],
                    services: [Services.Normal],

                    servicesData: servicesData,
                    pickUpLocationsHistory: [],
                    deliveryLocationsHistory: [],

                    location: credentials.location,
                    email: credentials.email.value,

                    serviceRequests: defaultServiceReq,
                };

                saveUser(res.user.uid, emptyUserData)
                    .then(() => {
                        setFormState({
                            ...formState,
                            loading: false,
                        });
                        toast("Registro exitoso");
                        router.push("/services/drive");
                    })
                    .catch(() => {
                        setFormState({
                            ...formState,
                            loading: false,
                        });
                    });
            })
            .catch((e) => {
                wasSuccess = false;
                console.log(e);
                setFormState({
                    ...formState,
                    loading: false,
                });
            });
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        validationFunction: InputValidator,
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

    const validatePhone = (phone: string) => {
        const { isValid, message } = isPhoneValid(phone);

        setCredentials({
            ...credentials,
            phone: {
                value: phone,
                errorMessage: isValid ? "" : message,
            },
        });
    };

    const getLocation = (input: string): Locations => {
        var location = Locations.CochabambaBolivia;
        locationList.forEach((value) => {
            if (value === input) {
                location = value;
            }
        });

        return location;
    };

    return (
        <form onSubmit={signUp} className="form-container">
            <fieldset className="form-section">
                <input
                    type="email"
                    name="email"
                    placeholder="Correo Electronico"
                    onChange={(e) => handleInputChange(e, isValidEmail)}
                    className="form-section-input"
                />
                {credentials.email.errorMessage.length > 0 && (
                    <small>{credentials.email.errorMessage}</small>
                )}
            </fieldset>
            <fieldset className="form-section">
                <input
                    type="text"
                    name="password"
                    placeholder="Contraseña"
                    onChange={(e) => handleInputChange(e, isValidPassword)}
                    className="form-section-input"
                />
                {credentials.password.errorMessage.length > 0 && (
                    <small>{credentials.password.errorMessage}</small>
                )}
            </fieldset>
            <fieldset className="form-section">
                <input
                    type="text"
                    name="fullName"
                    placeholder="Nombre Completo"
                    onChange={(e) => handleInputChange(e, isValidName)}
                    className="form-section-input"
                />
                {credentials.fullName.errorMessage.length > 0 && (
                    <small>{credentials.fullName.errorMessage}</small>
                )}
            </fieldset>
            <fieldset className="form-section">
                <PhoneForm
                    phone={credentials.phone.value}
                    validatePhone={validatePhone}
                />
                {credentials.phone.errorMessage.length > 0 && (
                    <small>{credentials.phone.errorMessage}</small>
                )}
            </fieldset>
            <fieldset className="form-section">
                <select
                    className="form-section-input"
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            location: getLocation(e.target.value),
                        });
                    }}
                    value={credentials.location}
                >
                    {locationList.map((location, i) => (
                        <option key={`location-option-${i}`} value={location}>
                            {location}
                        </option>
                    ))}
                </select>
            </fieldset>

            <button
                className="general-button | touchable margin-top-25 touchable"
                data-theme="dark"
                disabled={
                    credentials.fullName.errorMessage !== "" ||
                    credentials.phone.errorMessage !== "" ||
                    credentials.email.errorMessage !== "" ||
                    credentials.password.errorMessage !== ""
                }
            >
                {formState.loading && <i className="loader"></i>}
                <span>Registrarse</span>
            </button>
        </form>
    );
};

export default SignUpAsNew;
