"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { VehicleType } from "@/interfaces/VehicleInterface";
import VehiclesForm from "../../vehicle_forms/VehiclesForm";
import SelfieSection from "@/components/form/view/sections/SelfieSection";
import PrivacyTermsSection from "@/components/form/view/sections/PrivacyTermsSection";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { AuthContext } from "@/context/AuthContext";
import {
    DEFAULT_VEHICLE,
    Vehicle as VehicleFiels,
} from "@/components/app_modules/server_users/models/VehicleFields";
import { Vehicle, driveReqBuilder } from "@/interfaces/UserRequest";
import { Timestamp } from "firebase/firestore";
import { saveDriveReq } from "@/utils/requests/services/DriveRequester";
import { Locations } from "@/interfaces/Locations";
import { emptyPhotoWithRef, ImgWithRef } from "@/interfaces/ImageInterface";
import { toast } from "react-toastify";
import { updateUser } from "@/utils/requests/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceReqState } from "@/interfaces/Services";
import { isImageBase64 } from "@/utils/validator/ImageValidator";
import { updateIdCard } from "@/utils/requests/IdCardUpdated";
import {
    DEFAULT_PERSONAL_DATA,
    PersonalData,
} from "@/components/app_modules/server_users/models/PersonalDataFields";
import { AttachmentField } from "@/components/form/models/FormFields";
import { DEFAUL_ATTACHMENT_FIELD } from "@/components/form/models/DefaultFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import PersonalDataForm from "../../personal_data/PersonalDataForm";
import ServiceStateRenderer from "../ServiceStateRenderer";
import { DriverStatusHandler } from "@/components/app_modules/server_users/api/requests_status_handler/DriverStatusHandler";
import PageLoading from "@/components/loaders/PageLoading";
import { genDocId } from "@/utils/IdGenerator";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { isValidAttachmentField } from "@/components/form/validators/FieldValidators";
import { isValidPersonalData } from "@/components/app_modules/server_users/validators/PersonalDataValidator";
import { areValidVehicles } from "@/components/app_modules/server_users/validators/VehicleValidator";

interface Form {
    personalData: PersonalData;
    vehicles: VehicleFiels[];
    selfie: AttachmentField;
    termsCheck: boolean;
}

interface Props {
    baseUser?: UserInterface;
    defaultTowEnterprise: string;
}

