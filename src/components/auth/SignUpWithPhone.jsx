"use client";

import { auth } from "@/firebase/FirebaseConfig";
import {
    EmailAuthProvider,
    RecaptchaVerifier,
    linkWithCredential,
    signInWithPhoneNumber,
} from "firebase/auth";
import { useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from "react-toastify";
import { getUserById, saveUser } from "../../utils/requests/UserRequester";
import { servicesData } from "@/interfaces/ServicesDataInterface";

const SignUpWithPhone = () => {
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [credentials, setCredentials] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [linkState, setLinkState] = useState({
        loading: false,
        readyToLink: false,
        asNewUser: true,
    });
    const [authState, setAuthState] = useState({
        sendingData: false,
        readyForOTP: false,
        verifier: null,
    });

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: (response) => {},
                },
            );
        }
    };

    const onSignInSubmit = (e) => {
        e.preventDefault();
        setupRecaptcha();
        setAuthState({ ...authState, sendingData: true });

        const appVerifier = window.recaptchaVerifier;

        signInWithPhoneNumber(auth, phone, appVerifier)
            .then((confirmationResult) => {
                setAuthState({
                    readyForOTP: true,
                    sendingData: false,
                    verifier: confirmationResult,
                });
            })
            .catch((error) => {
                setAuthState({ ...authState, sendingData: false });
            });
    };

    const sendCode = (e) => {
        e.preventDefault();

        authState.verifier
            .confirm(code)
            .then(async (res) => {
                var user = res.user;
                toast("Numero verificado exitosamente");
                console.log(user);
            })
            .catch((error) => {
                toast("Codigo invalido, vuelva a intentarlo mas tarde");
            });
    };

    const linkAccount = async () => {
        const credential = EmailAuthProvider.credential(
            credentials.email,
            credentials.password,
        );

        const userSaved = await getUserById(auth.currentUser.uid);
        if (!userSaved) {
            const emptyUserData = {
                id: auth.currentUser.uid,
                fullName: credentials.fullName,
                phoneNumber: phone,
                photoUrl: "",

                comments: [],
                vehicles: [],
                services: [],

                servicesData: servicesData,
                pickUpLocationsHistory: [],
                deliveryLocationsHistory: [],

                email: credentials.email,
            };
            await saveUser(auth.currentUser.uid, emptyUserData);
        }

        linkWithCredential(auth.currentUser, credential)
            .then((usercred) => {
                const user = usercred.user;
                toast("Registro exitoso");
                console.log(user);
            })
            .catch((error) => {
                toast("Error al registrarse, vuelva a intentarlo mas tarde");
            });
    };

    return linkState.readyToLink ? (
        <form onSubmit={linkAccount}>
            <span>Elige un Correo y Contraseña</span>
            <fieldset>
                <input
                    type="email"
                    placeholder="Correo Electronico"
                    onChange={(e) =>
                        setCredentials({ ...credentials, email: e.target.value })
                    }
                />
            </fieldset>
            <fieldset>
                <input
                    type="text"
                    placeholder="Contraseña"
                    onChange={(e) =>
                        setCredentials({ ...credentials, password: e.target.value })
                    }
                />
            </fieldset>

            <button>{linkState.loading ? "Registrando..." : "Registrarse"}</button>
        </form>
    ) : authState.readyForOTP ? (
        <form onSubmit={sendCode}>
            <fieldset>
                <input
                    type="text"
                    placeholder="000000"
                    onChange={(e) => setCode(e.target.value)}
                />
            </fieldset>
            <button>{authState.sendingData ? "Enviando..." : "Enviar codigo"}</button>
        </form>
    ) : (
        <form onSubmit={onSignInSubmit}>
            <div>
                Podras seguir ingresando a nuestra aplicacion usando tu numero de celular.
                Ademas no se perderan los datos que ya tienes en nuestra aplicacion.
            </div>
            <PhoneInput
                defaultCountry="bo"
                value={phone}
                onChange={(phone) => setPhone(phone)}
            />
            <div id="recaptcha-container"></div>

            <button>{authState.sendingData ? "Enviando..." : "Confirmar"}</button>
        </form>
    );
};

export default SignUpWithPhone;
