"use client";

import { Enterprise, ReqEditEnterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "../../data_renderers/EnterpriseRenderer";
import { useContext, useState } from "react";
import {
    getEnterpriseById,
    updateEnterprise,
} from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteFile } from "@/utils/requesters/FileUploader";
import EnterpriseStatus from "../../modules/EnterpriseStatus";
import { updateUpdateEnterprise } from "@/components/app_modules/enterprises/api/EditEnterpriseReq";
import {
    ENTERPRISE_TO_SPANISH,
    ENTERPRISE_TO_SPANISH_WITH_DEFINITE_ARTICLE,
    ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE,
    ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE,
} from "../../../utils/EnterpriseSpanishTranslator";
import BaseFormWithTwoButtons from "@/components/form/view/forms/BaseFormWithTwoButtons";
import {
    DEFAULT_REVIEW_STATE,
    ReviewState,
} from "@/components/form/models/Reviews";
import { routeToRequestsToEditEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";

interface Props {
    enterpriseEditDoc: ReqEditEnterprise;
    enteprise: Enterprise;
}

const ReviewFormForEditingAnEnterprise: React.FC<Props> = ({
    enterpriseEditDoc,
    enteprise,
}) => {
    const { user } = useContext(AuthContext);
    const [reviewState, setReviewState] =
        useState<ReviewState>(DEFAULT_REVIEW_STATE);
    const router = useRouter();

    const wasReviewed = (): boolean => {
        return reviewState.reviewed || !enterpriseEditDoc.active;
    };

    const updating = async () => {
        await updateEnterprise(enterpriseEditDoc.enterpriseId, {
            name: enterpriseEditDoc.name,
            description: enterpriseEditDoc.description ?? "",
            logoImgUrl: enterpriseEditDoc.logoImgUrl,
            coordinates: enterpriseEditDoc.coordinates,
            phone: enterpriseEditDoc.phone,
            userId: enterpriseEditDoc.userId,
        });

        if (enterpriseEditDoc.id) {
            await updateUpdateEnterprise(enterpriseEditDoc.id, {
                active: false,
            });
        }
    };

    const approve = async () => {
        if (!reviewState.loading) {
            if (user && user.id && enterpriseEditDoc.id) {
                setReviewState((prev) => ({
                    ...prev,
                    loading: true,
                }));
                try {
                    const oldEnterprise = await getEnterpriseById(
                        enterpriseEditDoc.enterpriseId,
                    );
                    if (oldEnterprise) {
                        const logoChanged: boolean =
                            oldEnterprise.logoImgUrl.ref !==
                                enterpriseEditDoc.logoImgUrl.ref &&
                            oldEnterprise.logoImgUrl.url !==
                                enterpriseEditDoc.logoImgUrl.url;

                        if (logoChanged) {
                            await toast.promise(
                                deleteFile(oldEnterprise.logoImgUrl.ref),
                                {
                                    pending: "Remplazando el logo",
                                    success: "Logo remplazado",
                                    error: "Error al remplazar el logo, inténtalo de nuevo por favor",
                                },
                            );
                        }
                        await toast.promise(updating(), {
                            pending: `Editando ${
                                ENTERPRISE_TO_SPANISH_WITH_DEFINITE_ARTICLE[
                                    enterpriseEditDoc.type
                                ]
                            }`,
                            success: "Editado",
                            error: "Error al editar, inténtalo de nuevo por favor",
                        });

                        router.push(
                            routeToRequestsToEditEnterpriseAsAdmin(
                                enterpriseEditDoc.type,
                            ),
                        );
                    } else {
                        toast.error(
                            `${
                                ENTERPRISE_TO_SPANISH[enterpriseEditDoc.type]
                            } para editar no encontrado`,
                        );
                    }
                    setReviewState((prev) => ({
                        ...prev,
                        loading: false,
                    }));
                } catch (e) {
                    setReviewState((prev) => ({
                        ...prev,
                        loading: false,
                    }));
                }
            }
        }
    };

    const decline = async () => {
        if (!reviewState.loading) {
            if (user && user.id && enterpriseEditDoc.id) {
                setReviewState((prev) => ({
                    ...prev,
                    loading: true,
                }));
                try {
                    const oldEnterprise = await getEnterpriseById(
                        enterpriseEditDoc.enterpriseId,
                    );
                    if (oldEnterprise) {
                        const logoChanged: boolean =
                            oldEnterprise.logoImgUrl.ref !==
                                enterpriseEditDoc.logoImgUrl.ref &&
                            oldEnterprise.logoImgUrl.url !==
                                enterpriseEditDoc.logoImgUrl.url;

                        await toast.promise(
                            updateUpdateEnterprise(enterpriseEditDoc.id, {
                                active: false,
                            }),
                            {
                                pending: `Rechazando la edición ${
                                    ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE[
                                        enterpriseEditDoc.type
                                    ]
                                }`,
                                success: "Rechazado",
                                error: `Error al rechazar ${
                                    ENTERPRISE_TO_SPANISH_WITH_DEFINITE_ARTICLE[
                                        enterpriseEditDoc.type
                                    ]
                                }`,
                            },
                        );
                        if (logoChanged) {
                            /* await toast.promise(
                                deleteFile(enterpriseEditDoc.logoImgUrl.ref),
                                {
                                    pending: "Eliminado el logo",
                                    success: "Logo eliminado",
                                    error: "Error al eliminar el logo, inténtalo de nuevo por favor",
                                },
                            ); */
                        }
                        router.push(
                            routeToRequestsToEditEnterpriseAsAdmin(
                                enterpriseEditDoc.type,
                            ),
                        );
                    } else {
                        toast.error(
                            `${
                                ENTERPRISE_TO_SPANISH[enterpriseEditDoc.type]
                            } para editar no encontrado`,
                        );
                    }

                    setReviewState((prev) => ({
                        ...prev,
                        loading: false,
                    }));
                } catch (e) {
                    setReviewState((prev) => ({
                        ...prev,
                        loading: false,
                    }));
                }
            }
        }
    };

    return (
        <section className="service-form-wrapper | max-width-60">
            <h1 className="text | big-medium bold margin-bottom-25 capitalize">
                Solicitud para editar{" "}
                {
                    ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE[
                        enterpriseEditDoc.type
                    ]
                }
            </h1>

            <EnterpriseStatus enterprise={enteprise} />
            <BaseFormWithTwoButtons
                content={{
                    firstButton: {
                        content: {
                            legend: "Rechazar",
                            buttonClassStyle: wasReviewed()
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
                            isValid: !wasReviewed(),
                            action: decline,
                        },
                    },
                    secondButton: {
                        content: {
                            legend: "Aprobar",
                            buttonClassStyle:
                                wasReviewed() || enteprise.deleted
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
                            isValid: !wasReviewed(),
                            action: approve,
                        },
                    },
                }}
                behavior={{
                    loading: reviewState.loading,
                }}
            >
                <EnterpriseRenderer enterprise={enterpriseEditDoc} />
                {!wasReviewed() && (
                    <p className="text | light margin-top-25">
                        Se eliminaran los datos que ya{" "}
                        <b>no seran necesarios</b> si rechazas la solicitud
                    </p>
                )}
            </BaseFormWithTwoButtons>
        </section>
    );
};

export default ReviewFormForEditingAnEnterprise;