const NewDriverForm: React.FC<Props> = ({
    baseUser,
    defaultTowEnterprise: defaultEnterprise,
}) => {
    const { user, checkingUserAuth } = useContext(AuthContext);
    const [requesterUser, setRequesterUser] = useState<
        UserInterface | undefined
    >(baseUser);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [form, setForm] = useState<Form>(DEFAULT_FORM);

    const uploadImages = async () => {
        let vehiclesData: Vehicle[] = [];
        var profilePhotoRef: string | ImgWithRef = emptyPhotoWithRef;
        var selfieRef: ImgWithRef = emptyPhotoWithRef;

        if (requesterUser) {
            profilePhotoRef = requesterUser.photoUrl;
            if (
                !checkingUserAuth &&
                form.personalData.photo.value &&
                isImageBase64(form.personalData.photo.value)
            ) {
                try {
                    profilePhotoRef = await uploadFileBase64(
                        DirectoryPath.TempProfilePhotos,
                        form.personalData.photo.value,
                    );
                } catch (e) {
                    throw e;
                }
            }

            for (let i = 0; i < form.vehicles.length; i++) {
                var vehicle = form.vehicles[i];
                if (
                    vehicle.license.frontPhoto.value &&
                    vehicle.license.behindPhoto.value
                ) {
                    try {
                        const frontImgUrl = await uploadFileBase64(
                            DirectoryPath.Licenses,
                            vehicle.license.frontPhoto.value,
                        );
                        const behindImgUrl = await uploadFileBase64(
                            DirectoryPath.Licenses,
                            vehicle.license.behindPhoto.value,
                        );
                        if (vehicle.license.expirationDate.value) {
                            vehiclesData.push({
                                type: vehicle.type,
                                license: {
                                    licenseNumber: vehicle.license.number.value,
                                    expiredDateLicense: Timestamp.fromDate(
                                        vehicle.license.expirationDate.value,
                                    ),
                                    frontImgUrl: frontImgUrl,
                                    backImgUrl: behindImgUrl,
                                },
                            });
                        }
                    } catch (e) {
                        throw e;
                    }
                }
            }

            if (form.selfie.value) {
                try {
                    selfieRef = await uploadFileBase64(
                        DirectoryPath.Selfies,
                        form.selfie.value,
                    );
                } catch (e) {
                    throw e;
                }
            }
        }

        return {
            vehiclesData,
            profilePhotoRef,
            selfieRef,
        };
    };

    const uploadForm = async (
        vehiclesData: Vehicle[],
        profilePhotoRef: string | ImgWithRef,
        selfieRef: ImgWithRef,
    ) => {
        if (requesterUser) {
            var formId = genDocId();
            try {
                await saveDriveReq(
                    formId,
                    driveReqBuilder(
                        formId,
                        requesterUser.id === undefined ? "" : requesterUser.id,
                        form.personalData.fullname.value,
                        profilePhotoRef,
                        vehiclesData,
                        selfieRef,
                        requesterUser.services,
                        requesterUser.location === undefined
                            ? Locations.CochabambaBolivia
                            : requesterUser.location,
                        defaultEnterprise,
                    ),
                );

                var newReqState;
                if (form.vehicles.length > 1) {
                    newReqState = {
                        ...requesterUser.serviceRequests,
                        driveCar: {
                            id: formId,
                            state: ServiceReqState.Reviewing,
                        },
                        driveMotorcycle: {
                            id: formId,
                            state: ServiceReqState.Reviewing,
                        },
                    };
                } else {
                    newReqState =
                        form.vehicles[0].type.type === VehicleType.CAR
                            ? {
                                  ...requesterUser.serviceRequests,
                                  driveCar: {
                                      id: formId,
                                      state: ServiceReqState.Reviewing,
                                  },
                              }
                            : {
                                  ...requesterUser.serviceRequests,
                                  driveMotorcycle: {
                                      id: formId,
                                      state: ServiceReqState.Reviewing,
                                  },
                              };
                }

                if (requesterUser.id) {
                    var toUpdate: Partial<UserInterface> = {
                        serviceRequests: newReqState,
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
            const { vehiclesData, profilePhotoRef, selfieRef } =
                await toast.promise(uploadImages(), {
                    pending: "Subiendo imágenes, por favor espera",
                    success: "Imágenes subidas",
                    error: "Error al subir imágenes, inténtalo de nuevo por favor",
                });

            /* const pdfRef = await toast.promise(uploadPDF(), {
                pending: "Subiendo PDF",
                success: "PDF subido",
                error: "Error al subir el PDF, inténtalo de nuevo",
            }); */

            await toast.promise(
                uploadForm(vehiclesData, profilePhotoRef, selfieRef),
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
                ...formState,
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
                    statusHandler={new DriverStatusHandler(requesterUser)}
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
                    <VehiclesForm
                        vehicles={form.vehicles}
                        setVehicles={(d) =>
                            setForm((prev) => ({ ...prev, vehicles: d }))
                        }
                    />

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

export default NewDriverForm;

const DEFAULT_FORM: Form = {
    personalData: DEFAULT_PERSONAL_DATA,
    vehicles: [DEFAULT_VEHICLE],
    selfie: DEFAUL_ATTACHMENT_FIELD,
    termsCheck: false,
};

function isValidForm(form: Form): boolean {
    return (
        isValidPersonalData(form.personalData) &&
        areValidVehicles(form.vehicles) &&
        isValidAttachmentField(form.selfie) &&
        form.termsCheck
    );
}
