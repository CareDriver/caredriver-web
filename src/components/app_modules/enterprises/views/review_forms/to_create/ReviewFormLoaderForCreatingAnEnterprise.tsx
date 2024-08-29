"use client";

import { Enterprise } from "@/interfaces/Enterprise";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReviewFormForCreatingAnEnterprise from "./ReviewFormForCreatingAnEnterprise";
import PageLoading from "@/components/loaders/PageLoading";
import { ServiceType } from "@/interfaces/Services";
import { routeToRequestsToEditEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";

const ReviewFormLoaderForCreatingAnEnterprise = ({
    reqId,
    type,
}: {
    reqId: string;
    type: ServiceType;
}) => {
    const [serviceReq, setServiceReq] = useState<Enterprise | null>(null);
    const router = useRouter();

    useEffect(() => {
        getEnterpriseById(reqId)
            .then((data) => {
                if (data) {
                    setServiceReq(data);
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

    return serviceReq ? (
        <ReviewFormForCreatingAnEnterprise enterprise={serviceReq} />
    ) : (
        <PageLoading />
    );
};

export default ReviewFormLoaderForCreatingAnEnterprise;
