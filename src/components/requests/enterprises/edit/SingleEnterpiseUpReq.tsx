"use client";

import PageLoader from "@/components/PageLoader";
import { Enterprise, ReqEditEnterprise } from "@/interfaces/Enterprise";
import { getEditEnterpriseReqById } from "@/utils/requests/enterprise/EditEnterpriseReq";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EnterpriseUpReqRender from "./EnterpriseUpReqRender";
import { getEnterpriseById } from "@/utils/requests/enterprise/EnterpriseRequester";

const SingleEnterpiseUpReq = ({
    reqId,
    type,
}: {
    reqId: string;
    type: "mechanical" | "tow";
}) => {
    const [serviceReq, setServiceReq] = useState<ReqEditEnterprise | null>(null);
    const [realServiceReq, setRealServiceReq] = useState<Enterprise | null>(null);
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

    useEffect(() => {
        if (serviceReq && serviceReq.enterpriseId) {
            getEnterpriseById(serviceReq.enterpriseId)
                .then((data) => {
                    if (data) {
                        setRealServiceReq(data);
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
        }
    }, [serviceReq]);

    return serviceReq && realServiceReq ? (
        <EnterpriseUpReqRender enterprise={serviceReq} realEnteprise={realServiceReq} />
    ) : (
        <PageLoader />
    );
};

export default SingleEnterpiseUpReq;
