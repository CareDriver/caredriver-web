"use client";

import React, { useEffect, useState } from "react";
import { Enterprise } from "@/interfaces/Enterprise";
import { getUserEnterprises } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import SimpleEnterpriseCard from "../cards/SimpleEnterpriseCard";
import "@/styles/components/pagination.css";
import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceType } from "@/interfaces/Services";
import { routeToManageEnterpriseAsUser } from "@/utils/route_builders/as_user/RouteBuilderForEnterpriseAsUser";
import { sendWhatsapp } from "@/utils/senders/Sender";
import { PHONE_BUSINESS } from "@/models/Business";
import { greeting } from "@/utils/senders/Greeter";
import { ENTERPRISE_TO_SPANISH } from "../../utils/EnterpriseSpanishTranslator";
import Whatsapp from "@/icons/Whatsapp";
import { MAX_NUMBER_ENTERPRISES } from "../../validators/validators_of_user_aggregators_to_enterprise/as_owners/EnterpriseOwnerValidator";

interface Props {
    user: UserInterface;
    typeOfEnterprise: ServiceType;
}

const EnterpriseListForUserServer: React.FC<Props> = ({
    user,
    typeOfEnterprise,
}) => {
    const [data, setData] = useState<Enterprise[] | null>(null);

    const sendMessageForFistEnterprise = () => {
        let message = greeting().concat(
            `Quiero registrar mi ${ENTERPRISE_TO_SPANISH[typeOfEnterprise]} con ustedes`,
        );
        sendWhatsapp(PHONE_BUSINESS, message);
    };

    const sendMessageForNewEnterprise = () => {
        let message = greeting().concat(
            `Quiero registrar una nueva ${ENTERPRISE_TO_SPANISH[typeOfEnterprise]} con ustedes`,
        );
        sendWhatsapp(PHONE_BUSINESS, message);
    };

    useEffect(() => {
        if (user.id) {
            getUserEnterprises(typeOfEnterprise, user.id).then((result) => {
                setData(result);
            });
        }
    }, []);

    if (!data) {
        return (
            <div className="auto-height">
                <span className="loader-green | big-loader"></span>
            </div>
        );
    }

    if (data.length <= 0) {
        return (
            <div className="auto-height">
                <h2 className="text" onClick={sendMessageForFistEnterprise}>
                    No eres dueño de ninguna empresa,{" "}
                    <i className="text | bold">
                        contactanos para registrar tu{" "}
                        {ENTERPRISE_TO_SPANISH[typeOfEnterprise]} con nosotros.
                    </i>
                </h2>
                <button
                    onClick={sendMessageForFistEnterprise}
                    className="small-general-button text wrap | icon-wrapper lb white-icon | margin-top-25"
                >
                    <Whatsapp />
                    <span className="text white">Enviar mensaje</span>
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="enterprise-list">
                {data.map(
                    (enterprise, i) =>
                        enterprise.id && (
                            <SimpleEnterpriseCard
                                key={`enterprise-item-${i}`}
                                route={routeToManageEnterpriseAsUser(
                                    enterprise.type,
                                    enterprise.id,
                                )}
                                enterprise={enterprise}
                            />
                        ),
                )}
            </div>
            {data.length < MAX_NUMBER_ENTERPRISES && (
                <div className="auto-height">
                    <h2 className="text" onClick={sendMessageForFistEnterprise}>
                        <i className="text | bold">Tienes mas empresas? </i>
                        contactanos para registrar tu{" "}
                        {ENTERPRISE_TO_SPANISH[typeOfEnterprise]} con nosotros.
                    </h2>
                    <button
                        onClick={sendMessageForNewEnterprise}
                        className="small-general-button text wrap | icon-wrapper lb white-icon | margin-top-25"
                    >
                        <Whatsapp />
                        <span className="text white">Enviar mensaje</span>
                    </button>
                </div>
            )}
        </>
    );
};

export default EnterpriseListForUserServer;
