"use client";

import TriangleExclamation from "@/icons/TriangleExclamation";
import { SyntheticEvent, useContext, useState } from "react";
import { UserInterface } from "@/interfaces/UserInterface";
import { toast } from "react-toastify";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import { useRouter } from "next/navigation";
import { saveActionOnUser } from "@/components/app_modules/users/api/ActionOnUserRegister";
import { ActionOnUserPerformed } from "@/interfaces/ActionOnUserInterface";
import { Timestamp } from "firebase/firestore";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { PageStateContext } from "@/context/PageStateContext";
import { genDocId } from "@/utils/generators/IdGenerator";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import Popup from "@/components/modules/Popup";
import BaseForm from "@/components/form/view/forms/BaseForm";
import TextField from "@/components/form/view/fields/TextField";
import { isValidChangeReason } from "@/components/app_modules/users/validators/for_data/BalanceValidator";
import { validateEmialWithComparison } from "../../../validators/for_confirmations/DataConfirmationValidator";
import { routeToAllUsersAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";

interface Form {
    confirmation: TextFieldForm;
    reason: TextFieldForm;
}

const DEFAULT_FORM: Form = {
    reason: DEFAUL_TEXT_FIELD,
    confirmation: DEFAUL_TEXT_FIELD,
};

interface Props {
    user: UserInterface;
    adminUser: UserInterface;
}

const FormToDeleteUserByAdmin: React.FC<Props> = ({ user, adminUser }) => {
    const router = useRouter();
    const [isOpenPopup, setOpenPopup] = useState(false);
    const { loading, setLoadingAll } = useContext(PageStateContext);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [form, setForm] = useState<Form>(DEFAULT_FORM);

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!formState.loading) {
            setLoadingAll(true, setFormState);

            if (user.id && adminUser.id) {
                const DOC_ID = genDocId();

                await toast.promise(
                    saveActionOnUser(DOC_ID, {
                        id: DOC_ID,
                        action: ActionOnUserPerformed.Deleted,
                        datetime: Timestamp.now(),
                        performedById: adminUser.id,
                        userId: user.id,
                        traceId: genDocId(),
                        reason: form.reason.value,
                    }),
                    {
                        pending: "Registrando acción",
                        success: "Acción en el usuario registrada",
                        error: "Error al registrar acción en el usuario",
                    },
                );

                await deleteUser();
                setLoadingAll(false, setFormState);

                window.location.reload();
            } else {
                toast.error("No se puede encontrar al usuario");
                setLoadingAll(false, setFormState);
            }
        }
    };

    const deleteUser = async () => {
        if (user.id) {
            try {
                await toast.promise(
                    updateUser(user.id, {
                        deleted: true,
                    }),
                    {
                        pending: "Eliminando al usuario",
                        success: "Usuario eliminado",
                        error: "Error al eliminar al usuario, inténtalo de nuevo",
                    },
                );
                router.push(routeToAllUsersAsAdmin());
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <div className={`form-sub-container | margin-top-50 max-width-60`}>
            <h2 className="text icon-wrapper | red red-icon medium-big bold">
                <TriangleExclamation />
                Zona Peligrosa
            </h2>
            <p>
                Esta acción no se puede revertir, aunque no se afectara los
                datos que están relacionados con este. Por favor escribe el
                correo del usuario para confirmar su eliminacion.
            </p>
            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Eliminar usuario",
                        },
                        behavior: {
                            loading: formState.loading,
                            isValid: formState.isValid,
                        },
                    },
                }}
                behavior={{
                    loading: formState.loading || loading,
                    onSummit: async () => setOpenPopup(true),
                }}
            >
                <TextField
                    field={{
                        values: form.reason,
                        setter: (d) =>
                            setForm((prev) => ({ ...prev, reason: d })),
                        validator: (d) =>
                            validateEmialWithComparison(d, user.email),
                    }}
                    legend={"Correo del usuario"}
                />
            </BaseForm>
            <Popup isOpen={isOpenPopup} close={() => setOpenPopup(false)}>
                <div className="margin-bottom-25">
                    <h2 className="text | big-medium bolder">
                        Razón para eliminar al usuario
                    </h2>
                    <p className="text | light">
                        Escribe la razón por la cual estas eliminando al
                        usuario, recuerda que esta acción sera registrada.
                    </p>
                </div>

                <BaseForm
                    content={{
                        button: {
                            content: {
                                legend: "Eliminar usuario",
                            },
                            behavior: {
                                loading: formState.loading,
                                isValid: formState.isValid,
                            },
                        },
                    }}
                    behavior={{
                        loading: formState.loading || loading,
                        onSummit: handleSubmit,
                    }}
                >
                    <TextField
                        field={{
                            values: form.reason,
                            setter: (d) =>
                                setForm((prev) => ({
                                    ...prev,
                                    changeReason: d,
                                })),
                            validator: isValidChangeReason,
                        }}
                        legend="Razón de la acción"
                    />
                </BaseForm>
            </Popup>
        </div>
    );
};

export default FormToDeleteUserByAdmin;
