"use client";

import { Enterprise } from "@/interfaces/Enterprise";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { useEffect } from "react";
import LaundryRenderer from "./LaundryRenderer";
import WorkshopRenderer from "./WorkshopRenderer";
import TowRenderer from "./TowRenderer";
import DriverServiceRenderer from "./DriverServiceRenderer";

const EnterpriseFetcher = ({
    enterprise,
    setEnterprise,
    enterpriseId,
    type,
}: {
    enterprise: Enterprise | null | undefined;
    setEnterprise: (enterprise: Enterprise | undefined) => void;
    enterpriseId: string | undefined;
    type: "laundry" | "tow" | "mechanic" | "driver";
}) => {
    useEffect(() => {
        if (enterpriseId) {
            if (!enterprise) {
                getEnterpriseById(enterpriseId)
                    .then((res) => setEnterprise(res))
                    .catch(() => setEnterprise(undefined));
            }
        } else {
            setEnterprise(undefined);
        }
    }, []);

    const getEnterprise = (enterpriseData: Enterprise | undefined) => {
        switch (type) {
            case "laundry":
                return <LaundryRenderer laundry={enterpriseData} />;
            case "mechanic":
                return <WorkshopRenderer workshop={enterpriseData} />;
            case "driver":
                return <DriverServiceRenderer driverEnterprise={enterpriseData} />;
            default:
                return <TowRenderer tow={enterpriseData} />;
        }
    };

    return enterprise === null ? (
        <span className="loader-green | big-loader"></span>
    ) : (
        getEnterprise(enterprise)
    );
};

export default EnterpriseFetcher;
