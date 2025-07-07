"use client";

import { useContext } from "react";
import { signUpWithGoogle } from "../../api/UserAuth";
import { AuthenticatorContext } from "../../contexts/AuthenticatorContext";
import Google from "@/icons/Google";

const AuthProviders = ({
  alternativeLegend,
}: {
  alternativeLegend?: string;
}) => {
  const { authWithProvider, setAuthWithProvider } =
    useContext(AuthenticatorContext);

  return (
    <>
      <div className="form-provider-option">
        <div className="form-provider-option-separator"></div>
        <span className="form-provider-option-o">
          {alternativeLegend ? alternativeLegend : "o"}
        </span>
        <div className="form-provider-option-separator"></div>
      </div>
      <button
        className="form-section-input | form-provider-auth-button touchable"
        onClick={() => signUpWithGoogle(authWithProvider, setAuthWithProvider)}
      >
        {authWithProvider ? (
          <i className="loader-green"></i>
        ) : (
          <span className="form-provider-auth-button-content icon-wrapper white-icon">
            <Google />
            Continuar con Google
          </span>
        )}
      </button>
    </>
  );
};

export default AuthProviders;
