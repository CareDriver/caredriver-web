"use client";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import PageLoader from "@/components/PageLoader";
import { UserInterface } from "@/interfaces/UserInterface";
import PersonalDataV2 from "../../data_renderer/personal_data/PersonalDataV2";
import { getUserById, updateUser } from "@/utils/requests/UserRequester";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReqButtonRes from "../../data_renderer/form/ReqButtonRes";
import ImageRenderer from "../../data_renderer/form/ImageRenderer";
import UserStatusIndicatorV2 from "../../data_renderer/form/UserStatusIndicatorV2";
import UserVerifierPrompter from "../../data_renderer/form/UserVerifierPrompter";
import { deleteBrandingReq, getBrandingReqById } from "@/utils/requests/BrandingReqs";
import { BrandingRequest } from "@/interfaces/BrandingInterface";
import { Timestamp } from "firebase/firestore";
import Bullhorn from "@/icons/Bullhorn";
import { getOneMonthAhead } from "@/utils/parser/ForDate";

const SingleBrandingReq = ({ reqId }: { reqId: string }) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] = useState({
        loading: false,
    });
    const [req, setReq] = useState<BrandingRequest | null>(null);
    const [userReq, setUserReq] = useState<UserInterface | null>(null);
    const router = useRouter();

    const faildRedirect = (reason: string) => {
        toast.error(reason);
        router.push("/admin/requests/userinfo/branding");
    };

    const fetchReq = async () => {
        try {
            const reqRes = await getBrandingReqById(reqId);
            if (reqRes) {
                setReq(reqRes);
            } else {
                faildRedirect("Petición no encontrada");
            }
        } catch (e) {
            faildRedirect("Petición no encontrada");
        }
    };

    const fetchUserReq = async () => {
        if (req) {
            try {
                const userRes = await getUserById(req.userId);
                if (userRes) {
                    setUserReq(userRes);
                } else {
                    faildRedirect("No se encontró al usuario");
                }
            } catch (e) {
                faildRedirect("Petición no encontrada");
            }
        }
    };

    useEffect(() => {
        fetchReq();
    }, []);

    useEffect(() => {
        fetchUserReq();
    }, [req]);

    const review = async (wasApproved: boolean) => {
        if (user.data && req && userReq && userReq.id) {
            setReviewState({
                ...reviewState,
                loading: true,
            });
            try {
                if (wasApproved) {
                    const date = Timestamp.fromDate(new Date());
                    await updateUser(userReq.id, {
                        branding: {
                            dateLimit: Timestamp.fromDate(getOneMonthAhead()),
                            lastBrandingConfirmation: date,
                            brandingConfirmations: userReq.branding?.brandingConfirmations
                                ? [...userReq.branding?.brandingConfirmations, date]
                                : [date],
                        },
                    });
                }

                if (user.data && user.data.id) {
                    await deleteBrandingReq(req.id, user.data.id, wasApproved);
                }
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
                router.push("/admin/requests/userinfo/branding");
            } catch (e) {
                setReviewState({
                    ...reviewState,
                    loading: false,
                });
            }
        }
    };

    const approve = async () => {
        await toast.promise(review(true), {
            pending: "Aprobando verificación del branding",
            success: "Verificación del branding aprobada",
            error: "Error al aprobar la verificación, inténtalo de nuevo por favor",
        });
    };

    const decline = async () => {
        await toast.promise(review(false), {
            pending: "Rechazando verificación del branding",
            success: "Verificación del branding rechazada",
            error: "Error al rechazar la verificación, inténtalo de nuevo por favor",
        });
    };

    return req ? (
        <div className="service-form-wrapper | max-width-60">
            <h1 className="text | big bolder">Solicitud para verificar branding</h1>

            <UserVerifierPrompter userData={userReq} />

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

            <h2 className="text icon-wrapper | medium-big bold margin-top-25 margin-bottom-25">
                <Bullhorn />
                Foto de verificación del branding
            </h2>
            <ImageRenderer
                url={req.brandingImage}
                placeholder="Branding"
                isCircle={false}
                noFoundDescr={"No se ha encontrado la foto de confirmacion del branding"}
            />

            {userReq && <UserStatusIndicatorV2 user={userReq} />}

            <ReqButtonRes
                onApprove={approve}
                onDecline={decline}
                loading={reviewState.loading || userReq === null}
                stateB1={true}
                stateB2={userReq !== null}
                alreadyReviewed={!req.active}
            />
        </div>
    ) : (
        <PageLoader />
    );
};

export default SingleBrandingReq;
