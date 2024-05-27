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

    const continuar = async (e: SyntheticEvent) => {
        e.preventDefault();
        setFormState({
            ...formState,
            loading: true,
        });
        setVisitedToday(target, id);
        console.log("\nchecking....");
        console.log(wasAlreadyVisited(target, id));
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
            if (user.data.role === UserRole.Admin || wasAlreadyVisited(target, id)) {
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
                            Justificacion para continuar
                        </h2>
                        <p className="text | light">
                            Necesitas escribir una justificacion para ver esta
                            informacion, por favor llena uno o ambos de los siguientes
                            campos.
                        </p>
                        <p className="text | light">
                            Solo necesitas llenar esta informacion{" "}
                            <b>una sola vez por dia</b> para ver esta informacion
                            especifica.
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
                            Justificacion {isValidID() && "(Opcional)"}
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
