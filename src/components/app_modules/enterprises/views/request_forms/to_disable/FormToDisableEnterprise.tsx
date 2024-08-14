"use client";

import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { PageStateContext } from "@/context/PageStateContext";
import { Enterprise } from "@/interfaces/Enterprise";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { updateEnterprise } from "../../../api/EnterpriseRequester";
import TriangleExclamation from "@/icons/TriangleExclamation";
import BaseForm from "@/components/form/view/forms/BaseForm";
import TextField from "@/components/form/view/fields/TextField";
import { validateConfirmationEnterpriseName } from "../../../validators/EnterpriseValidator";

interface Props {
    enterprise: Enterprise;
}

const FormToDisableEnterprise: React.FC<Props> = ({ enterprise }) => {
    const router = useRouter();
    const { loading, isValid, setLoadingAll } = useContext(PageStateContext);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [nameVerification, setNameVerification] = useState(DEFAUL_TEXT_FIELD);

    const toggleDisableEnterprise = async () => {
        if (!loading && !formState.loading) {
            if (enterprise.id) {
                setLoadingAll(true, setFormState);

                try {
                    const newState = !enterprise.active;
                    const messages = newState
                        ? {
                              pending: `Habilitando empresa`,
                              success: "Empresa habilitada",
                              error: `Error al habilitar la empresa, inténtalo de nuevo por favor`,
                          }
                        : {
                              pending: `Deshabilitando la empresa`,
                              success: "Deshabilitado",
                              error: `Error al deshabilitar la empresa, inténtalo de nuevo por favor`,
                          };

                    await toast.promise(
                        updateEnterprise(enterprise.id, {
                            active: newState,
                        }),
                        messages,
                    );
                    router.refresh();
                    setLoadingAll(false, setFormState);
                } catch (e) {
                    setLoadingAll(false, setFormState);
                    router.refresh();
                }
            }
        }
    };

    return (
        <div
            className={"form-sub-container | margin-top-50 max-width-60"}
            data-state={formState.loading || loading ? "loading" : "loaded"}
        >
            <h2 className="text icon-wrapper | yellow yellow-icon medium-big bold">
                <TriangleExclamation />
                Zona Peligrosa
            </h2>
            <p>Por favor escribe el nombre de la empresa para continuar.</p>
            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: `${
                                enterprise.active ? "Deshabilitar" : "Habilitar"
                            } empresa`,
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
                    onSummit: toggleDisableEnterprise,
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

export default FormToDisableEnterprise;
