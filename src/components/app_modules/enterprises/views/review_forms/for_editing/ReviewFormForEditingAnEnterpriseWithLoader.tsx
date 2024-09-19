"use client";

import { Enterprise, ReqEditEnterprise } from "@/interfaces/Enterprise";
import { getReqToEditEnterpriseInRealTime } from "@/components/app_modules/enterprises/api/EditEnterpriseReq";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReviewFormForEditingAnEnterprise from "./ReviewFormForEditingAnEnterprise";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import PageLoading from "@/components/loaders/PageLoading";
import { ServiceType } from "@/interfaces/Services";
import { routeToRequestsToEditEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import { Unsubscribe } from "firebase/firestore";

interface Props {
    reqId: string;
    type: ServiceType;
}

const ReviewFormForEditingAnEnterpriseWithLoader: React.FC<Props> = ({
    reqId,
    type,
}) => {
    const [enterpriseEdited, setEnterpriseEdited] =
        useState<ReqEditEnterprise | null>(null);
    const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
    const router = useRouter();

    useEffect(() => {
        let unsubscribe: Unsubscribe | undefined;

        const onNotFound = () => {
            router.push(routeToRequestsToEditEnterpriseAsAdmin(type));
            toast.error("Petición no encontrada");
        };

        getReqToEditEnterpriseInRealTime(reqId, {
            onFound: setEnterpriseEdited,
            onNotFound: onNotFound,
        })
            .then((u) => {
                unsubscribe = u;
            })
            .catch(() => onNotFound());

        return () => unsubscribe && unsubscribe();
    }, []);

    useEffect(() => {
        if (enterpriseEdited && enterpriseEdited.enterpriseId) {
            getEnterpriseById(enterpriseEdited.enterpriseId)
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
    }, [enterpriseEdited]);

    return enterpriseEdited && enterprise ? (
        <ReviewFormForEditingAnEnterprise
            enterpriseEditDoc={enterpriseEdited}
            enteprise={enterprise}
        />
    ) : (
        <PageLoading />
    );
};

export default ReviewFormForEditingAnEnterpriseWithLoader;
