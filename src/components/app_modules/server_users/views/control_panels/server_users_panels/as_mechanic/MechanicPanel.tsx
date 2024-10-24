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
            <div className="service-form-wrapper">
                <h1 className="text | big bolder green">
                    Tu solicitud fue aprobada!
                </h1>
                <RedirectorToTheAppAsServerUser serviceType="mechanical" />
                <img
                    className="request-aproved-image"
                    src="/images/image4.png"
                    alt=""
                />
                <UserAssociatedEnterpriseRenderer
                    typeOfEnterprise="mechanical"
                    user={user}
                />
            </div>
        )
    );
};

export default MechanicPanel;
