"use client";
import { AuthContext } from "@/context/AuthContext";
import SackDollar from "@/icons/SackDollar";
import { useContext } from "react";
import "@/styles/modules/popup.css";
import PageLoading from "@/components/loaders/PageLoading";
import UserAssociatedEnterpriseRenderer from "../../../data_renderers/UserAssociatedEnterpriseRenderer";

const LaundererPanel = () => {
    const { user, checkingUserAuth } = useContext(AuthContext);

    if (checkingUserAuth) {
        return <PageLoading />;
    }

    return (
        user && (
            <div className="service-form-wrapper | max-height-100">
                <h1 className="text | big bolder green">
                    Tu solicitud fue aprobada!
                </h1>
                <p className="text icon-wrapper | green-icon green bolder lb medium margin-top-15">
                    <SackDollar />
                    Ve a nuestra Aplicación Móvil y empieza a Ofrecer tu
                    servicio!
                </p>
                <UserAssociatedEnterpriseRenderer
                    typeOfEnterprise="laundry"
                    user={user}
                />
                <span className="circles-right-bottomv2 green"></span>
            </div>
        )
    );
};

export default LaundererPanel;
