"use client";

import { auth } from "@/firebase/FirebaseConfig";
import { isPhoneValid } from "@/utils/validator/auth/CredentialsValidator";
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
import PhoneForm from "@/components/form/PhoneForm";

const SignUpWithPhone = () => {
    const [phone, setPhone] = useState({
        value: "",
        errorMessage: "",
    });
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
                setLinkState({
                    ...linkState,
                    readyToLink: true,
                });
            })
            .catch((error) => {
                toast("Codigo invalido, vuelva a intentarlo mas tarde");
            });
    };

    const linkAccount = async () => {
        setLinkState({
            ...linkState,
            loading: true,
        });
        const credential = EmailAuthProvider.credential(
            credentials.email,
            credentials.password,
        );

        linkWithCredential(auth.currentUser, credential)
            .then((usercred) => {
                const user = usercred.user;
                toast("Registro exitoso");
                router.push("/services/drive");
                console.log(user);
            })
            .catch((error) => {
                toast("Error al registrarse, vuelva a intentarlo mas tarde");
            });
    };

    const validatePhone = (phone) => {
        const { isValid, message } = isPhoneValid(phone);

        setPhone({
            value: phone,
            errorMessage: isValid ? "" : message,
        });
    };

    return linkState.readyToLink ? (
        <form onSubmit={linkAccount} className="form-container">
            <span>Elige un Correo y Contraseña</span>
            <fieldset className="form-section">
                <input
                    type="email"
                    placeholder="Correo Electronico"
                    onChange={(e) =>
                        setCredentials({ ...credentials, email: e.target.value })
                    }
                    className="form-section-input"
                />
            </fieldset>
            <fieldset className="form-section">
                <input
                    type="text"
                    placeholder="Contraseña"
                    onChange={(e) =>
                        setCredentials({ ...credentials, password: e.target.value })
                    }
                    className="form-section-input"
                />
            </fieldset>

            <button className="general-button | touchable margin-top-25">
                {linkState.sendingData && <i className="loader"></i>}
                <span>Registrarse</span>
            </button>
        </form>
    ) : authState.readyForOTP ? (
        <form onSubmit={sendCode}>
            <fieldset className="form-section">
                <input
                    type="text"
                    placeholder="000000"
                    onChange={(e) => setCode(e.target.value)}
                    className="form-section-input"
                />
            </fieldset>
            <button className="general-button | touchable margin-top-25">
                {authState.sendingData && <i className="loader"></i>}
                <span>Enviar codigo</span>
            </button>
        </form>
    ) : (
        <form onSubmit={onSignInSubmit}>
            <p className="text | small center | margin-bottom-25">
                Podras seguir ingresando a nuestra aplicacion usando tu numero de celular.
                Ademas no se perderan los datos que ya tienes en nuestra aplicacion.
            </p>

            <fieldset className="form-section">
                <PhoneForm phone={phone.value} validatePhone={validatePhone} />
                {phone.errorMessage.length > 0 && <small>{phone.errorMessage}</small>}
            </fieldset>
            <div id="recaptcha-container"></div>

            <button
                disabled={phone.errorMessage !== ""}
                className="general-button | touchable margin-top-25"
            >
                {authState.sendingData && <i className="loader"></i>}
                <span>Confirmar</span>
            </button>
        </form>
    );
};

export default SignUpWithPhone;
