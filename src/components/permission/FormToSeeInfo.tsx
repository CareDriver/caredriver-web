"use client";

import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ChangeEvent, SyntheticEvent, useContext, useEffect, useState } from "react";
import PopupForm from "../form/PopupForm";
import {
    isValidChangeReason,
    isValidComplainId,
} from "@/utils/validator/debt/DebtValidator";
import { UserRole } from "@/interfaces/UserInterface";
import { setVisitedToday, wasAlreadyVisited } from "@/utils/temp_storage/VisitedHandler";
import { saveReasonForInfo } from "@/utils/requests/ReasonForInfoRequester";
import { ReasonForInformationInterface } from "@/interfaces/ReasonsForInformation";
import { nanoid } from "nanoid";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";

const FormToSeeInfo = ({
    target,
    id,
    children,
}: {
    target: string;
    id: string;
    children: React.ReactNode;
}) => {
    const { loadingUser, user } = useContext(AuthContext);
    const [isAbleToSee, setAbleToSee] = useState({
        isChecking: true,
        isAbleToContinue: false,
    });
    const router = useRouter();
    const [formState, setFormState] = useState({
        loading: false,
        isValidForm: false,
    });
    const [formData, setFormData] = useState<{
        complaintId: {
            value: string;
            message: string | null;
        };
        reason: {
            value: string;
            message: string | null;
        };
    }>({
        complaintId: {
            value: "",
            message: null,
        },
        reason: {
            value: "",
            message: null,
        },
    });

    const cancelar = () => {
        // router.push("/redirector");
        router.back();
    };

    const saveReq = async (infoDoc: ReasonForInformationInterface) => {
        await saveReasonForInfo(infoDoc.id, infoDoc);
        setVisitedToday(target, id);
    };

    const continuar = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!formState.loading) {
            setFormState({
                ...formState,
                loading: true,
            });

            const validReason = isValidReason();
            const validId = isValidID();

            if ((validReason || validId) && user.data && user.data.id) {
                const docId = nanoid();
                var infoDoc: ReasonForInformationInterface = {
                    id: docId,
                    userId: user.data.id,
                    informationViewDate: Timestamp.fromDate(new Date()),
                };

                if (validReason) {
                    infoDoc = {
                        ...infoDoc,
                        justification: formData.reason.value,
                    };
                }

                if (validId) {
                    infoDoc = {
                        ...infoDoc,
                        complaintId: formData.complaintId.value,
                    };
                }

                try {
                    await toast.promise(saveReq(infoDoc), {
                        pending: "Guardando justificativo",
                        success: "Justificativo guardado",
                        error: "Error al guardar el justificativo, inténtalo de nuevo por favor",
                    });
                    setAbleToSee({
                        isChecking: false,
                        isAbleToContinue: true,
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };

    const verifyComplaintId = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const { isValid, message } = isValidComplainId(newValue);
        setFormData({
            ...formData,
            complaintId: {
                value: newValue,
                message: isValid ? null : message,
            },
        });
    };

    const verifyReason = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const { isValid, message } = isValidChangeReason(newValue);
        setFormData({
            ...formData,
            reason: {
                value: newValue,
                message: isValid ? null : message,
            },
        });
    };

    const isValidReason = () => {
        return formData.reason.value.trim().length > 0 && !formData.reason.message;
    };

    const isValidID = () => {
        return (
            formData.complaintId.value.trim().length > 0 && !formData.complaintId.message
        );
    };

    const isAtLeastOneValid = (): boolean => {
        return isValidReason() || isValidID();
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValidForm: isAtLeastOneValid(),
        });
    }, [formData]);

    useEffect(() => {
        if (!loadingUser && user.data) {
            if (user.data.role !== UserRole.SupportTwo || wasAlreadyVisited(target, id)) {
                setAbleToSee({
                    isChecking: false,
                    isAbleToContinue: true,
                });
            } else {
                setAbleToSee({
                    isChecking: false,
                    isAbleToContinue: false,
                });
            }
        }
    }, [loadingUser]);

    return (
        (!loadingUser || isAbleToSee.isChecking) &&
        (isAbleToSee.isAbleToContinue ? (
            <>{children}</>
        ) : (
            <PopupForm
                close={cancelar}
                onSummit={continuar}
                doSomethingText="Continuar"
                isOpen={true}
                isSecondButtonAble={formState.isValidForm}
                loading={formState.loading}
            >
                <div className="margin-bottom-25">
                    <div>
                        <h2 className="text | big-medium bolder">
                            Justificación para continuar
                        </h2>
                        <p className="text | light">
                            Necesitas escribir una justificación para ver esta
                            información, por favor llena uno o ambos de los siguientes
                            campos.
                        </p>
                        <p className="text | light">
                            <b>
                                Podrás ver esta información hasta el final del dia de hoy
                                o hasta salgas de tu cuenta
                            </b>
                        </p>
                    </div>

                    <fieldset
                        className="form-section | margin-top-25"
                        data-state={formState.loading ? "loading" : "loaded"}
                    >
                        <input
                            type="text"
                            placeholder=""
                            className="form-section-input"
                            value={formData.reason.value}
                            onChange={verifyReason}
                        />
                        <legend className="form-section-legend">
                            Justificación {isValidID() && "(Opcional)"}
                        </legend>
                        {formData.reason.message && (
                            <small>
                                {formData.reason.message} {isValidID() && "(Opcional)"}
                            </small>
                        )}
                    </fieldset>
                    <fieldset
                        className="form-section | margin-top-15"
                        data-state={formState.loading ? "loading" : "loaded"}
                    >
                        <input
                            type="text"
                            placeholder=""
                            className="form-section-input"
                            value={formData.complaintId.value}
                            onChange={verifyComplaintId}
                        />
                        <legend className="form-section-legend">
                            ID de queja {isValidReason() && "(Opcional)"}
                        </legend>
                        {formData.complaintId.message && (
                            <small>
                                {formData.complaintId.message}{" "}
                                {isValidReason() && "(Opcional)"}
                            </small>
                        )}
                    </fieldset>
                </div>
            </PopupForm>
        ))
    );
};

export default FormToSeeInfo;
