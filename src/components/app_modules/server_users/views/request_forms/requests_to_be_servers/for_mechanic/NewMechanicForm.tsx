"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import SelfieSection from "@/components/form/view/sections/SelfieSection";
import PrivacyTermsSection from "@/components/form/view/sections/PrivacyTermsSection";
import { uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { AuthContext } from "@/context/AuthContext";
import { mechanicReqBuilder } from "@/interfaces/UserRequest";
import { Locations } from "@/interfaces/Locations";
import {
    EMPTY_REF_ATTACHMENT,
    RefAttachment,
} from "@/components/form/models/RefAttachment";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceReqState } from "@/interfaces/Services";
import { isImageBase64 } from "@/validators/ImageValidator";
import Warehouse from "@/icons/Warehouse";
import { saveMechanicReq } from "@/components/app_modules/server_users/api/MechanicRequester";
import { updateIdCard } from "@/components/app_modules/users/api/IdCardUpdated";
import {
    DEFAULT_PERSONAL_DATA,
    PersonalData,
} from "@/components/app_modules/server_users/models/PersonalDataFields";
import {
    AttachmentField,
    EntityField,
    TextField,
} from "@/components/form/models/FormFields";
import {
    DEFAUL_ATTACHMENT_FIELD,
    DEFAUL_TEXT_FIELD,
    DEFAUL_ENTITY_FIELD,
} from "@/components/form/models/DefaultFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import PersonalDataForm from "../../../../../users/views/request_forms/to_manage_data/PersonalDataForm";
import MechanicTools from "./MechanicTools";
import PageLoading from "@/components/loaders/PageLoading";
import ServiceStateRenderer from "../ServiceStateRenderer";
import { MechanicStatusHandler } from "@/components/app_modules/server_users/api/requests_status_handler/MechanicStatusHandler";
import { isValidPersonalData } from "@/components/app_modules/server_users/validators/for_data/PersonalDataValidator";
import {
    isValidAttachmentField,
    isValidTextField,
} from "@/components/form/validators/FieldValidators";
import EnterpriseSelectorById from "@/components/app_modules/enterprises/views/selectors/EnterpriseSelectorById";
import BaseForm from "@/components/form/view/forms/BaseForm";

interface Form {
    personalData: PersonalData;
    mechanicTools: TextField;
    enterprise: EntityField;
    selfie: AttachmentField;
    termsCheck: boolean;
}

interface Props {
    baseUser?: UserInterface;
    baseEnterprise?: string;
}

