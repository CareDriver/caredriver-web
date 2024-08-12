"use client";

import {
    LicenseInterface,
    LicenseUpdateReq,
} from "@/interfaces/PersonalDocumentsInterface";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    isValidLicenseDate,
    isValidLicenseNumber,
} from "@/utils/validator/service_requests/DriveValidator";
import { toast } from "react-toastify";
import { sendLicenseUpdateReq } from "@/utils/requests/LicenseUpdaterReq";
import { emptyPhotoWithRef, ImgWithRef } from "@/interfaces/ImageInterface";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { nanoid } from "nanoid";
import { Timestamp } from "firebase/firestore";
import { isImageBase64 } from "@/utils/validator/ImageValidator";
import { EditLICC_thereAreActiveReqs } from "@/utils/validator/license/UpdateLicenceLimiter";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import SelfieSection from "@/components/form/view/sections/SelfieSection";
import { AuthContext } from "@/context/AuthContext";
import PageLoading from "@/components/loaders/PageLoading";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { DEFAULT_LICENSE, License } from "../../../models/LicenseFields";
import { AttachmentField } from "@/components/form/models/FormFields";
import { DEFAUL_ATTACHMENT_FIELD } from "@/components/form/models/DefaultFields";
import NumberField from "@/components/form/view/fields/NumberField";
import DateField from "@/components/form/view/fields/DateField";
import {
    isValidAttachmentField,
    isValidDateField,
    isValidTextField,
} from "@/components/form/validators/FieldValidators";

type LicensedVehicles = "car" | "motorcycle" | "tow";

interface Form {
    license: License;
    selfie: AttachmentField;
}

const DEFAULT_FORM: Form = {
    license: DEFAULT_LICENSE,
    selfie: DEFAUL_ATTACHMENT_FIELD,
};

interface Props {
    type: LicensedVehicles;
}

