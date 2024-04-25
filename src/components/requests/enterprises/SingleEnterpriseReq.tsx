"use client";

import PageLoader from "@/components/PageLoader";
import { Enterprise } from "@/interfaces/Enterprise";
import { getEnterpriseById } from "@/utils/requests/enterprise/EnterpriseRequester";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EnterpriseReqRender from "./EnterpriseReqRender";

const SingleEnterpriseReq = ({
    reqId,
    type,
}: {
    reqId: string;
    type: "mechanical" | "tow";
}) => {
    const [serviceReq, setServiceReq] = useState<Enterprise | null>(null);
    const router = useRouter();

    useEffect(() => {
        getEnterpriseById(reqId)
            .then((data) => {
                if (data) {
                    setServiceReq(data);
                } else {
                    router.push(`/admin/requests/services/drive`);
                    toast.error("Peticion no encontrada");
                }
            })
            .catch((e) => {
                router.push(
                    `/admin/requests/enterprises/${
                        type === "tow" ? "cranes" : "workshops"
                    }`,
                );
                toast.error("Peticion no encontrada");
            });
    }, []);

    return serviceReq ? <EnterpriseReqRender enterprise={serviceReq} /> : <PageLoader />;
};

export default SingleEnterpriseReq;
