"use client";

import Link from "next/link";
import "@/styles/components/home.css";
import "@/styles/base/reset.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";

const Home = () => {
    const { checkingUserAuth, user } = useContext(AuthContext);

    useEffect(() => {
        if (!checkingUserAuth) {
            if (user) {
                window.location.replace("/redirector");
            }
        }
    }, [checkingUserAuth]);

    return (
        <main className="home-container">
            <span className="circles"></span>
            <img src="/images/logowithname.png" alt="" className="home-image" />
            <Link href={"/auth/signin"} className="action-button touchable">
                Comenzar
            </Link>
            <span className="circles-right-bottom"></span>
        </main>
    );
};

export default Home;
