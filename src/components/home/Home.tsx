"use client";

import Link from "next/link";
import "@/styles/components/home.css";
import "@/styles/base/reset.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { routeToSingIn } from "@/utils/route_builders/as_not_logged/RouteBuilderForAuth";
import HandPointRight from "@/icons/HandPointRight";
import CarSide from "@/icons/CarSide";
import Wrench from "@/icons/Wrench";
import Truck from "@/icons/Truck";
import Soap from "@/icons/Soap";

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
            <div className="home-sub-container | z-index-1">
                <img
                    src="/images/logowithname.png"
                    alt="logo de la empresa..."
                    className="home-image"
                />

                <Link
                    href={routeToSingIn()}
                    className="action-button | icon-wrapper mb margin-top-25"
                >
                    <HandPointRight />
                    <span className="text | big-medium-v3 bold">
                        Comiza{" "}
                        <i className="text big-medium-v3 bolder">Ahora!</i>
                    </span>
                </Link>
            </div>
            <div className="home-sub-container | margin-top-15 z-index-1">
                <div className="row-wrapper row-responsive | center margin-bottom-25">
                    <h3 className="home-service | text | medium gray-dark bold | icon-wrapper gray-icon lb">
                        <CarSide />
                        Choferes
                    </h3>
                    |
                    <h3 className="home-service | text | medium gray-dark bold | icon-wrapper gray-icon">
                        <Soap />
                        Lavaderos
                    </h3>
                    |
                    <h3 className="home-service | text | medium gray-dark bold | icon-wrapper gray-icon">
                        <Wrench />
                        Mecánicos
                    </h3>
                    |
                    <h3 className="home-service | text | medium gray-dark bold | icon-wrapper gray-icon lb">
                        <Truck />
                        Operadores de Grúa
                    </h3>
                </div>
                <div className="column-wrapper center | max-width-80">
                    <p className="text | gray-dark center">
                        Nuestra plataforma de administración simplifica el
                        proceso de registro y gestión,{" "}
                        <i className="text | bold gray-medium">
                            conectando a proveedores de servicios con clientes
                            que buscan soluciones confiables.
                        </i>
                    </p>
                    <p className="text | gray-dark center">
                        Optimiza tu perfil y aumenta tu visibilidad en la
                        búsqueda de{" "}
                        <i className="text | gray-medium bold">
                            oportunidades laborales
                        </i>{" "}
                        en la industria del transporte y mantenimiento.
                    </p>
                </div>
            </div>
            <span className="circles-right-bottom"></span>
        </main>
    );
};

export default Home;

/* 


*/
