"use client";

import PageLoader from "@/components/PageLoader";
import { Enterprise } from "@/interfaces/Enterprise";
import { getEnterpriseById } from "@/utils/requests/enterprise/EnterpriseRequester";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EnterpriseReqRender from "./EnterpriseReqRender";
import { getRoute } from "@/utils/parser/ToSpanishEnterprise";

const SingleEnterpriseReq = ({
    reqId,
    type,
}: {
    reqId: string;
    type: "mechanical" | "tow" | "laundry" | "driver";
}) => {
    const [serviceReq, setServiceReq] = useState<Enterprise | null>(null);
    const router = useRouter();

    useEffect(() => {
        getEnterpriseById(reqId)
            .then((data) => {
                if (data) {
                    setServiceReq(data);
                } else {
                    router.push(`/admin/requests/enterprises/${getRoute(type)}`);
                    toast.error("Petición no encontrada");
                }
            })
            .catch((e) => {
                router.push(`/admin/requests/enterprises/${getRoute(type)}`);
                toast.error("Petición no encontrada");
            });
    }, []);

    return serviceReq ? <EnterpriseReqRender enterprise={serviceReq} /> : <PageLoader />;
};

export default SingleEnterpriseReq;
