import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { createContext, useEffect, useState } from "react";

type ContextType = {
    loading: boolean;
    isValid: boolean;
    authWithProvider: boolean;

    setValid: (l: boolean) => void;
    setLoading: (l: boolean) => void;
    setAuthWithProvider: (l: boolean) => void;
};

const DefaultContext: ContextType = {
    loading: false,
    isValid: true,
    authWithProvider: false,

    setValid: (l: boolean) => {},
    setLoading: (l: boolean) => {},
    setAuthWithProvider: (l: boolean) => {},
};

export const AuthenticatorContext = createContext<ContextType>(DefaultContext);

const AuthenticationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [authWithProvider, setAuthWithProvider] = useState(false);

    const setLoading = (loading: boolean) =>
        setFormState((prev) => ({ ...prev, loading: loading }));

    const setValid = (isValid: boolean) =>
        setFormState((prev) => ({ ...prev, isValid: isValid }));

    return (
        <AuthenticatorContext.Provider
            value={{
                loading: formState.loading,
                isValid: formState.isValid,
                setValid,
                setLoading,
                authWithProvider,
                setAuthWithProvider,
            }}
        >
            {children}
        </AuthenticatorContext.Provider>
    );
};

export default AuthenticationProvider;
