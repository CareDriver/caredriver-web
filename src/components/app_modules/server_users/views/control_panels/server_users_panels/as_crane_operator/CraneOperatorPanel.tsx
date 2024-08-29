"use client";

import { AuthContext } from "@/context/AuthContext";
import SackDollar from "@/icons/SackDollar";
import { useContext, useState } from "react";
import "@/styles/modules/popup.css";
import PageLoading from "@/components/loaders/PageLoading";
import EnterpriseRendererAsPopup from "@/components/app_modules/enterprises/views/data_renderers/EnterpriseRendererAsPopup";
import { MissingTransmissionAdder } from "@/components/app_modules/server_users/api/MissingTransmissionAdder";
import RegisteredVehicleRenderer from "../../../data_renderers/for_vehicles/RegisteredVehicleRenderer";

const CraneOperatorPanel = () => {
    const { user, checkingUserAuth } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const transmisionAdder = new MissingTransmissionAdder(
        user,
        loading,
        setLoading,
    );

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
                <EnterpriseRendererAsPopup enterpriseId={user.towEnterpriseId} />
                {user.serviceVehicles && user.serviceVehicles.tow && (
                    <RegisteredVehicleRenderer
                        legend="Operador de Grúa"
                        transmisionAdder={transmisionAdder}
                        vehicle={user.serviceVehicles.tow}
                        vehicleType="tow"
                    />
                )}
                <span className="circles-right-bottomv2 green"></span>
            </div>
        )
    );
};

export default CraneOperatorPanel;
