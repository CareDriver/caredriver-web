"use client";

import { DEFAUL_INPUT_TEXT_STATE } from "@/components/modules/models/DefaultFormStatuses";
import { InputTextState } from "@/components/modules/models/FormStatuses";
import ChevronDown from "@/icons/ChevronDown";
import { ServiceType } from "@/interfaces/Services";
import {
    inputToServiceType,
    TYPES_OF_SERVICE,
    userReqTypes,
} from "@/interfaces/UserRequest";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { validateFakeId } from "../../model/validators/FakeIdValidator";
import { isNullOrEmptyText } from "@/utils/validator/text/TextValidator";
import { toast } from "react-toastify";
import { findServicePerfByFakeId } from "../../model/fetchers/ServicePerfFetcher";
import { buildLinkForServicePerformed } from "../../model/utils/LinkBuilder";
import { TypeOfServicePerformed } from "../../model/models/TypeOfServicePerformed";

const RedirectorFormByFakedId = () => {
    const [typeOfService, setTypeOfService] = useState<ServiceType>("driver");
    const [serviceFakedId, setServiceFakeId] = useState<InputTextState>(
        DEFAUL_INPUT_TEXT_STATE,
    );
    const [formState, setFormState] = useState<{
        loading: boolean;
        isValid: boolean;
    }>({
        loading: false,
        isValid: true,
    });

    const redirect = async (e: FormEvent) => {
        e.preventDefault();
        if (formState.loading) {
            return;
        }

        setFormState({
            ...formState,
            loading: true,
        });

        if (!isValidForm()) {
            toast.error("Completa los campos", {
                toastId: "no-filled-fields-error",
            });
            setFormState({
                ...formState,
                loading: false,
            });
            return;
        }

        try {
            let serviceFound = await toast.promise(
                findServicePerfByFakeId(serviceFakedId.value, typeOfService),
                {
                    pending: "Buscando el servicio ...",
                    success: "Busqueda finalizada",
                    error: "Error al buscar el servicio, intentalo de nuevo",
                },
            );
            if (serviceFound === undefined) {
                setServiceFakeId({
                    ...serviceFakedId,
                    message:
                        "El ID no pertence a ningun servicio, intenta con otro",
                });
                setFormState({
                    ...formState,
                    loading: false,
                });
                return;
            }
            let link = buildLinkForServicePerformed(
                serviceFound.serviceUserId,
                serviceFakedId.value,
                typeOfService,
                TypeOfServicePerformed.Served,
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
            setFormState({
                ...formState,
                loading: false,
            });
            return;
        }
    };

    const switchFakeId = (e: ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value;
        let { isValid, message } = validateFakeId(input);
        setServiceFakeId({
            value: input,
            message: isValid ? null : message,
        });
    };

    const switchTypeOfService = (e: ChangeEvent<HTMLSelectElement>) => {
        let input = e.target.value;
        let newType = inputToServiceType(input);
        setTypeOfService(newType);
        setServiceFakeId({
            ...serviceFakedId,
            message: null,
        });
    };

    const isValidForm = (): boolean => {
        return (
            !serviceFakedId.message && !isNullOrEmptyText(serviceFakedId.value)
        );
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: isValidForm(),
        });
    }, [serviceFakedId]);

    return (
        <form
            onSubmit={redirect}
            className="form-container | full-form"
            data-state={formState.loading ? "loading" : ""}
        >
            <fieldset className="form-section | select-item">
                <ChevronDown />
                <select
                    className="form-section-input"
                    onChange={switchTypeOfService}
                    value={typeOfService}
                >
                    {TYPES_OF_SERVICE.map((type, i) => (
                        <option key={`type-service-option-${i}`} value={type}>
                            {userReqTypes[inputToServiceType(type)]}
                        </option>
                    ))}
                </select>
                <legend className="form-section-legend">
                    Tipo de servicio
                </legend>
            </fieldset>
            <fieldset className="form-section">
                <input
                    type="text"
                    placeholder=""
                    value={serviceFakedId.value}
                    onChange={switchFakeId}
                    className="form-section-input"
                />
                <legend className="form-section-legend">Id del servicio</legend>
                {serviceFakedId.message && (
                    <small className="form-section-message">
                        {serviceFakedId.message}
                    </small>
                )}
            </fieldset>

            <button
                disabled={!formState.isValid}
                className="general-button | touchable"
            >
                {formState.loading ? (
                    <i className="loader"></i>
                ) : (
                    <span>Ir al servicio</span>
                )}
            </button>
        </form>
    );
};

export default RedirectorFormByFakedId;
