"use client";

import Link from "next/link";
import "@/styles/components/home.css";
import "@/styles/base/reset.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

const Home = () => {
    const { loadingUser, user } = useContext(AuthContext);
    const toastId = "home-toast-notifier";

    useEffect(() => {
        toast.info("Comprobando authenticacion...", { autoClose: 3000, toastId });
    }, []);

    useEffect(() => {
        if (!loadingUser) {
            if (user.data) {
                window.location.replace("/redirector");
            } else {
                toast.info("No estas authenticado en nuestra aplicacion", {
                    toastId: "no-auth-user-toast-info",
                });
            }
        }
    }, [loadingUser]);

    return (
        <main className="home-container">
            <span className="circles"></span>
            <img src="/images/logowithname.png" alt="" />
            <Link href={"/auth/signin"} className="action-button touchable">
                Comenzar
            </Link>
            <span className="circles-right-bottom"></span>
        </main>
    );
};

export default Home;
