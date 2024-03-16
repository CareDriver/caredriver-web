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
                console.log("success");
            })
            .catch((error) => {
                console.log("failed");
            });
    };

    return authState.readyForOTP ? (
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
