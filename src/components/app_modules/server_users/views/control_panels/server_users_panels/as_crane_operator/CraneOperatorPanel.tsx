"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";
import "@/styles/modules/popup.css";
import PageLoading from "@/components/loaders/PageLoading";
import { MissingTransmissionAdder } from "@/components/app_modules/server_users/api/MissingTransmissionAdder";
import RegisteredVehicleRenderer from "../../../data_renderers/for_vehicles/RegisteredVehicleRenderer";
import UserAssociatedEnterpriseRenderer from "../../../data_renderers/UserAssociatedEnterpriseRenderer";
import RedirectorToTheAppAsServerUser from "../RedirectorToTheAppAsServerUser";

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
                <RedirectorToTheAppAsServerUser serviceType="tow" />
                <UserAssociatedEnterpriseRenderer
                    typeOfEnterprise="tow"
                    user={user}
                />
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
