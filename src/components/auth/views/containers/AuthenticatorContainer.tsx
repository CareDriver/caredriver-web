"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import PageLoading from "@/components/loaders/PageLoading";
import { AuthenticatorContext } from "../../contexts/AuthenticatorContext";
import AuthProviders from "../providers/AuthProviders";
import "@/styles/components/auth_page.css";
import { routeToRedirector } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";

interface Props {
    authTitle: string;
    children: React.ReactNode;
}

const AuthenticatorContainer: React.FC<Props> = ({ authTitle, children }) => {
    const { loading, authWithProvider } = useContext(AuthenticatorContext);
    const { checkingUserAuth, user } = useContext(AuthContext);

    useEffect(() => {
        if (!checkingUserAuth && user) {
            window.location.replace(routeToRedirector());
            toast.info("Ya estas authenticado");
        }
    }, [checkingUserAuth]);

    return checkingUserAuth ? (
        <PageLoading />
    ) : (
        <main className="auth-wrapper">
            <div className="top-middle-cicle auth-circle-image">
                <img src="/images/car.png" alt="" />
            </div>
            <img src="/images/image1.png" className="auth-image" alt="" />

            <section
                className="form-container"
                data-state={(authWithProvider || loading) && "loading"}
            >
                <h1 className="text | bigger bold center | margin-bottom-15">
                    {authTitle}
                </h1>
                <AuthProviders />
                {children}
            </section>
        </main>
    );
};

export default AuthenticatorContainer;
