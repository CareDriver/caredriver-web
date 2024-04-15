"use client";

import { AuthContext } from "@/context/AuthContext";
import { LicenseInterface } from "@/interfaces/PersonalDocumentsInterface";
import { useContext, useEffect, useState } from "react";
import PageLoader from "../PageLoader";
import { useRouter } from "next/navigation";
import ImageUploader from "../form/ImageUploader";
import { defaultPhoto, LicenseForm, PhotoField } from "./FormModels";
import {
    isValidLicenseDate,
    isValidLicenseNumber,
} from "@/utils/validator/service_requests/DriveValidator";
import SelfieConfirmer from "../form/SelfieConfirmer";
import { isValidForm } from "@/utils/validator/service_requests/LicenseValidator";

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

    const updateLicense = async () => {};

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
                router.push(
                    `/services/${
                        type === "car" || type === "motorcycle" ? "drive" : "tow"
                    }`,
                );
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
        <div>
            <div>
                <h1 className="text | big bolder">Actualiza tu licencia de conducir</h1>
                <p>
                    Necesitamos verificar que tu licencia sigue siendo valida para que
                    continues trabajando con nosotros. Las fotos de tu licencia de
                    conducir se eliminaran cuando se acepte o rechaze tu solicitud.
                </p>
            </div>
            <form
                data-state={formState.loading ? "loading" : "loaded"}
                className="form-sub-container | max-width-60"
                onSubmit={updateLicense}
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
