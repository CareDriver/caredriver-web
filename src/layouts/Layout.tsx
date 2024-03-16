"use client";

import "../styles/main.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import AuthProvider from "@/context/AuthContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
            </head>
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
