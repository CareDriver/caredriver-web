"use client";

import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { ServiceType } from "@/interfaces/Services";
import {
    inputToServiceType,
    TYPES_OF_SERVICE,
    userReqTypes,
} from "@/interfaces/UserRequest";
import { FormEvent, useEffect, useState } from "react";
import { validateId } from "../../../../../validators/IdValidator";
import { toast } from "react-toastify";
import { findServicePerfByFakeId } from "../../model/fetchers/ServicePerfFetcher";
import { routeToServicePerformed } from "@/utils/route_builders/for_services/RouteBuilderForServices";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import BaseForm from "@/components/form/view/forms/BaseForm";
import TextField from "@/components/form/view/fields/TextField";
import SelectionField from "@/components/form/view/fields/SelectionField";

const RedirectorToServiceByFakeId = () => {
    const [typeOfService, setTypeOfService] = useState<ServiceType>("driver");
    const [serviceFakedId, setServiceFakeId] =
        useState<TextFieldForm>(DEFAUL_TEXT_FIELD);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

    const tryToRedirect = async (e: FormEvent) => {
        e.preventDefault();
        if (formState.loading) {
            return;
        }

        setFormState((prev) => ({
            ...prev,
            loading: true,
        }));

        if (!isValidTextField(serviceFakedId)) {
            toast.error("Completa los campos", {
                toastId: "no-filled-fields-error",
            });
            setFormState((prev) => ({
                ...prev,
                loading: false,
            }));
            return;
        }

        try {
            let serviceFound = await toast.promise(
                findServicePerfByFakeId(serviceFakedId.value, typeOfService),
                {
                    pending: "Buscando el servicio ...",
                    error: "Error al buscar el servicio, intentalo de nuevo",
                },
            );
            if (serviceFound === undefined) {
                setServiceFakeId({
                    ...serviceFakedId,
                    message:
                        "El ID no pertence a ningun servicio, intenta con otro",
                });
                setFormState((prev) => ({
                    ...prev,
                    loading: false,
                }));
                return;
            }
            let link = routeToServicePerformed(
                typeOfService,
                serviceFakedId.value,
            );

            if (!link) {
                setServiceFakeId({
                    ...serviceFakedId,
                    message: "El servicio no fue correctamente registrado",
                });
                setFormState({
                    ...formState,
                    loading: false,
                });
                return;
            }
            window.location.replace(link);
        } catch (e) {
            setFormState((prev) => ({
                ...prev,
                loading: false,
            }));
            return;
        }
    };

    const switchTypeOfService = (d: string) => {
        const newService = d as ServiceType;
        setTypeOfService(newService);
        const { isValid, message } = validateId(serviceFakedId.value);
        setServiceFakeId((prev) => ({
            ...prev,
            message: isValid ? null : message,
        }));
    };

    useEffect(() => {
        setFormState((prev) => ({
            ...prev,
            isValid:
                isValidTextField(serviceFakedId) ||
                validateId(serviceFakedId.value).isValid,
        }));
    }, [serviceFakedId]);

    return (
        <BaseForm
            content={{
                button: {
                    content: {
                        legend: "Ir al servicio",
                    },
                    behavior: {
                        isValid: formState.isValid,
                        loading: formState.loading,
                    },
                },
            }}
            behavior={{
                loading: formState.loading,
                onSummit: tryToRedirect,
            }}
        >
            <SelectionField
                field={{
                    value: typeOfService,
                    setter: switchTypeOfService,
                }}
                options={TYPES_OF_SERVICE}
                legend="Tipo de servicio"
                optionTranslator={(o) => {
                    let op = o as ServiceType;
                    return userReqTypes[inputToServiceType(op)];
                }}
            />
            <TextField
                field={{
                    values: serviceFakedId,
                    setter: setServiceFakeId,
                    validator: validateId,
                }}
                legend="Id del servicio"
            />
        </BaseForm>
    );
};

export default RedirectorToServiceByFakeId;
