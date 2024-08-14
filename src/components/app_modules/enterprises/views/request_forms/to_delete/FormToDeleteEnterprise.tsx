"use client";

import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { PageStateContext } from "@/context/PageStateContext";
import TriangleExclamation from "@/icons/TriangleExclamation";
import { Enterprise } from "@/interfaces/Enterprise";
import { getRoute } from "@/utils/parser/ToSpanishEnterprise";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { deleteEnterprise } from "../../../api/EnterpriseRequester";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import TextField from "@/components/form/view/fields/TextField";
import { validateConfirmationEnterpriseName } from "../../../validators/EnterpriseValidator";

interface Props {
    enterprise: Enterprise;
}

const FormToDeleteEnterprise: React.FC<Props> = ({ enterprise }) => {
    const router = useRouter();
    const { loading, isValid, setLoadingAll } = useContext(PageStateContext);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [nameVerification, setNameVerification] = useState(DEFAUL_TEXT_FIELD);

    const onSummit = async () => {
        if (!loading && !formState.loading) {
            if (enterprise && enterprise.id) {
                setLoadingAll(true, setFormState);
                try {
                    await toast.promise(deleteEnterprise(enterprise.id), {
                        pending: `Eliminando empresa`,
                        success: "Empresa eliminada",
                        error: `Error al eliminar la empresa, inténtalo de nuevo por favor`,
                    });
                    /* TODO: make builder for links */
                    router.push(`/enterprise/${getRoute(enterprise.type)}`);
                    setLoadingAll(false, setFormState);
                } catch (e) {
                    setLoadingAll(false, setFormState);
                    window.location.reload();
                }
            }
        }
    };

    return (
        <div
            className={`form-sub-container | margin-top-50 max-width-60 ${
                loading && "loading-section"
            }`}
            data-state={loading ? "loading" : "loaded"}
        >
            <h2 className="text icon-wrapper | red red-icon medium-big bold">
                <TriangleExclamation />
                Zona Peligrosa
            </h2>
            <p className="text | light">
                Esta acción no se puede revertir. No se afectara los datos que
                están relacionados con esta empresa.
            </p>
            <p className="text | light">
                Por favor escribe el nombre de la empresa para confirmar su
                eliminacion.
            </p>
            <div className="separator-horizontal"></div>
            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Eliminar empresa",
                            buttonClassStyle: "small-general-button | red",
                        },
                        behavior: {
                            loading: formState.loading,
                            isValid: formState.isValid && isValid,
                        },
                    },
                }}
                behavior={{
                    loading: formState.loading,
                    onSummit: onSummit,
                }}
            >
                <TextField
                    field={{
                        values: nameVerification,
                        setter: setNameVerification,
                        validator: (d) =>
                            validateConfirmationEnterpriseName(
                                d,
                                enterprise.name,
                            ),
                    }}
                    legend="Nombre de la empresa | Confirmacion"
                />
            </BaseForm>
        </div>
    );
};

export default FormToDeleteEnterprise;
