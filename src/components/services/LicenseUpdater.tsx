"use client";

import { AuthContext } from "@/context/AuthContext";
import {
    LicenseInterface,
    LicenseUpdateReq,
} from "@/interfaces/PersonalDocumentsInterface";
import { FormEvent, useContext, useEffect, useState } from "react";
import PageLoader from "../PageLoader";
import { useRouter } from "next/navigation";
import ImageUploader from "../form/ImageUploader";
import { defaultPhoto, LicenseForm, PhotoField } from "./FormModels";
import {
    isValidLicenseDate,
    isValidLicenseNumber,
} from "@/utils/validator/service_requests/DriveValidator";
import SelfieConfirmer from "../form/SelfieConfirmer";
import {
    isValidForm,
    verifyNoEmptyData,
} from "@/utils/validator/service_requests/LicenseValidator";
import { toast } from "react-toastify";
import { sendLicenseUpdateReq } from "@/utils/requests/LicenseUpdaterReq";
import { emptyPhotoWithRef, ImgWithRef } from "@/interfaces/ImageInterface";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { uploadImageBase64 } from "@/utils/requests/FileUploader";
import { nanoid } from "nanoid";
import { Timestamp } from "firebase/firestore";

const LicenseUpdater = ({ type }: { type: "car" | "motorcycle" | "tow" }) => {
    const router = useRouter();
    const { loadingUser, user } = useContext(AuthContext);
    const [license, setLicense] = useState<LicenseForm | null>(null);
    const [userConfirmation, setUserConfirmation] = useState<PhotoField>(defaultPhoto);
    const [formState, setFormState] = useState({
        isValid: true,
        loading: false,
    });

    const updateNumberLicense = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (license) {
            const value = e.target.value;
            const { isValid, message } = isValidLicenseNumber(value);

            setLicense({
                ...license,
                number: {
                    value: value,
                    message: isValid ? null : message,
                },
            });
        }
    };

    const updateDateLicense = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (license) {
            const dateString = event.target.value;
            const [year, month, day] = dateString.split("-").map(Number);
            const selectedDate = new Date(year, month - 1, day);
            const { isValid, message } = isValidLicenseDate(selectedDate);
            setLicense({
                ...license,
                expirationDate: {
                    value: selectedDate,
                    message: isValid ? null : message,
                },
            });
        }
    };

    const uploadImages = async () => {
        var frontImgUrl: ImgWithRef = emptyPhotoWithRef;
        var behindImgUrl: ImgWithRef = emptyPhotoWithRef;
        var realTimePhotoImgUrl: ImgWithRef = emptyPhotoWithRef;

        if (user.data && license) {
            if (license.frontPhoto.value && license.behindPhoto.value) {
                try {
                    frontImgUrl = await uploadImageBase64(
                        DirectoryPath.Licenses,
                        license.frontPhoto.value,
                    );
                    behindImgUrl = await uploadImageBase64(
                        DirectoryPath.Licenses,
                        license.behindPhoto.value,
                    );
                } catch (e) {
                    throw e;
                }
            }

            if (userConfirmation.value) {
                try {
                    realTimePhotoImgUrl = await uploadImageBase64(
                        DirectoryPath.Selfies,
                        userConfirmation.value,
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
    };

    const uploadForm = async (
        vehiclesData: LicenseInterface,
        realTimePhotoImgUrl: ImgWithRef,
    ) => {
        if (user.data && user.data.id) {
            var formId = nanoid(30);
            try {
                var reqDoc: LicenseUpdateReq = {
                    id: formId,
                    userId: user.data.id,
                    vehicleType: type,
                    licenseNumber: vehiclesData.licenseNumber,
                    expiredDateLicense: vehiclesData.expiredDateLicense,
                    frontImgUrl: vehiclesData.frontImgUrl,
                    backImgUrl: vehiclesData.backImgUrl,
                    realTimePhotoImgUrl: realTimePhotoImgUrl,
                };
                await sendLicenseUpdateReq(formId, reqDoc);
            } catch (e) {
                throw e;
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormState({
            ...formState,
            loading: true,
        });
        var isValid = verifyNoEmptyData(license, userConfirmation);
        if (isValid) {
            isValid = isValidForm(license, userConfirmation);
            if (
                isValid &&
                user.data &&
                license &&
                license.number.value &&
                license.expirationDate.value &&
                license.frontPhoto.value &&
                license.behindPhoto.value
            ) {
                try {
                    const { frontImgUrl, behindImgUrl, realTimePhotoImgUrl } =
                        await toast.promise(uploadImages(), {
                            pending: "Subiendo imagenes, por favor espera",
                            success: "Imagenes subidas",
                            error: "Error al subir imagenes, intentalo de nuevo por favor",
                        });
                    await toast.promise(
                        uploadForm(
                            {
                                licenseNumber: license.number.value,
                                expiredDateLicense: Timestamp.fromDate(
                                    license.expirationDate.value,
                                ),
                                frontImgUrl: frontImgUrl,
                                backImgUrl: behindImgUrl,
                            },
                            realTimePhotoImgUrl,
                        ),
                        {
                            pending: "Enviando el formulario, por favor espera",
                            success: "Formulario enviado",
                            error: "Error al enviar el formulario, intentalo de nuevo por favor",
                        },
                    );
                    toast.info(
                        "Tu solicitud sera revisada por uno de nuestros administradores",
                        {
                            toastId: "toast-info-sent-form-succesful",
                        },
                    );
                    router.push(
                        `/services/${type === "tow" ? "tow" : "drive"}`,
                    );
                    setFormState({
                        loading: false,
                        isValid: true,
                    });
                } catch (e) {
                    setFormState({
                        loading: false,
                        isValid: false,
                    });
                    window.location.reload();
                }
            } else {
                setFormState({
                    loading: false,
                    isValid: false,
                });
                toast.error("Por favor llena los campos con datos validos", {
                    toastId: "toast-error-invalid-form",
                });
            }
        } else {
            setFormState({
                loading: false,
                isValid: false,
            });
            toast.error("Por favor llena los campos que estan vacios", {
                toastId: "toast-error-empty-form",
            });
        }
    };

    useEffect(() => {
        if (!loadingUser && user.data && user.data.licenses) {
            if (user.data.licenses[type] !== undefined) {
                var license: LicenseInterface = user.data.licenses[type];
                setLicense({
                    number: {
                        value: license.licenseNumber,
                        message: null,
                    },
                    expirationDate: {
                        value: null,
                        message: null,
                    },
                    frontPhoto: {
                        value: null,
                        message: null,
                    },
                    behindPhoto: {
                        value: null,
                        message: null,
                    },
                });
            } else {
                router.push(`/services/${type === "tow" ? "tow" : "drive"}`);
                toast.error("Licencia no encontrada", {
                    toastId: "licence-no-found-error",
                });
            }
        }
    }, [loadingUser]);

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: isValidForm(license, userConfirmation),
        });
    }, [license, userConfirmation]);

    return loadingUser ? (
        <PageLoader />
    ) : license ? (
        <div className="service-form-wrapper">
            <div className="max-width-60">
                <h1 className="text | big bolder">Actualiza tu licencia de conducir</h1>
                <p className="text | bold">
                    Necesitamos verificar que tu licencia sigue siendo valida para que
                    continues trabajando con nosotros. Las fotos de tu licencia de
                    conducir se eliminaran cuando se acepte o rechaze tu solicitud.
                </p>
            </div>
            <form
                data-state={formState.loading ? "loading" : "loaded"}
                className="form-sub-container | max-width-60 margin-top-25"
                onSubmit={handleSubmit}
            >
                <fieldset className="form-section">
                    <input
                        type="text"
                        placeholder="Numero"
                        name="number"
                        value={license.number.value}
                        onChange={(e) => updateNumberLicense(e)}
                        className="form-section-input"
                    />
                    {license.number.message && <small>{license.number.message}</small>}
                </fieldset>
                <fieldset className="form-section">
                    <input
                        type="date"
                        name="expirationDate"
                        onChange={(e) => updateDateLicense(e)}
                        className="form-section-input"
                    />
                    {license.expirationDate.message && (
                        <small>{license.expirationDate.message}</small>
                    )}
                </fieldset>
                <ImageUploader
                    uploader={{
                        image: license.frontPhoto,
                        setImage: (image: PhotoField) => {
                            setLicense({
                                ...license,
                                frontPhoto: image,
                            });
                        },
                    }}
                    content={{
                        indicator: "Parte Frontal de la Licencia",
                        isCircle: false,
                        id: "tow-license-front-photo",
                    }}
                />
                <ImageUploader
                    uploader={{
                        image: license.behindPhoto,
                        setImage: (image: PhotoField) => {
                            setLicense({
                                ...license,
                                behindPhoto: image,
                            });
                        },
                    }}
                    content={{
                        indicator: "Parte Posterior de la Licencia",
                        isCircle: false,
                        id: "tow-license-behind-photo",
                    }}
                />
                <SelfieConfirmer
                    image={userConfirmation}
                    setImage={setUserConfirmation}
                />
                <button
                    className={`general-button | margin-top-25 ${
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
    ) : (
        <div>Licencia no encontrada</div>
    );
};

export default LicenseUpdater;
