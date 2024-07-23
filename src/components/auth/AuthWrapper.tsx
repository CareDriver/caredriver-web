"use client";
import { useContext, useEffect } from "react";
import "../../styles/components/auth_page.css";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import PageLoader from "../PageLoader";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const { loadingUser, user } = useContext(AuthContext);

    useEffect(() => {
        if (!loadingUser && user.data) {
            window.location.replace("/redirector")
            toast.info("Ya estas authenticado");
        }
    }, [loadingUser]);

    return loadingUser ? (
        <PageLoader />
    ) : (
        <main className="auth-wrapper">
            <div className="top-middle-cicle auth-circle-image">
                <img src="/images/car.png" alt="" />
            </div>
            <img src="/images/image1.png" className="auth-image" alt="" />
            {children}
        </main>
    );
};

export default AuthWrapper;
