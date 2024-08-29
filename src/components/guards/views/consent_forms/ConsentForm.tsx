"use client";

import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { isValidChangeReason } from "@/components/app_modules/users/validators/for_data/BalanceValidator";
import { UserRole } from "@/interfaces/UserInterface";
import {
    setVisitedToday,
    wasAlreadyVisited,
} from "@/utils/encryptors/EncryptionGeneratorByDate";
import { saveReasonForInfo } from "@/components/guards/api/ReasonForInfoRequester";
import { ReasonForInformationInterface } from "@/interfaces/ReasonsForInformation";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import TextField from "@/components/form/view/fields/TextField";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import Popup from "@/components/modules/Popup";
import BaseFormWithTwoButtons from "@/components/form/view/forms/BaseFormWithTwoButtons";
import { genDocId } from "@/utils/generators/IdGenerator";

interface Form {
    complaintId: TextFieldForm;
    reason: TextFieldForm;
}

const DEFAULT_FORM: Form = {
    complaintId: DEFAUL_TEXT_FIELD,
    reason: DEFAUL_TEXT_FIELD,
};

interface Props {
    id: string;
    moduleTarget: string;
    children: React.ReactNode;
}

const ConsentForm: React.FC<Props> = ({ id, moduleTarget, children }) => {
    const { checkingUserAuth, user } = useContext(AuthContext);
    const [isAbleToSee, setAbleToSee] = useState({
        isChecking: true,
        isAbleToContinue: false,
    });
    const router = useRouter();
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [form, setForm] = useState<Form>(DEFAULT_FORM);

    const cancelar = async () => {
        router.back();
    };

    const saveReq = async (infoDoc: ReasonForInformationInterface) => {
        await saveReasonForInfo(infoDoc.id, infoDoc);
        setVisitedToday(moduleTarget, id);
    };

    const sendConsent = async () => {
        const validReason = isValidReason();
        const validId = isValidID();

        if ((validReason || validId) && user && user.id) {
            const docId = genDocId();
            var infoDoc: ReasonForInformationInterface = {
                id: docId,
                userId: user.id,
                informationViewDate: Timestamp.now(),
            };

            if (validReason) {
                infoDoc = {
                    ...infoDoc,
                    justification: form.reason.value,
                };
            }

            if (validId) {
                infoDoc = {
                    ...infoDoc,
                    complaintId: form.complaintId.value,
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
    };

    const isValidReason = () => {
        return form.reason.value.trim().length > 0 && !form.reason.message;
    };

    const isValidID = () => {
        return (
            form.complaintId.value.trim().length > 0 &&
            !form.complaintId.message
        );
    };

    const isAtLeastOneValid = (): boolean => {
        return isValidReason() || isValidID();
    };

    useEffect(() => {
        setFormState((prev) => ({
            ...prev,
            isValid: isAtLeastOneValid(),
        }));
    }, [form]);

    useEffect(() => {
        if (!checkingUserAuth && user) {
            if (
                user.role !== UserRole.SupportTwo ||
                wasAlreadyVisited(moduleTarget, id)
            ) {
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
    }, [checkingUserAuth]);

    return (
        (!checkingUserAuth || isAbleToSee.isChecking) &&
        (isAbleToSee.isAbleToContinue ? (
            <>{children}</>
        ) : (
            <Popup isOpen={true} close={cancelar}>
                <div className="margin-bottom-25">
                    <div>
                        <h2 className="text | big-medium bolder">
                            Justificación para continuar
                        </h2>
                        <p className="text | light">
                            Necesitas escribir una justificación para ver esta
                            información, por favor llena uno o ambos de los
                            siguientes campos.
                        </p>
                        <p className="text | light">
                            <b>
                                Podrás ver esta información hasta el final del
                                dia de hoy o hasta salgas de tu cuenta
                            </b>
                        </p>
                    </div>
                    <BaseFormWithTwoButtons
                        content={{
                            firstButton: {
                                content: {
                                    legend: "Cancelar",
                                    buttonClassStyle: "general-button gray",
                                    loaderClassStyle: "loader-gray",
                                },
                                behavior: {
                                    action: cancelar,
                                    loading: formState.loading,
                                    setLoading: (l) =>
                                        setFormState((prev) => ({
                                            ...prev,
                                            loading: l,
                                        })),
                                },
                            },
                            secondButton: {
                                content: {
                                    legend: "Continuar",
                                },
                                behavior: {
                                    action: sendConsent,
                                    loading: formState.loading,
                                    setLoading: (l) =>
                                        setFormState((prev) => ({
                                            ...prev,
                                            loading: l,
                                        })),
                                },
                            },
                        }}
                        behavior={{
                            loading: formState.loading,
                        }}
                    >
                        <TextField
                            field={{
                                values: form.reason,
                                setter: (d) =>
                                    setForm((prev) => ({ ...prev, reason: d })),
                                validator: isValidChangeReason,
                            }}
                            legend={`Justificación ${
                                isValidID() && "(Opcional)"
                            }`}
                        />
                        <TextField
                            field={{
                                values: form.complaintId,
                                setter: (d) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        complaintId: d,
                                    })),
                                validator: isValidChangeReason,
                            }}
                            legend={`ID de queja ${
                                isValidReason() && "(Opcional)"
                            }`}
                        />
                    </BaseFormWithTwoButtons>
                </div>
            </Popup>
        ))
    );
};

export default ConsentForm;
