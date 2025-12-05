"use client";

import "@/styles/main.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import AuthProvider from "@/context/AuthContext";
import Head from "next/head";
import Script from "next/script";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="es">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Plataforma integral de servicios especializados conductores, mecánicos grúas y lavaderos. Envía tu solicitud para ofrecer alguno de estos servicios en nuestra aplicación."
        />
        <meta
          name="keywords"
          content="transporte, conductor, mecánico, grúa, lavandería, servicios, CareDriver"
        />
        <meta property="og:image" content="https://i.ibb.co/8wgXZJB/Screenshot-from-2025-12-05-13-22-46.png"></meta>
        <meta name="theme-color" content="#07e580" />
        <meta name="color-scheme" content="light" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta property="og:title" content="CareDriver - Panel Web" />
        <meta
          property="og:description"
          content="Plataforma integral de servicios especializados de automóviles."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CareDriver" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CareDriver - Panel Web" />
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
