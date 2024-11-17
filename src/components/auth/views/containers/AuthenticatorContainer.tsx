"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import PageLoading from "@/components/loaders/PageLoading";
import { AuthenticatorContext } from "../../contexts/AuthenticatorContext";
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
            toast.info("Ya estas autenticado");
        }
    }, [checkingUserAuth]);

    return checkingUserAuth ? (
        <PageLoading />
    ) : (
        <main className="auth-wrapper">
            <img src="/images/image1.png" className="auth-image" alt="" />
            <section
                className="form-container"
                data-state={(authWithProvider || loading) && "loading"}
            >
                <h1 className="text auth-wrapper-title | bigger bold center">
                    {authTitle}
                </h1>
                {children}
            </section>
        </main>
    );
};

export default AuthenticatorContainer;
