"use client";

import React, { useContext, useEffect, useState } from "react";
import { Enterprise } from "@/interfaces/Enterprise";
import { getUserEnterprises } from "@/utils/requests/enterprise/EnterpriseRequester";
import { AuthContext } from "@/context/AuthContext";
import EnterpriseItem from "./EnterpriseItem";
import "@/styles/components/pagination.css";
import { getEmptyEnterprise, getRoute } from "@/utils/parser/ToSpanishEnterprise";
import EnterpriseListForSupportUser from "./EnterpriseListForSupportUser";

const EnterpriseListForUsers = ({
    type,
}: {
    type: "mechanical" | "tow" | "laundry" | "driver";
}) => {
    const { loadingUser, user } = useContext(AuthContext);
    const [data, setData] = useState<Enterprise[] | null>(null);

    useEffect(() => {
        if (!loadingUser && user.data && user.data.id) {
            getUserEnterprises(type, user.data.id).then((result) => {
                setData(result);
            });
        }
    }, [loadingUser]);

    return !loadingUser ? (
        <div>
            {data && data.length > 0 ? (
                <div className="enterprise-list">
                    {data.map((product, i) => (
                        <EnterpriseItem
                            key={`enterprise-item-${i}`}
                            route={`/enterprise/${getRoute(type)}/edit/${product.id}`}
                            enterprise={product}
                        />
                    ))}
                </div>
            ) : (
                <div className="auto-height">
                    <h2 className="text | medium-big">
                        No tienes {getEmptyEnterprise(type)}
                    </h2>
                </div>
            )}
            <div className="margin-top-25">
                <div className="separator-horizontal"></div>
                <h2 className="text | medium-big | margin-top-25 margin-bottom-25">
                    Empresas donde eres usuario soporte
                </h2>
                <EnterpriseListForSupportUser type={type} />
            </div>
        </div>
    ) : (
        <div className="auto-height">
            <span className="loader-green | big-loader"></span>
        </div>
    );
};

export default EnterpriseListForUsers;
