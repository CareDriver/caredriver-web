"use client";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import "@/styles/modules/popup.css";
import PageLoading from "@/components/loaders/PageLoading";
import UserAssociatedEnterpriseRenderer from "../../../data_renderers/UserAssociatedEnterpriseRenderer";
import RedirectorToTheAppAsServerUser from "../RedirectorToTheAppAsServerUser";

const MechanicPanel = () => {
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
                <RedirectorToTheAppAsServerUser serviceType="mechanical" />

                <UserAssociatedEnterpriseRenderer
                    typeOfEnterprise="mechanical"
                    user={user}
                />
                <span className="circles-right-bottomv2 green"></span>
            </div>
        )
    );
};

export default MechanicPanel;
