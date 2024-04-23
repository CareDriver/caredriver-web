"use client";
import PageLoader from "@/components/PageLoader";
import { UserRequest } from "@/interfaces/UserRequest";
import {
    getServiceCollection,
    getServiceReqById,
} from "@/utils/requests/services/ServicesRequester";
import { CollectionReference } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DriveServiceReq from "./drive/DriveServiceReq";
import MechanicServiceReq from "./mechanic/MechanicServiceReq";

const SingleServiceReq = ({
    reqId,
    type,
}: {
    reqId: string;
    type: "driver" | "mechanic" | "tow";
}) => {
    const [serviceReq, setServiceReq] = useState<UserRequest | null>(null);
    const [reviewState, setReviewState] = useState({
        loading: false,
        reviewed: false,
    });
    const collection: CollectionReference = getServiceCollection(type);
    const router = useRouter();

    useEffect(() => {
        getServiceReqById(reqId, collection)
            .then((data) => {
                if (data) {
                    setServiceReq(data);
                } else {
                    router.push(`/admin/requests/services/drive`);
                    toast.error("Peticion no encontrada");
                }
            })
            .catch((e) => {
                router.push(`/admin/requests/services/drive`);
                toast.error("Peticion no encontrada");
            });
    }, []);

    const getSingleServiceReq = () => {
        if (serviceReq) {
            switch (type) {
                case "driver":
                    return <DriveServiceReq serviceReq={serviceReq} />;
                case "mechanic":
                    return <MechanicServiceReq serviceReq={serviceReq} />;
            }
        }
    };

    return serviceReq ? getSingleServiceReq() : <PageLoader />;
};

export default SingleServiceReq;
