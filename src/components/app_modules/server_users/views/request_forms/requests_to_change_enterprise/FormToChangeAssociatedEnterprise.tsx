"use client";

import EnterpriseSelector from "@/components/app_modules/enterprises/views/selectors/EnterpriseSelector";
import {
    DEFAUL_ENTITY_DATA_FIELD,
    DEFAUL_TEXT_FIELD,
} from "@/components/form/models/DefaultFields";
import {
    EntityDataField,
    TextField as TextFieldForm,
} from "@/components/form/models/FormFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import {
    isValidEntityDataField,
    isValidTextField,
} from "@/components/form/validators/FieldValidators";
import TextField from "@/components/form/view/fields/TextField";
import BaseForm from "@/components/form/view/forms/BaseForm";
import PageLoading from "@/components/loaders/PageLoading";
import { AuthContext } from "@/context/AuthContext";
import { Enterprise } from "@/interfaces/Enterprise";
import {
    BaseSimpleEnterprise,
    RequestForChangeOfEnterprise,
} from "@/interfaces/RequestForChangeOfEnterprise";
import { Services, ServiceType } from "@/interfaces/Services";
import { genDocId } from "@/utils/generators/IdGenerator";
import { InputState } from "@/validators/InputValidatorSignature";
import { isValidChangeReason } from "@/validators/JustificationValidator";
import { FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendRequestToChangeAssociatedEnterprise } from "../../../api/RequestForChangeEnterprise";
import { useRouter } from "next/navigation";
import { routeToRequestToBeServerUserAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import { RequestLimitValidatorToChangeAssociatedEnterprise } from "../../../validators/for_request_limit/RequestLimitValidatorToChangeAssociatedEnterprise";
import { getAssociatedEnterprise } from "../../../utils/UserEnterpriseHelper";
import Building from "@/icons/Building";
import NoteSticky from "@/icons/NoteSticky";

interface Form {
    reason: TextFieldForm;
    newEnterprise: EntityDataField<Enterprise>;
}

const DEFAULT_FORM: Form = {
    reason: DEFAUL_TEXT_FIELD,
    newEnterprise: DEFAUL_ENTITY_DATA_FIELD,
};

interface Props {
    typeOfService: ServiceType;
}

const FormToChangeAssociatedEnterprise: React.FC<Props> = ({
    typeOfService,
}) => {
    const router = useRouter();
    const { checkingUserAuth, user } = useContext(AuthContext);
    const [form, setForm] = useState(DEFAULT_FORM);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const limitReqValidator =
        new RequestLimitValidatorToChangeAssociatedEnterprise();

    const getEnterprise = (): string | undefined => {
        return getAssociatedEnterprise(user, typeOfService);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formState.loading) {
            return;
        }

        setFormState((prev) => ({ ...prev, loading: true }));
        let associatedEnterprise = getEnterprise();
        if (
            associatedEnterprise &&
            form.newEnterprise.value?.id === associatedEnterprise
        ) {
            toast.info("Sin cambios para cambiar de empresa");
            setFormState((prev) => ({ ...prev, loading: false }));
            return;
        }

        if (
            !isValidForm(form) ||
            !user ||
            !user.id ||
            !form.newEnterprise.value ||
            !form.newEnterprise.value.id
        ) {
            toast.error("Formulario invalido");
            setFormState((prev) => ({ ...prev, loading: false }));

            return;
        }

        try {
            let hasRequestsSent = await toast.promise(
                limitReqValidator.hasRequestsSent(user.id, typeOfService),
                {
                    pending:
                        "Verificando disponibilidad para enviar peticiones...",
                    error: "error al verificar disponibilidad inténtalo de nuevo",
                },
            );
            if (hasRequestsSent) {
                toast.info(
                    "Tienes peticiones en revision, espera a que sean revisada",
                );
                setFormState((prev) => ({ ...prev, loading: false }));
                return;
            }
        } catch (e) {
            setFormState((prev) => ({ ...prev, loading: false }));
            return;
        }

        let newEnterpriseBaseData: BaseSimpleEnterprise = form.newEnterprise
            .value.logoImgUrl
            ? {
                  logoUrl: form.newEnterprise.value.logoImgUrl.url,
                  name: form.newEnterprise.value.name,
              }
            : {
                  name: form.newEnterprise.value.name,
              };

        let requestData: RequestForChangeOfEnterprise = {
            id: genDocId(),
            active: true,
            serviceType: typeOfService,
            reason: form.reason.value,
            userId: user.id,
            newEnterpriseBaseData: newEnterpriseBaseData,
            newEnterpriseId: form.newEnterprise.value.id,
            userName: user.fullName,
        };

        if (associatedEnterprise) {
            requestData = {
                ...requestData,
                oldEnterpriseId: associatedEnterprise,
            };
        }

        try {
            await toast.promise(
                sendRequestToChangeAssociatedEnterprise(
                    requestData.id,
                    requestData,
                ),
                {
                    pending: "Enviando petición...",
                    success: "Petición enviada, espera a que sea revisada",
                    error: "Error al enviar la petición, inténtalo de nuevo",
                },
            );

            router.push(routeToRequestToBeServerUserAsUser(typeOfService));
        } catch (e) {
            setFormState((prev) => ({ ...prev, loading: false }));
        }
    };

    const validateEntepriseSelected = (
        enterpriseSelected: Enterprise,
    ): InputState => {
        let isSupport = enterpriseSelected.addedUsers
            ? enterpriseSelected.addedUsers.reduce(
                  (acc, u) =>
                      acc || (u.userId === user?.id && u.role === "support"),
                  false,
              )
            : false;

        let associatedEnterprise = getEnterprise();
        if (
            associatedEnterprise &&
            enterpriseSelected.id === associatedEnterprise
        ) {
            return {
                isValid: false,
                message: "Ya perteneces a esta empresa",
            };
        } else if (isSupport) {
            return {
                isValid: false,
                message: "Eres usuario soporte de esta empresa",
            };
        } else {
            return {
                isValid: true,
                message: "Empresa valida",
            };
        }
    };

    useEffect(() => {
        if (!checkingUserAuth && user) {
            const getServiceAsEnum = (): Services => {
                switch (typeOfService) {
                    case "driver":
                        return Services.Driver;
                    case "laundry":
                        return Services.Laundry;
                    case "mechanical":
                        return Services.Mechanic;
                    case "tow":
                        return Services.Tow;
                    default:
                        return Services.Normal;
                }
            };

            let service: Services = getServiceAsEnum();
            let hasService = user.services.includes(service);
            if (!hasService) {
                toast.error("No tienes registrado este servicio", {
                    toastId: "error-no-found-service-registered",
                });
                router.push(routeToRequestToBeServerUserAsUser(typeOfService));
            }
        } else {
            router.push(routeToRequestToBeServerUserAsUser(typeOfService));
        }
    }, [checkingUserAuth]);

    useEffect(() => {
        setFormState((prev) => ({ ...prev, isValid: isValidForm(form) }));
    }, [form]);

    if (checkingUserAuth) {
        return <PageLoading />;
    }

    return (
        <div className="service-form-wrapper">
            <h1 className={`text | big bolder max-width-90`}>
                Asociarse a nueva empresa
            </h1>
            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Enviar solicitud",
                        },
                        behavior: {
                            loading: formState.loading,
                            isValid: formState.isValid,
                        },
                    },
                    styleClasses: "max-width-80",
                }}
                behavior={{
                    loading: formState.loading,
                    onSummit: handleSubmit,
                }}
            >
                <h3 className="text | bolder | icon-wrapper">
                    <NoteSticky />
                    Justificación
                </h3>
                <TextField
                    field={{
                        values: form.reason,
                        setter: (d) =>
                            setForm((prev) => ({ ...prev, reason: d })),
                        validator: isValidChangeReason,
                    }}
                    legend="Rason de cambio de empresa"
                />
                <h3 className="text | bolder | icon-wrapper">
                    <Building />
                    Nueva empresa
                </h3>
                <EnterpriseSelector
                    field={{
                        values: form.newEnterprise,
                        setter: (d) =>
                            setForm((prev) => ({
                                ...prev,
                                newEnterprise: d,
                            })),
                        validator: validateEntepriseSelected,
                    }}
                    typeOfEnterprise={typeOfService}
                />
                {form.newEnterprise.message && (
                    <small className="form-section-message">
                        * {form.newEnterprise.message}
                    </small>
                )}
            </BaseForm>
        </div>
    );
};

export default FormToChangeAssociatedEnterprise;

function isValidForm(form: Form): boolean {
    return (
        isValidTextField(form.reason) &&
        isValidEntityDataField(form.newEnterprise)
    );
}
