"use client";

import "@/styles/components/home.css";
import "@/styles/base/reset.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import HomeDescription from "./HomeDescription";
import HomeServices from "./HomeServices";
import HomePresentation from "./HomePresentation";

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
            <HomePresentation />
            <div className="home-info-wrapper home-sub-container | margin-top-15 z-index-1">
                <HomeServices />
                <HomeDescription />
            </div>
        </main>
    );
};

export default Home;

/* 


*/
