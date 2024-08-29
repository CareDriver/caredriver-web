"use client";
import { UserRequest } from "@/interfaces/UserRequest";
import {
    getServiceCollection,
    getServiceReqById,
} from "@/components/app_modules/server_users/api/ServicesRequester";
import { CollectionReference } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DriverReviewForm from "./to_be_driver/DriverReviewForm";
import MechanicReviewForm from "./to_be_mechanic/MechanicReviewForm";
import CraneOperatorReviewForm from "./to_be_crane_operator/CraneOperatorReviewForm";
import "@/styles/modules/form.css";
import LaundererReviewForm from "./to_be_launderer/LaundererReviewForm";
import { ServiceType } from "@/interfaces/Services";
import PageLoading from "@/components/loaders/PageLoading";
import { routeToRequestsToBeUserServerAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";

const ReviewFormToBeServerUserWithLoader = ({
    reqId,
    type,
}: {
    reqId: string;
    type: ServiceType;
}) => {
    const [serviceReq, setServiceReq] = useState<UserRequest | null>(null);
    const collection: CollectionReference = getServiceCollection(type);
    const router = useRouter();

    useEffect(() => {
        getServiceReqById(reqId, collection)
            .then((data) => {
                if (data) {
                    setServiceReq(data);
                } else {
                    router.push(routeToRequestsToBeUserServerAsAdmin(type));
                    toast.error("Petición no encontrada");
                }
            })
            .catch((e) => {
                router.push(routeToRequestsToBeUserServerAsAdmin(type));
                toast.error("Petición no encontrada");
            });
    }, []);

    const renderReviewForm = () => {
        if (serviceReq) {
            switch (type) {
                case "driver":
                    return <DriverReviewForm serviceReq={serviceReq} />;
                case "mechanical":
                    return <MechanicReviewForm serviceReq={serviceReq} />;
                case "tow":
                    return <CraneOperatorReviewForm serviceReq={serviceReq} />;
                case "laundry":
                    return <LaundererReviewForm serviceReq={serviceReq} />;
            }
        }
    };

    return serviceReq ? renderReviewForm() : <PageLoading />;
};

export default ReviewFormToBeServerUserWithLoader;
