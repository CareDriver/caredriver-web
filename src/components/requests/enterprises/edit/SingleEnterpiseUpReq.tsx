"use client";

import PageLoader from "@/components/PageLoader";
import { ReqEditEnterprise } from "@/interfaces/Enterprise";
import { getEditEnterpriseReqById } from "@/utils/requests/enterprise/EditEnterpriseReq";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EnterpriseUpReqRender from "./EnterpriseUpReqRender";

const SingleEnterpiseUpReq = ({
    reqId,
    type,
}: {
    reqId: string;
    type: "mechanical" | "tow";
}) => {
    const [serviceReq, setServiceReq] = useState<ReqEditEnterprise | null>(null);
    const router = useRouter();

    useEffect(() => {
        getEditEnterpriseReqById(reqId)
            .then((data) => {
                if (data) {
                    setServiceReq(data);
                } else {
                    router.push(
                        `/admin/requests/enterprises/edit${
                            type === "tow" ? "cranes" : "workshops"
                        }`,
                    );
                    toast.error("Peticion no encontrada");
                }
            })
            .catch((e) => {
                router.push(
                    `/admin/requests/enterprises/edit${
                        type === "tow" ? "cranes" : "workshops"
                    }`,
                );
                toast.error("Peticion no encontrada");
            });
    }, []);

    return serviceReq ? (
        <EnterpriseUpReqRender enterprise={serviceReq} />
    ) : (
        <PageLoader />
    );
};

export default SingleEnterpiseUpReq;
