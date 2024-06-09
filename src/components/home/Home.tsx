"use client";

import Link from "next/link";
import "@/styles/components/home.css";
import "@/styles/base/reset.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";

const Home = () => {
    const { loadingUser, user } = useContext(AuthContext);

    useEffect(() => {
        if (!loadingUser) {
            if (user.data) {
                window.location.replace("/redirector");
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
