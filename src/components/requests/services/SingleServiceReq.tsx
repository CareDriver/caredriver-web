"use client";
import PageLoader from "@/components/PageLoader";
import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { userReqTypes, UserRequest } from "@/interfaces/UserRequest";
import {
    getServiceCollection,
    getServiceReqById,
    MIN_NUM_OF_APPROVALS,
    numOfApprovals,
} from "@/utils/requests/services/ServicesRequester";
import { CollectionReference } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PersonalData from "../data_renderer/personal_data/PersonalData";
import SelfieRenderer from "../data_renderer/personal_data/SelfieRenderer";
import VehiclesRenderer from "../data_renderer/vehicle/VehiclesRenderer";
import ReqButtonRes from "../data_renderer/ReqButtonRes";

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

    const approve = () => {};

    const decline = () => {};

    useEffect(() => {
        getServiceReqById(reqId, collection)
            .then((data) => {
                if (data) {
                    setServiceReq(data);
                } else {
                    router.push(`/admin/requests/services/${type}`);
                    toast.error("Peticion no encontrada");
                }
            })
            .catch((e) => {
                router.push(`/admin/requests/services/${type}`);
                toast.error("Peticion no encontrada");
            });
    }, []);

    return serviceReq ? (
        <section>
            <div>
                <h1>Solicitud para ser {userReqTypes[type]}</h1>
                <h5>
                    <PersonCircleCheck />
                    {numOfApprovals(serviceReq)}/{MIN_NUM_OF_APPROVALS} Aprobaciones
                </h5>

                <PersonalData
                    location={serviceReq.location}
                    name={serviceReq.newFullName}
                    photo={serviceReq.newProfilePhotoImgUrl}
                />
                <SelfieRenderer image={serviceReq.realTimePhotoImgUrl} />
                {serviceReq.vehicles && (
                    <VehiclesRenderer vehicles={serviceReq.vehicles} />
                )}

                <ReqButtonRes
                    onApprove={approve}
                    onDecline={decline}
                    loading={reviewState.loading}
                />
            </div>
        </section>
    ) : (
        <PageLoader />
    );
};

export default SingleServiceReq;
