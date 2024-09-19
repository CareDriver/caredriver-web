"use client";

import { Enterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "../../data_renderers/EnterpriseRenderer";
import { useContext, useState } from "react";
import {
    aproveEnterpriseReq,
    declineEnterpriseReq,
} from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteFile } from "@/utils/requesters/FileUploader";
import {
    ENTERPRISE_TO_SPANISH,
    ENTERPRISE_TO_SPANISH_WITH_DEFINITE_ARTICLE,
    ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE,
} from "../../../utils/EnterpriseSpanishTranslator";
import BaseFormWithTwoButtons from "@/components/form/view/forms/BaseFormWithTwoButtons";
import { routeToRequestsToEditEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import { routeToNoFound } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";

const ReviewFormForCreatingAnEnterprise = ({
    enterprise,
}: {
    enterprise: Enterprise;
}) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] = useState({
        loading: false,
        reviewed: false,
    });
    const router = useRouter();

    const approve = async () => {
        if (!reviewState.loading) {
            if (user && user.id && enterprise.id) {
                setReviewState({
                    ...reviewState,
                    loading: true,
                });
                try {
                    await toast.promise(
                        aproveEnterpriseReq(enterprise.id, user.id),
                        {
                            pending: `Aprobando ${
                                ENTERPRISE_TO_SPANISH[enterprise.type]
                            }`,
                            success: "Aprobado",
                            error: `Error al aprobar ${
                                ENTERPRISE_TO_SPANISH_WITH_DEFINITE_ARTICLE[
                                    enterprise.type
                                ]
                            }`,
                        },
                    );

                    router.push(routeToNoFound());
                } catch (e) {
                    console.log(e);
                    setReviewState({
                        ...reviewState,
                        loading: false,
                    });
                }
            }
        }
    };

    const decline = async () => {
        if (!reviewState.loading) {
            if (user && user.id && enterprise.id) {
                setReviewState({
                    ...reviewState,
                    loading: true,
                });
                try {
                    await toast.promise(deleteFile(enterprise.logoImgUrl.ref), {
                        pending: "Eliminado el logo",
                        success: "Logo eliminado",
                        error: "Error al eliminar el logo, inténtalo de nuevo por favor",
                    });

                    await toast.promise(
                        declineEnterpriseReq(enterprise, user.id),
                        {
                            pending: `Rechazando ${
                                ENTERPRISE_TO_SPANISH[enterprise.type]
                            }`,
                            success: "Rechazado",
                            error: `Error al rechazar ${
                                ENTERPRISE_TO_SPANISH_WITH_DEFINITE_ARTICLE[
                                    enterprise.type
                                ]
                            }`,
                        },
                    );
                    router.push(
                        routeToRequestsToEditEnterpriseAsAdmin(enterprise.type),
                    );
                } catch (e) {
                    console.log(e);
                    setReviewState({
                        ...reviewState,
                        loading: false,
                    });
                }
            }
        }
    };

    return (
        <section className="service-form-wrapper | max-width-60">
            <h1 className="text | big-medium bolder margin-bottom-25 capitalize">
                Solicitud para crear{" "}
                {ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE[enterprise.type]}
            </h1>
            <BaseFormWithTwoButtons
                content={{
                    firstButton: {
                        content: {
                            legend: "Rechazar",
                            buttonClassStyle:
                                reviewState.reviewed || !enterprise.active
                                    ? "hidden"
                                    : "general-button gray",
                            loaderClassStyle: "loader-gray",
                        },
                        behavior: {
                            loading: reviewState.loading,
                            setLoading: (l) =>
                                setReviewState((prev) => ({
                                    ...prev,
                                    loading: l,
                                })),
                            isValid: !reviewState.reviewed,
                            action: decline,
                        },
                    },
                    secondButton: {
                        content: {
                            legend: "Aprobar",
                            buttonClassStyle:
                                reviewState.reviewed || !enterprise.active
                                    ? "hidden"
                                    : undefined,
                        },
                        behavior: {
                            loading: reviewState.loading,
                            setLoading: (l) =>
                                setReviewState((prev) => ({
                                    ...prev,
                                    loading: l,
                                })),
                            isValid: !reviewState.reviewed,
                            action: approve,
                        },
                    },
                }}
                behavior={{
                    loading: reviewState.loading,
                }}
            >
                <EnterpriseRenderer enterprise={enterprise} />
                {!enterprise.aproved && enterprise.active && (
                    <p className="text | light margin-top-25">
                        Se eliminaran los datos que ya{" "}
                        <b>no seran necesarios</b> si rechazas la solicitud
                    </p>
                )}
            </BaseFormWithTwoButtons>
        </section>
    );
};

export default ReviewFormForCreatingAnEnterprise;
