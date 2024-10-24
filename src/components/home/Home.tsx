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
import { DRIVER_PLURAL } from "@/models/Business";
import { toCapitalize } from "@/utils/text_helpers/TextFormatter";
import CompanyNameAndLogo from "@/icons/company/CompanyNameAndLogo";

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
                <div className="home-sub-container-logo-name-wrapper">
                    <span className="home-sub-container-name">
                        <CompanyNameAndLogo />
                    </span>
                </div>
                <Link
                    href={routeToSingIn()}
                    className="action-button | icon-wrapper mb margin-top-25"
                >
                    <HandPointRight />
                    <span className="text | big-medium-v3 bold">
                        Comienza{" "}
                        <i className="text big-medium-v3 bolder">Ahora!</i>
                    </span>
                </Link>
            </div>
            <div className="home-sub-container | margin-top-15 z-index-1">
                <div className="row-wrapper row-responsive | center margin-bottom-25">
                    <h3 className="home-service | text | medium gray-medium bold | icon-wrapper gray-medium-icon lb">
                        <CarSide />
                        {toCapitalize(DRIVER_PLURAL)}
                    </h3>
                    |
                    <h3 className="home-service | text | medium gray-medium bold | icon-wrapper gray-medium-icon">
                        <Soap />
                        Lavaderos
                    </h3>
                    |
                    <h3 className="home-service | text | medium gray-medium bold | icon-wrapper gray-medium-icon">
                        <Wrench />
                        Mecánicos
                    </h3>
                    |
                    <h3 className="home-service | text | medium gray-medium bold | icon-wrapper gray-medium-icon lb">
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
