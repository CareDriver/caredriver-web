import { signUpWithGoogle } from "@/utils/auth/UserAuth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const AuthProviders = ({
    router,
    verifiyingProvider,
    setVerifier,
}: {
    router: AppRouterInstance;
    verifiyingProvider: boolean;
    setVerifier: (verifiyingProvider: boolean) => void;
}) => {
    return (
        <>
            <button
                className="form-section-input | form-provider-auth-button touchable"
                onClick={() => signUpWithGoogle(router, verifiyingProvider, setVerifier)}
            >
                {verifiyingProvider ? (
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
