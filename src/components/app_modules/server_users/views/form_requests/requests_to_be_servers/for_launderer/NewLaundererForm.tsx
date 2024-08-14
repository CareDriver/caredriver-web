"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import SelfieSection from "@/components/form/view/sections/SelfieSection";
import PrivacyTermsSection from "@/components/form/view/sections/PrivacyTermsSection";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { AuthContext } from "@/context/AuthContext";
import { laundryReqBuilder } from "@/interfaces/UserRequest";
import { Locations } from "@/interfaces/Locations";
import { emptyPhotoWithRef, ImgWithRef } from "@/interfaces/ImageInterface";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { updateUser } from "@/utils/requests/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceReqState } from "@/interfaces/Services";
import { isImageBase64 } from "@/utils/validator/ImageValidator";
import { EnterpriseType } from "@/interfaces/Enterprise";
import { updateIdCard } from "@/utils/requests/IdCardUpdated";
import { saveLaundryReq } from "@/utils/requests/services/LaundryRequester";
import Soap from "@/icons/Soap";
import {
    DEFAULT_PERSONAL_DATA,
    PersonalData,
} from "@/components/app_modules/server_users/models/PersonalDataFields";
import {
    AttachmentField,
    EntityField,
} from "@/components/form/models/FormFields";
import {
    DEFAUL_ATTACHMENT_FIELD,
    DEFAUL_ENTITY_FIELD,
} from "@/components/form/models/DefaultFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import PersonalDataForm from "../../personal_data/PersonalDataForm";
import EnterpriseSelector from "@/components/app_modules/enterprises/views/selectors/EnterpriseSelector";
import PageLoading from "@/components/loaders/PageLoading";
import ServiceStateRenderer from "../ServiceStateRenderer";
import { LaundererStatusHandler } from "@/components/app_modules/server_users/api/requests_status_handler/LaundererStatusHandler";
import { isValidPersonalData } from "@/components/app_modules/server_users/validators/PersonalDataValidator";
import {
    isValidAttachmentField,
    isValidEntityField,
} from "@/components/form/validators/FieldValidators";

interface Form {
    personalData: PersonalData;
    enterprise: EntityField;
    selfie: AttachmentField;
    termsCheck: boolean;
}

interface Props {
    baseUser?: UserInterface;
    baseEnterprise?: string;
}

const NewLaundererForm: React.FC<Props> = ({ baseUser, baseEnterprise }) => {
    const { user, checkingUserAuth } = useContext(AuthContext);
    const [requesterUser, setRequesterUser] = useState<
        UserInterface | undefined
    >(baseUser);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [form, setForm] = useState<Form>(DEFAULT_FORM(baseEnterprise));

    const uploadImages = async () => {
        var newProfilePhotoImgUrl: string | ImgWithRef = emptyPhotoWithRef;
        var realTimePhotoImgUrl: ImgWithRef = emptyPhotoWithRef;

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
        newProfilePhotoImgUrl: string | ImgWithRef,
        realTimePhotoImgUrl: ImgWithRef,
    ) => {
        if (requesterUser && form.enterprise.value) {
            var formId = nanoid(30);
            try {
                await saveLaundryReq(
                    formId,
                    laundryReqBuilder(
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
                    ),
                );

                if (requesterUser.id) {
                    var toUpdate: Partial<UserInterface> = {
                        serviceRequests: {
                            ...requesterUser.serviceRequests,
                            laundry: {
                                id: formId,
                                state: ServiceReqState.Reviewing,
                            },
                        },
                    };
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
            setFormState((prev) => ({
                ...prev,
                loading: false,
                isValid: true,
            }));
        } catch (e) {
            setFormState((prev) => ({
                ...prev,
                loading: false,
                isValid: false,
            }));
            window.location.reload();
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
                    statusHandler={new LaundererStatusHandler(requesterUser)}
                />
                <form
                    className="form-sub-container"
                    data-state={formState.loading ? "loading" : "loaded"}
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <PersonalDataForm
                        baseUser={baseUser}
                        personalData={form.personalData}
                        setPersonalData={(d) =>
                            setForm((prev) => ({ ...prev, personalData: d }))
                        }
                    />

                    {!baseEnterprise && (
                        <div className="form-sub-container | margin-top-25 max-width-90">
                            <h2 className="text icon-wrapper | medium-big bold">
                                <Soap />
                                Lavadero
                            </h2>

                            <EnterpriseSelector
                                type={EnterpriseType.Laundry}
                                enterpriseFiled={form.enterprise}
                                setEnterprise={(d) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        enterprise: d,
                                    }))
                                }
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
                    <button
                        className={`general-button | margin-top-25 touchable max-width-60 ${
                            formState.loading && "loading-section"
                        }`}
                        title={
                            !formState.isValid
                                ? "Por favor completa los campos con datos validos"
                                : ""
                        }
                        disabled={!formState.isValid}
                    >
                        {formState.loading ? (
                            <span className="loader"></span>
                        ) : (
                            "Enviar Solicitud"
                        )}
                    </button>
                </form>
            </div>
        )
    );
};

export default NewLaundererForm;

const DEFAULT_FORM = (baseEnterprise: string | undefined): Form => {
    return {
        personalData: DEFAULT_PERSONAL_DATA,
        enterprise: { ...DEFAUL_ENTITY_FIELD, value: baseEnterprise },
        selfie: DEFAUL_ATTACHMENT_FIELD,
        termsCheck: false,
    };
};

function isValidForm(form: Form): boolean {
    return (
        isValidPersonalData(form.personalData) &&
        isValidEntityField(form.enterprise) &&
        isValidAttachmentField(form.selfie) &&
        form.termsCheck
    );
}
