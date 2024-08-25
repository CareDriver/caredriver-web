"use client";

import { Enterprise, ReqEditEnterprise } from "@/interfaces/Enterprise";
import { getEditEnterpriseReqById } from "@/components/app_modules/enterprises/api/EditEnterpriseReq";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReviewFormForEditingAnEnterprise from "./ReviewFormForEditingAnEnterprise";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import PageLoading from "@/components/loaders/PageLoading";
import { ServiceType } from "@/interfaces/Services";
import { routeToRequestsToEditEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";

interface Props {
    reqId: string;
    type: ServiceType;
}

const ReviewFormForEditingAnEnterpriseWithLoader: React.FC<Props> = ({
    reqId,
    type,
}) => {
    const [enterpriseEditDoc, setEnterpriseEditDoc] =
        useState<ReqEditEnterprise | null>(null);
    const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
    const router = useRouter();

    useEffect(() => {
        getEditEnterpriseReqById(reqId)
            .then((data) => {
                if (data) {
                    setEnterpriseEditDoc(data);
                } else {
                    router.push(routeToRequestsToEditEnterpriseAsAdmin(type));
                    toast.error("Petición no encontrada");
                }
            })
            .catch((e) => {
                router.push(routeToRequestsToEditEnterpriseAsAdmin(type));
                toast.error("Petición no encontrada");
            });
    }, []);

    useEffect(() => {
        if (enterpriseEditDoc && enterpriseEditDoc.enterpriseId) {
            getEnterpriseById(enterpriseEditDoc.enterpriseId)
                .then((data) => {
                    if (data) {
                        setEnterprise(data);
                    } else {
                        router.push(
                            routeToRequestsToEditEnterpriseAsAdmin(type),
                        );
                        toast.error("Petición no encontrada");
                    }
                })
                .catch((e) => {
                    router.push(routeToRequestsToEditEnterpriseAsAdmin(type));
                    toast.error("Petición no encontrada");
                });
        }
    }, [enterpriseEditDoc]);

    return enterpriseEditDoc && enterprise ? (
        <ReviewFormForEditingAnEnterprise
            enterpriseEditDoc={enterpriseEditDoc}
            enteprise={enterprise}
        />
    ) : (
        <PageLoading />
    );
};

export default ReviewFormForEditingAnEnterpriseWithLoader;
