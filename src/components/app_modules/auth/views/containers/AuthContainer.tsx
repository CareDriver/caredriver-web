"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import PageLoading from "@/components/loaders/PageLoading";
import { AuthenticatorContext } from "../../contexts/AuthenticationContext";
import AuthProviders from "../providers/AuthProviders";
import { useRouter } from "next/navigation";
import "@/styles/components/auth_page.css";

interface Props {
    authTitle: string;
    children: React.ReactNode;
}

const AuthContainer: React.FC<Props> = ({ authTitle, children }) => {
    const router = useRouter();
    const { loading, authWithProvider, setAuthWithProvider } =
        useContext(AuthenticatorContext);
    const { loadingUser, user } = useContext(AuthContext);

    useEffect(() => {
        if (!loadingUser && user.data) {
            window.location.replace("/redirector");
            toast.info("Ya estas authenticado");
        }
    }, [loadingUser]);

    return loadingUser ? (
        <PageLoading />
    ) : (
        <main className="auth-wrapper">
            <div className="top-middle-cicle auth-circle-image">
                <img src="/images/car.png" alt="" />
            </div>
            <img src="/images/image1.png" className="auth-image" alt="" />

            <section
                className="form-container | form-auth center"
                data-state={authWithProvider || (loading && "loading")}
            >
                <h1 className="text | bigger bold center | margin-bottom-50">
                    {authTitle}
                </h1>
                <AuthProviders
                    router={router}
                    setVerifier={setAuthWithProvider}
                    verifiyingProvider={authWithProvider}
                />
                {children}
            </section>
        </main>
    );
};

export default AuthContainer;
