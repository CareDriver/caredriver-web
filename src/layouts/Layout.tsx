"use client";

import "@/styles/main.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import AuthProvider from "@/context/AuthContext";
import Head from "next/head";
import Script from "next/script";

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
                <Script id="liveagent-script" strategy="afterInteractive">
                    {`
                        (function(d, src, c) {
                            var t = d.scripts[d.scripts.length - 1], 
                                s = d.createElement('script'); 
                            s.id = 'la_x2s6df8d'; 
                            s.defer = true; 
                            s.src = src; 
                            s.onload = s.onreadystatechange = function() {
                                var rs = this.readyState; 
                                if (rs && (rs != 'complete') && (rs != 'loaded')) { return; } 
                                c(this);
                            }; 
                            t.parentElement.insertBefore(s, t.nextSibling);
                        })(document, 'https://caredriver.ladesk.com/scripts/track.js', function(e) {
                            LiveAgent.createButton('b3cuww8j', e);
                        });
                    `}
                </Script>
            </body>
        </html>
    );
};

export default Layout;
