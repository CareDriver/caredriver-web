"use client";

import "@/styles/main.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import AuthProvider from "@/context/AuthContext";
import Head from "next/head";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
            </Head>
            <body>
                <AuthProvider>{children}</AuthProvider>
                <ToastContainer
                    position="bottom-right"
                    autoClose={4000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={true}
                    pauseOnHover
                    theme="light"
                />
            </body>
        </html>
    );
};

export default Layout;
