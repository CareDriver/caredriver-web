"use client";
import { AuthContext } from "@/context/AuthContext";
import { LicenseUpdateReq } from "@/interfaces/PersonalDocumentsInterface";
import { useContext, useEffect, useState } from "react";
import LicenseRenderer from "../../data_renderer/vehicle/LicenseRenderer";
import PageLoader from "@/components/PageLoader";
import SelfieRenderer from "../../data_renderer/personal_data/SelfieRenderer";
import { UserInterface } from "@/interfaces/UserInterface";
import PersonalDataV2 from "../../data_renderer/personal_data/PersonalDataV2";
import { getLicenceUpdateReqById } from "@/utils/requests/LicenseUpdaterReq";
import { getUserById } from "@/utils/requests/UserRequester";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import VehicleCategoryRender from "../../data_renderer/vehicle/VehicleCategoryRender";
import ReqButtonRes from "../../data_renderer/form/ReqButtonRes";

const SingleLicenseReq = ({ reqId }: { reqId: string }) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] = useState({
        loading: false,
    });
    const [req, setReq] = useState<LicenseUpdateReq | null>(null);
    const [userReq, setUserReq] = useState<UserInterface | null>(null);
    const router = useRouter();

    const faildRedirect = () => {
        toast.error("Peticion no encontrada");
        router.push("/admin/requests/userinfo/license");
    };

    const fetchReq = async () => {
        try {
            const reqRes = await getLicenceUpdateReqById(reqId);
            if (reqRes) {
                setReq(reqRes);
            } else {
                faildRedirect();
            }
        } catch (e) {
            faildRedirect();
        }
    };

    const fetchUserReq = async () => {
        if (req) {
            try {
                const userRes = await getUserById(req.userId);
                if (userRes) {
                    setUserReq(userRes);
                } else {
                    faildRedirect();
                }
            } catch (e) {
                faildRedirect();
            }
        }
    };

    useEffect(() => {
        fetchReq();
    }, []);

    useEffect(() => {
        fetchUserReq();
    }, [req]);

    const sleep = (milliseconds: number | undefined) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    const approve = async () => {
        setReviewState({
            ...reviewState,
            loading: true,
        });
        await sleep(5000);
        setReviewState({
            ...reviewState,
            loading: false,
        });
    };

    const decline = async () => {
        setReviewState({
            ...reviewState,
            loading: true,
        });
        await sleep(5000);
        setReviewState({
            ...reviewState,
            loading: false,
        });
    };

    return req ? (
        <div className="service-form-wrapper">
            <div className="max-width-60">
                <h1 className="text | big bolder">
                    Solicitud para actualizar una licencia de conducir
                </h1>
            </div>
            {userReq ? (
                <PersonalDataV2
                    location={userReq.location}
                    name={userReq.fullName}
                    photo={userReq.photoUrl}
                    custom={{
                        content: userReq.services.toString().replaceAll(",", " - "),
                        placeholder: "Servicios del usuario",
                    }}
                />
            ) : (
                <span className="loader-green"></span>
            )}
            <VehicleCategoryRender category={req.vehicleType} />
            <LicenseRenderer license={req} />
            <SelfieRenderer image={req.realTimePhotoImgUrl} />
            <ReqButtonRes
                onApprove={approve}
                onDecline={decline}
                loading={reviewState.loading}
            />
        </div>
    ) : (
        <PageLoader />
    );
};

export default SingleLicenseReq;