const UpdateLicenseForm: React.FC<Props> = ({ type }) => {
    const router = useRouter();
    const { user, checkingUserAuth } = useContext(AuthContext);
    const [form, setForm] = useState<Form>(DEFAULT_FORM);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

    const isValidForm = (): boolean => {
        return (
            isValidTextField(form.license.number) &&
            isValidDateField(form.license.expirationDate) &&
            isValidAttachmentField(form.license.behindPhoto) &&
            isValidAttachmentField(form.license.frontPhoto) &&
            isValidAttachmentField(form.selfie)
        );
    };

    const uploadImages = async () => {
        if (user && user.serviceVehicles) {
            var vehicle = user.serviceVehicles[type];
            var frontImgUrl: ImgWithRef = vehicle?.license.frontImgUrl
                ? vehicle?.license.frontImgUrl
                : emptyPhotoWithRef;
            var behindImgUrl: ImgWithRef = vehicle?.license.backImgUrl
                ? vehicle?.license.backImgUrl
                : emptyPhotoWithRef;
            var realTimePhotoImgUrl: ImgWithRef = emptyPhotoWithRef;

            if (form) {
                if (
                    form.license.frontPhoto.value &&
                    form.license.behindPhoto.value
                ) {
                    try {
                        if (isImageBase64(form.license.frontPhoto.value)) {
                            frontImgUrl = await uploadFileBase64(
                                DirectoryPath.Licenses,
                                form.license.frontPhoto.value,
                            );
                        }
                        if (isImageBase64(form.license.behindPhoto.value)) {
                            behindImgUrl = await uploadFileBase64(
                                DirectoryPath.Licenses,
                                form.license.behindPhoto.value,
                            );
                        }
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
                frontImgUrl,
                behindImgUrl,
                realTimePhotoImgUrl,
            };
        }
    };

    const uploadForm = async (
        vehiclesData: LicenseInterface,
        realTimePhotoImgUrl: ImgWithRef,
    ) => {
        if (user && user.id) {
            var formId = nanoid(30);
            try {
                var reqDoc: LicenseUpdateReq = {
                    id: formId,
                    userId: user.id,
                    userName: user.fullName,
                    vehicleType: type,
                    licenseNumber: vehiclesData.licenseNumber,
                    expiredDateLicense: vehiclesData.expiredDateLicense,
                    frontImgUrl: vehiclesData.frontImgUrl,
                    backImgUrl: vehiclesData.backImgUrl,
                    realTimePhotoImgUrl: realTimePhotoImgUrl,
                    aproved: false,
                    active: true,
                };
                await sendLicenseUpdateReq(formId, reqDoc);
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

        if (!isValidForm()) {
            setFormState((prev) => ({
                ...prev,
                isValid: false,
                loading: false,
            }));
            toast.error("Formulario invalido");
            return;
        }

        if (user && user.id) {
            let thereAreActiveReqs = await toast.promise(
                EditLICC_thereAreActiveReqs(user.id, type),
                {
                    pending: "Verificando peticiones activas",
                    success: "Verificado",
                    error: "Error verificando peticiones activas, inténtalo de nuevo por favor",
                },
            );
            if (thereAreActiveReqs) {
                toast.warning(
                    "Ya enviaste una petición para editar tu licencia, espera a que se revise",
                );
                setFormState((prev) => ({
                    ...prev,
                    loading: false,
                }));
                return;
            } else {
                toast.success(
                    "Valido para enviar una nueva petición para actualizar tu licencia",
                );
            }
        }

        try {
            const res = await toast.promise(uploadImages(), {
                pending: "Subiendo imágenes, por favor espera",
                success: "Imágenes subidas",
                error: "Error al subir imágenes, inténtalo de nuevo por favor",
            });
            if (res && form.license.expirationDate.value) {
                const { frontImgUrl, behindImgUrl, realTimePhotoImgUrl } = res;
                await toast.promise(
                    uploadForm(
                        {
                            licenseNumber: form.license.number.value,
                            expiredDateLicense: Timestamp.fromDate(
                                form.license.expirationDate.value,
                            ),
                            frontImgUrl: frontImgUrl,
                            backImgUrl: behindImgUrl,
                        },
                        realTimePhotoImgUrl,
                    ),
                    {
                        pending: "Enviando el formulario, por favor espera",
                        success: "Formulario enviado",
                        error: "Error al enviar el formulario, inténtalo de nuevo por favor",
                    },
                );
                toast.info(
                    "Tu solicitud sera revisada por uno de nuestros administradores",
                    {
                        toastId: "toast-info-sent-form-succesful",
                    },
                );
                router.push(`/services/${type === "tow" ? "tow" : "drive"}`);
                setFormState({
                    loading: false,
                    isValid: true,
                });
            }
        } catch (e) {
            setFormState({
                loading: false,
                isValid: false,
            });
        }
    };

    useEffect(() => {
        if (user && user.serviceVehicles) {
            switch (type) {
                case "car":
                case "motorcycle":
                case "tow":
                    var vehicle = user.serviceVehicles[type];
                    if (vehicle) {
                        var license: LicenseInterface = vehicle.license;
                        setForm((prev) => ({
                            ...prev,
                            license: {
                                ...prev.license,
                                number: {
                                    value: license.licenseNumber,
                                    message: null,
                                },
                                expirationDate: {
                                    value: undefined,
                                    message: null,
                                },
                                frontPhoto: {
                                    value: license.frontImgUrl
                                        ? license.frontImgUrl.url
                                        : undefined,
                                    message: license.frontImgUrl
                                        ? null
                                        : "No tienes foto frontal de tu licencia",
                                },
                                behindPhoto: {
                                    value: license.backImgUrl
                                        ? license.backImgUrl.url
                                        : undefined,
                                    message: license.backImgUrl
                                        ? null
                                        : "No tienes foto por atras de tu licencia",
                                },
                            },
                        }));
                    }
                    break;
                default:
                    router.push(
                        `/services/${type === "tow" ? "tow" : "drive"}`,
                    );
                    toast.error("Licencia no encontrada", {
                        toastId: "licence-no-found-error",
                    });
                    break;
            }
        } else {
            router.push(`/services/${type === "tow" ? "tow" : "drive"}`);
            toast.error("Licencia no encontrada", {
                toastId: "licence-no-found-error",
            });
        }
    }, []);

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: isValidForm(),
        });
    }, [form]);

    if (checkingUserAuth) {
        <PageLoading />;
    }

    return (
        form && (
            <div className="service-form-wrapper">
                <div className="max-width-60">
                    <h1 className="text | big bolder">
                        Actualiza tu licencia de conducir
                    </h1>
                    <p className="text | light">
                        Necesitamos verificar que tu licencia sigue siendo
                        valida para que continues trabajando con nosotros.
                    </p>
                </div>
                <form
                    data-state={formState.loading ? "loading" : "loaded"}
                    className="form-sub-container | margin-top-25"
                    onSubmit={handleSubmit}
                >
                    <NumberField
                        field={{
                            values: form.license.number,
                            setter: (e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    license: { ...prev.license, number: e },
                                })),
                            validator: isValidLicenseNumber,
                        }}
                        legend="Número de licencia"
                    />
                    <DateField
                        field={{
                            values: form.license.expirationDate,
                            setter: (e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    license: {
                                        ...prev.license,
                                        expirationDate: e,
                                    },
                                })),
                            validator: isValidLicenseDate,
                        }}
                        legend="Fecha de expiración"
                    />

                    <div className="max-width-60">
                        <ImageUploader
                            uploader={{
                                image: form.license.frontPhoto,
                                setImage: (i) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        frontPhoto: i,
                                    }));
                                },
                            }}
                            content={{
                                legend: "Parte frontal de la licencia",
                                imageInCircle: false,
                                id: "tow-license-front-photo",
                            }}
                        />
                    </div>
                    <div className="max-width-60">
                        <ImageUploader
                            uploader={{
                                image: form.license.behindPhoto,
                                setImage: (i) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        behindPhoto: i,
                                    }));
                                },
                            }}
                            content={{
                                legend: "Parte posterior de la licencia",
                                imageInCircle: false,
                                id: "tow-license-behind-photo",
                            }}
                        />
                    </div>
                    <SelfieSection
                        image={form.selfie}
                        setImage={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                selfie: e,
                            }))
                        }
                    />
                    <button
                        className={`general-button | margin-top-25 max-width-60 touchable ${
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

export default UpdateLicenseForm;
