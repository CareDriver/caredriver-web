"use client";

import React, { useEffect, useState } from "react";
import { Enterprise } from "@/interfaces/Enterprise";
import { getUserEnterprises } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import EnterpriseItem from "../cards/EnterpriseItem";
import "@/styles/components/pagination.css";
import { getRoute } from "@/utils/parser/ToSpanishEnterprise";
import { UserInterface } from "@/interfaces/UserInterface";

interface Props {
    user: UserInterface;
    typeOfEnterprise: "mechanical" | "tow" | "laundry" | "driver";
}

const EnterpriseListForUserServer: React.FC<Props> = ({
    user,
    typeOfEnterprise,
}) => {
    const [data, setData] = useState<Enterprise[] | null>(null);

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
                <h2 className="text">
                    <i>No se encontraron empresas</i>
                </h2>
            </div>
        );
    }

    return (
        <div className="enterprise-list">
            {data.map((product, i) => (
                <EnterpriseItem
                    key={`enterprise-item-${i}`}
                    route={`/enterprise/${getRoute(typeOfEnterprise)}/edit/${
                        product.id
                    }`}
                    enterprise={product}
                />
            ))}
        </div>
    );

    /*     return <div>
    {data.length > 0 ? (
        
    ) : (
        
    )}
    <div className="margin-top-25">
        <div className="separator-horizontal"></div>
        <h2 className="text | medium-big | margin-top-25 margin-bottom-25">
            Empresas donde eres usuario soporte
        </h2>
        <EnterpriseListForSupportUser type={typeOfEnterprise} />
    </div>
</div> */
};

export default EnterpriseListForUserServer;
