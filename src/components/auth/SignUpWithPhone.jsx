"use client";

import { auth } from "@/firebase/FirebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const SignUpWithPhone = () => {
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [authState, setAuthState] = useState({
        sendingData: false,
        readyForOTP: false,
    });

    const [verifier, setVerifier] = useState(null);

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
                setVerifier(confirmationResult);
                setAuthState({
                    readyForOTP: true,
                    sendingData: false,
                });
            })
            .catch((error) => {
                setAuthState({ ...authState, sendingData: false });
            });
    };

    const sendCode = (e) => {
        e.preventDefault();
        setAuthState({ ...authState, sendingData: true });

        verifier
            .confirm(code)
            .then(async (res) => {
                console.log("success");
                setAuthState({ ...authState, sendingData: false });
            })
            .catch((error) => {
                console.log("failed");
                setAuthState({ ...authState, sendingData: false });
            });
    };

    return authState.readyForOTP ? (
        <form onSubmit={sendCode}>
            <fieldset>
                <input
                    type="text"
                    placeholder="000000"
                    onChange={(code) => setCode(code)}
                />
            </fieldset>
            <button>{authState.sendingData ? "Enviando..." : "Enviar codigo"}</button>
        </form>
    ) : (
        <form onSubmit={onSignInSubmit}>
            <div>No se borraran los datos que ya tienes en la aplicacion.</div>
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
