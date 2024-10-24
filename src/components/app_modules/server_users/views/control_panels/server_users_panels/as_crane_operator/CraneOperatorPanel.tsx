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
            <div className="service-form-wrapper">
                <h1 className="text | big bold green">
                    Tu solicitud fue aprobada!
                </h1>
                <RedirectorToTheAppAsServerUser serviceType="tow" />
                <img className="request-aproved-image" src="/images/image3.png" alt="" />
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
            </div>
        )
    );
};

export default CraneOperatorPanel;
