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
            toast.info("Ya estas authenticado");
        }
    }, [loadingUser]);

    return loadingUser ? (
        <PageLoader />
    ) : (
        <main className="auth-wrapper">
            <img src="/images/image1.png" className="auth-image" alt="" />
            {children}
        </main>
    );
};

export default AuthWrapper;
