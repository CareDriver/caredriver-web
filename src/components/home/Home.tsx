"use client";

import Link from "next/link";
import "@/styles/components/home.css";
import "@/styles/base/reset.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { routeToSingIn } from "@/utils/route_builders/as_not_logged/RouteBuilderForAuth";

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
            <Link href={routeToSingIn()} className="action-button touchable">
                Comenzar
            </Link>
            <span className="circles-right-bottom"></span>
        </main>
    );
};

export default Home;
