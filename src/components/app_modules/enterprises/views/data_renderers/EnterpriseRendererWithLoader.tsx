"use client";

import { Enterprise } from "@/interfaces/Enterprise";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { useEffect } from "react";
import LaundryEnterpriseRenderer from "./LaundryEnterpriseRenderer";
import WorkshopEnterpriseRenderer from "./WorkshopEnterpriseRenderer";
import CraneEnterpriseRenderer from "./CraneEnterpriseRenderer";
import DriverEnterpriseRenderer from "./DriverEnterpriseRenderer";
import { ServiceType } from "@/interfaces/Services";

interface Props {
    enterpriseId: string | undefined;
    type: ServiceType;
    enterprise: Enterprise | null | undefined;
    setEnterprise: (enterprise: Enterprise | undefined) => void;
}

const EnterpriseRendererWithLoader: React.FC<Props> = ({
    enterprise,
    setEnterprise,
    enterpriseId,
    type,
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

    const renderEnterprise = (enterpriseData: Enterprise | undefined) => {
        switch (type) {
            case "laundry":
                return <LaundryEnterpriseRenderer laundry={enterpriseData} />;
            case "mechanical":
                return <WorkshopEnterpriseRenderer workshop={enterpriseData} />;
            case "driver":
                return (
                    <DriverEnterpriseRenderer
                        driverEnterprise={enterpriseData}
                    />
                );
            default:
                return <CraneEnterpriseRenderer crane={enterpriseData} />;
        }
    };

    return enterprise === null ? (
        <span className="loader-green"></span>
    ) : (
        renderEnterprise(enterprise)
    );
};

export default EnterpriseRendererWithLoader;
