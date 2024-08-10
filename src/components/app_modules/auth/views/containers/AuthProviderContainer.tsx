"use client";

import AuthenticationProvider from "../../contexts/AuthenticationContext";

interface Props {
    children: React.ReactNode;
}

const AuthProviderContainer: React.FC<Props> = ({ children }) => {
    return <AuthenticationProvider>{children}</AuthenticationProvider>;
};

export default AuthProviderContainer;