const NewMechanicForm: React.FC<Props> = ({ baseUser, baseEnterprise }) => {
    const { user, checkingUserAuth } = useContext(AuthContext);
    const [requesterUser, setRequesterUser] = useState<
        UserInterface | undefined
    >(baseUser);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [form, setForm] = useState<Form>(DEFAULT_FORM(baseEnterprise));

    const uploadImages = async () => {
        var newProfilePhotoImgUrl: string | RefAttachment =
            EMPTY_REF_ATTACHMENT;
        var realTimePhotoImgUrl: RefAttachment = EMPTY_REF_ATTACHMENT;

        if (requesterUser) {
            newProfilePhotoImgUrl = requesterUser.photoUrl;
            if (
                !checkingUserAuth &&
                form.personalData.photo.value &&
                isImageBase64(form.personalData.photo.value)
            ) {
                try {
                    newProfilePhotoImgUrl = await uploadFileBase64(
                        DirectoryPath.TempProfilePhotos,
                        form.personalData.photo.value,
                    );
                } catch (e) {
                    throw e;
                }
            }

            if (form.selfie.value) {
                try {
                    realTimePhotoImgUrl = await uploadFileBase64(
                        DirectoryPath.Selfies,
                        form.selfie.value,
                    );
                } catch (e) {
                    throw e;
                }
            }
        }

        return {
            newProfilePhotoImgUrl,
            realTimePhotoImgUrl,
        };
    };

    const uploadForm = async (
        newProfilePhotoImgUrl: string | RefAttachment,
        realTimePhotoImgUrl: RefAttachment,
    ) => {
        if (requesterUser) {
            var formId = nanoid(30);
            try {
                await saveMechanicReq(
                    formId,
                    mechanicReqBuilder(
                        formId,
                        requesterUser.id === undefined ? "" : requesterUser.id,
                        form.personalData.fullname.value,
                        newProfilePhotoImgUrl,
                        realTimePhotoImgUrl,
                        requesterUser.services,
                        requesterUser.location === undefined
                            ? Locations.CochabambaBolivia
                            : requesterUser.location,
                        form.enterprise.value,
                        form.mechanicTools.value,
                    ),
                );

                if (requesterUser.id) {
                    var toUpdate: Partial<UserInterface> = {
                        serviceRequests: {
                            ...requesterUser.serviceRequests,
                            mechanic: {
                                id: formId,
                                state: ServiceReqState.Reviewing,
                            },
                        },
                    };
                    if (
                        isValidTextField(
                            form.personalData.alternativePhoneNumber,
                        )
                    ) {
                        toUpdate = {
                            ...toUpdate,
                            alternativePhoneNumber:
                                form.personalData.alternativePhoneNumber.value,
                        };
                    }
                    try {
                        await updateUser(requesterUser.id, toUpdate);
                    } catch (e) {
                        throw e;
                    }
                }
            } catch (e) {
                throw e;
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formState.loading) {
            return;
        }
        setFormState((prev) => ({
            ...prev,
            loading: true,
        }));

        if (!isValidForm(form) || !requesterUser) {
            toast.error("Formulario invalido");
            setFormState((prev) => ({
                ...prev,
                loading: false,
            }));
            return;
        }

        try {
            await updateIdCard(form.personalData.idCard, requesterUser);
            const { newProfilePhotoImgUrl, realTimePhotoImgUrl } =
                await toast.promise(uploadImages(), {
                    pending: "Subiendo imágenes, por favor espera",
                    success: "Imágenes subidas",
                    error: "Error al subir imágenes, inténtalo de nuevo por favor",
                });
            await toast.promise(
                uploadForm(newProfilePhotoImgUrl, realTimePhotoImgUrl),
                {
                    pending: "Enviando el formulario, por favor espera",
                    success: "Formulario enviado",
                    error: "Error al enviar el formulario, inténtalo de nuevo por favor",
                },
            );
            window.location.reload();
        } catch (e) {
            setFormState({
                loading: false,
                isValid: false,
            });
        }
    };

    useEffect(
        () =>
            setFormState((prev) => ({
                ...prev,
                isValid: isValidForm(form),
            })),
        [form],
    );

    useEffect(() => {
        if (!requesterUser && user) {
            setRequesterUser(user);
        }
    }, [checkingUserAuth]);

    if (checkingUserAuth) {
        return <PageLoading />;
    }

    return (
        requesterUser && (
            <div className="service-form-wrapper">
                <ServiceStateRenderer
                    statusHandler={new MechanicStatusHandler(requesterUser)}
                />
                <BaseForm
                    content={{
                        button: {
                            content: {
                                legend: "Enviar Solicitud",
                            },
                            behavior: {
                                isValid: formState.isValid,
                                loading: formState.loading,
                            },
                        },
                        styleClasses: "max-width-80",
                    }}
                    behavior={{
                        loading: formState.loading,
                        onSummit: handleSubmit,
                    }}
                >
                    <PersonalDataForm
                        baseUser={baseUser}
                        personalData={form.personalData}
                        setPersonalData={(d) =>
                            setForm((prev) => ({ ...prev, personalData: d }))
                        }
                    />

                    <MechanicTools
                        tools={form.mechanicTools}
                        setTools={(d) =>
                            setForm((prev) => ({ ...prev, mechanicTools: d }))
                        }
                    />

                    {!baseEnterprise && (
                        <div className="form-sub-container | margin-top-25">
                            <h2 className="text icon-wrapper | medium-big bold">
                                <Warehouse />
                                Taller mecánico {"(Opcional)"}
                            </h2>

                            <EnterpriseSelectorById
                                typeOfEnterprise="mechanical"
                                field={{
                                    values: form.enterprise,
                                    setter: (d) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            enterprise: d,
                                        })),
                                }}
                            />
                            {form.enterprise.message && (
                                <div className="margin-top-15">
                                    <small className="form-section-message">
                                        {form.enterprise.message}
                                    </small>
                                </div>
                            )}
                        </div>
                    )}

                    <SelfieSection
                        image={form.selfie}
                        setImage={(d) =>
                            setForm((prev) => ({ ...prev, selfie: d }))
                        }
                    />

                    <PrivacyTermsSection
                        isCheck={form.termsCheck}
                        setCheck={(d) =>
                            setForm((prev) => ({ ...prev, termsCheck: d }))
                        }
                    />
                </BaseForm>
            </div>
        )
    );
};

export default NewMechanicForm;

const DEFAULT_FORM = (baseEnterprise: string | undefined): Form => {
    return {
        personalData: DEFAULT_PERSONAL_DATA,
        mechanicTools: DEFAUL_TEXT_FIELD,
        enterprise: { ...DEFAUL_ENTITY_FIELD, value: baseEnterprise },
        selfie: DEFAUL_ATTACHMENT_FIELD,
        termsCheck: false,
    };
};

function isValidForm(form: Form): boolean {
    return (
        isValidPersonalData(form.personalData) &&
        isValidTextField(form.mechanicTools) &&
        isValidAttachmentField(form.selfie) &&
        form.termsCheck
    );
}
