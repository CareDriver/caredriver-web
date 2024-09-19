"use client";

import { useContext } from "react";
import { signUpWithGoogle } from "../../api/UserAuth";
import { AuthenticatorContext } from "../../contexts/AuthenticatorContext";

const AuthProviders = () => {
    const { authWithProvider, setAuthWithProvider } =
        useContext(AuthenticatorContext);

    return (
        <>
            <button
                className="form-section-input | form-provider-auth-button touchable"
                onClick={() =>
                    signUpWithGoogle(authWithProvider, setAuthWithProvider)
                }
            >
                {authWithProvider ? (
                    <i className="loader-green"></i>
                ) : (
                    <span className="form-provider-auth-button-content ">
                        <img
                            className="form-provider-auth-img"
                            src="/images/google_logo.webp"
                            alt=""
                        />
                        Google
                    </span>
                )}
            </button>
            <div className="form-provider-option">
                <div className="form-provider-option-separator"></div>
                <span className="form-provider-option-o">o</span>
                <div className="form-provider-option-separator"></div>
            </div>
        </>
    );
};

export default AuthProviders;
