"use client";

import Link from "next/link";
import "@/styles/components/home.css";
import "@/styles/base/reset.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ServiceReqState } from "@/interfaces/Services";

const Home = () => {
    const { loadingUser, user } = useContext(AuthContext);
    const router = useRouter();
    const toastId = "home-toast-notifier";

    useEffect(() => {
        toast.info("Comprobando authenticacion...", { autoClose: 3000, toastId });
    }, []);

    useEffect(() => {
        if (!loadingUser && user.data) {
            if (user.data.serviceRequests) {
                var pageRedirection;
                if (
                    user.data.serviceRequests.mechanic.state === ServiceReqState.Approved
                ) {
                    pageRedirection = "/services/mechanic";
                } else if (
                    user.data.serviceRequests.tow.state === ServiceReqState.Approved
                ) {
                    pageRedirection = "/services/tow";
                } else {
                    pageRedirection = "/services/drive";
                }
                router.push(pageRedirection);
            } else {
                toast.info("No estas authenticado en nuestra aplicacion");
            }
        }
    }, [loadingUser]);

    return (
        <main className="home-container">
            <span className="circles"></span>
            <img src="/images/logowithname.png" alt="" />
            <Link href={"/auth/signin"} className="action-button">
                Comenzar
            </Link>
            <span className="circles-right-bottom"></span>
        </main>
    );
};

export default Home;
