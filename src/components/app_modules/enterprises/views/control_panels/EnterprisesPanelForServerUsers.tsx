"use client";

import EnterpriseListForUserServer from "../list_of_cards/EnterpriseListForUserServer";
import "@/styles/components/enterprise.css";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import PageLoading from "@/components/loaders/PageLoading";
import EnterpriseListForSupportUser from "../list_of_cards/EnterpriseListForSupportUser";

interface Props {
    typeOfEnterprise: "mechanical" | "tow" | "laundry" | "driver";
}

const EnterprisesPanelForServerUsers: React.FC<Props> = ({ typeOfEnterprise }) => {
    const { user, checkingUserAuth } = useContext(AuthContext);

    if (checkingUserAuth) {
        return <PageLoading />;
    }

    return (
        user && (
            <section className="enterprise-main-wrapper">
                <h1 className="text | big bolder">Empresas</h1>
                <p className="text | light">
                    Empresas donde eres administrador
                </p>
                <EnterpriseListForUserServer
                    user={user}
                    typeOfEnterprise={typeOfEnterprise}
                />
                <div className="separator-horizontal"></div>
                <p className="text | light">
                    Empresas donde eres usuario soporte
                </p>
                <EnterpriseListForSupportUser
                    user={user}
                    typeOfEnterprise={typeOfEnterprise}
                />
            </section>
        )
    );
};

export default EnterprisesPanelForServerUsers;
