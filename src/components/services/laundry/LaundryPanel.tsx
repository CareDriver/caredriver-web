"use client";
import PageLoader from "@/components/PageLoader";
import { AuthContext } from "@/context/AuthContext";
import SackDollar from "@/icons/SackDollar";
import { useContext } from "react";

const LaundryPanel = () => {
    const { user, loadingUser } = useContext(AuthContext);

    return loadingUser ? (
        <PageLoader />
    ) : user.data ? (
        <div className="service-form-wrapper | max-height-100">
            <h1 className="text | big bolder green">Tu solicitud fue aprobada!</h1>
            <p className="text icon-wrapper | green-icon green bolder lb medium margin-top-15">
                <SackDollar />
                Ve a nuestra Aplicacion Móvil y empieza a Ofrecer tu servicio!
            </p>
            <span className="circles-right-bottomv2 green"></span>
        </div>
    ) : (
        <h2>Usuario no encontrado</h2>
    );
};

export default LaundryPanel;
