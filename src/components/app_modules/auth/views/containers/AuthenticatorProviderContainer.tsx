"use client";

import AuthenticatorProvider from "../../contexts/AuthenticatorContext";

interface Props {
    children: React.ReactNode;
}

const AuthenticatorProviderContainer: React.FC<Props> = ({ children }) => {
    return <AuthenticatorProvider>{children}</AuthenticatorProvider>;
};

export default AuthenticatorProviderContainer;
