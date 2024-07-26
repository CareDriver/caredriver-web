"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import {
    defaultLicense,
    EnterpriseField,
    PersonalDataFormField,
    VehicleForm,
} from "../../FormModels";
import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";
import PersonalDataForm from "../../../form/PersonalDataForm";
import SelfieConfirmer from "@/components/form/SelfieConfirmer";
import TermsCheckForm from "@/components/form/TermsCheckForm";
import { defaultPhoto, PhotoField } from "../../FormModels";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import {
    isValidForm,
    verifyNoEmptyData,
} from "@/utils/validator/service_requests/TowValidator";
import { AuthContext } from "@/context/AuthContext";
import { Vehicle, emptyVehicleCar, towReqBuilder } from "@/interfaces/UserRequest";
import { Timestamp } from "firebase/firestore";
import { Locations } from "@/interfaces/Locations";
import { emptyPhotoWithRef, ImgWithRef } from "@/interfaces/ImageInterface";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { updateUser } from "@/utils/requests/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceReqState } from "@/interfaces/Services";
import ServiceHeader from "../../ServiceHeader";
import { isImageBase64 } from "@/utils/validator/ImageValidator";
import TowVehicle from "./TowVehicle";
import EnterpriseSelector from "@/components/enterprises/EnterpriseSelector";
import { EnterpriseType } from "@/interfaces/Enterprise";
import { saveTowReq } from "@/utils/requests/services/TowRequester";
import Building from "@/icons/Building";
import { updateIdCard } from "@/utils/requests/IdCardUpdated";

const TowRegistration = () => {
    const { user, loadingUser } = useContext(AuthContext);
    const [personalData, setPersonalData] = useState<PersonalDataFormField>({
        fullname: {
            value: "",
            message: null,
        },
        photo: {
            value: null,
            message: null,
        },
        idCard: {
            frontCard: {
                value: null,
                message: null,
            },
            backCard: {
                value: null,
                message: null,
            },
            location: {
                value: "",
                message: null,
            },
        },
    });
    const [vehicle, setVehicle] = useState<VehicleForm>({
        type: {
            type: VehicleType.CAR,
            mode: [VehicleTransmission.AUTOMATIC],
        },
        license: defaultLicense,
    });

    const [towEnterprise, setTowEnterprise] = useState<EnterpriseField>({
        value: null,
        message: null,
    });

    const [userConfirmation, setUserConfirmation] = useState<PhotoField>(defaultPhoto);
    const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
    const [formState, setFormState] = useState({
        isValid: true,
        loading: false,
    });

    const uploadImages = async () => {
        let vehiclesData: Vehicle = emptyVehicleCar;
        var newProfilePhotoImgUrl: string | ImgWithRef = emptyPhotoWithRef;
        var realTimePhotoImgUrl: ImgWithRef = emptyPhotoWithRef;

        if (user.data) {
            newProfilePhotoImgUrl = user.data.photoUrl;
            if (
                !loadingUser &&
                personalData.photo.value &&
                isImageBase64(personalData.photo.value)
            ) {
                try {
                    newProfilePhotoImgUrl = await uploadFileBase64(
                        DirectoryPath.TempProfilePhotos,
                        personalData.photo.value,
                    );
                } catch (e) {
                    throw e;
                }
            }

            if (vehicle.license.frontPhoto.value && vehicle.license.behindPhoto.value) {
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
                        vehiclesData = {
                            type: vehicle.type,
                            license: {
                                licenseNumber: vehicle.license.number.value,
                                expiredDateLicense: Timestamp.fromDate(
                                    vehicle.license.expirationDate.value,
                                ),
                                frontImgUrl: frontImgUrl,
                                backImgUrl: behindImgUrl,
                            },
                        };
                    }
                } catch (e) {
                    throw e;
                }
            }

            if (userConfirmation.value) {
                try {
                    realTimePhotoImgUrl = await uploadFileBase64(
                        DirectoryPath.Selfies,
                        userConfirmation.value,
                    );
                } catch (e) {
                    throw e;
                }
            }
        }

        return {
            vehiclesData,
            newProfilePhotoImgUrl,
            realTimePhotoImgUrl,
        };
    };

    const uploadForm = async (
        vehicleData: Vehicle,
        newProfilePhotoImgUrl: string | ImgWithRef,
        realTimePhotoImgUrl: ImgWithRef,
    ) => {
        if (user.data && towEnterprise.value) {
            var formId = nanoid(30);
            try {
                await saveTowReq(
                    formId,
                    towReqBuilder(
                        formId,
                        user.data.id === undefined ? "" : user.data.id,
                        personalData.fullname.value,
                        newProfilePhotoImgUrl,
                        towEnterprise.value,
                        realTimePhotoImgUrl,
                        user.data.services,
                        user.data.location === undefined
                            ? Locations.CochabambaBolivia
                            : user.data.location,
                        [vehicleData],
                    ),
                );

                if (user.data.id) {
                    var toUpdate: Partial<UserInterface> = {
                        serviceRequests: {
                            ...user.data.serviceRequests,
                            tow: {
                                id: formId,
                                state: ServiceReqState.Reviewing,
                            },
                        },
                    };
                    try {
                        await updateUser(user.data.id, toUpdate);
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
        if (!formState.loading) {
            setFormState({
                ...formState,
                loading: true,
            });
            if (!towEnterprise.value) {
                setTowEnterprise({
                    ...towEnterprise,
                    message: "Por favor selecciona la Empresa de Grúa en la que trabajas",
                });
            }
            var isValid = verifyNoEmptyData(
                personalData,
                vehicle,
                userConfirmation,
                acceptedTerms,
                towEnterprise,
                personalData.idCard,
            );
            if (isValid) {
                isValid = isValidForm(
                    personalData,
                    vehicle,
                    userConfirmation,
                    acceptedTerms,
                    towEnterprise,
                    personalData.idCard,
                );
                if (isValid && user.data) {
                    try {
                        await updateIdCard(personalData.idCard, user.data);
                        const { vehiclesData, newProfilePhotoImgUrl, realTimePhotoImgUrl } =
                            await toast.promise(uploadImages(), {
                                pending: "Subiendo imágenes, por favor espera",
                                success: "Imágenes subidas",
                                error: "Error al subir imágenes, inténtalo de nuevo por favor",
                            });
                        await toast.promise(
                            uploadForm(
                                vehiclesData,
                                newProfilePhotoImgUrl,
                                realTimePhotoImgUrl,
                            ),
                            {
                                pending: "Enviando el formulario, por favor espera",
                                success: "Formulario enviado",
                                error: "Error al enviar el formulario, inténtalo de nuevo por favor",
                            },
                        );
                        window.location.reload();
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
                toast.error("Por favor llena los campos que están vacíos", {
                    toastId: "toast-error-empty-form",
                });
            }
        }
    };

    const verifyRefusedReq = async () => {
        if (!loadingUser && user.data) {
            var changed = false;
            var toUpdate = {
                ...user.data.serviceRequests,
            };
            if (
                user.data.serviceRequests &&
                user.data.serviceRequests.tow &&
                user.data.serviceRequests.tow.state === ServiceReqState.Refused
            ) {
                toUpdate = {
                    ...toUpdate,
                    tow: {
                        id: "",
                        state: ServiceReqState.NotSent,
                    },
                };
                changed = true;
            }

            if (changed && user.data.id) {
                var toUpdateDoc: Partial<UserInterface> = {
                    serviceRequests: toUpdate,
                };
                try {
                    await updateUser(user.data.id, toUpdateDoc);
                } catch (e) {
                    throw e;
                }
            }
        }
    };

    useEffect(() => {
        verifyRefusedReq();
    }, [loadingUser]);

    useEffect(
        () =>
            setFormState({
                ...formState,
                isValid: isValidForm(
                    personalData,
                    vehicle,
                    userConfirmation,
                    acceptedTerms,
                    towEnterprise,
                    personalData.idCard,
                ),
            }),
        [personalData, vehicle, userConfirmation, acceptedTerms],
    );

    const getState = () => {
        if (
            user.data &&
            user.data.serviceRequests &&
            user.data.serviceRequests.tow &&
            user.data.serviceRequests.tow.state === ServiceReqState.Refused
        ) {
            return {
                title: "Tu solicitud fue Rechazada!",
                description:
                    "Puede que alguno de tus datos no fueron validos, pero puedes volver a intentar mandar una nueva solicitud.",
                state: ServiceReqState.Refused,
            };
        }

        return {
            title: "Solicita trabajar como Operador de Grúa con nosotros!",
            description:
                "Por favor llena este formulario con datos reales para que tu solicitud sea aprobada y puedas empezar a trabajar con nosotros.",
            state: ServiceReqState.NotSent,
        };
    };

    return (
        <div className="service-form-wrapper">
            <ServiceHeader data={getState()} />
            <form
                className="form-sub-container"
                data-state={formState.loading ? "loading" : "loaded"}
                onSubmit={(e) => handleSubmit(e)}
            >
                <PersonalDataForm
                    personalData={personalData}
                    setPersonalData={setPersonalData}
                />
                <TowVehicle vehicle={vehicle} setVehicle={setVehicle} />

                <div className="form-sub-container | margin-top-25">
                    <h2 className="text icon-wrapper | medium-big bold">
                        <Building />
                        Empresa de Grúa
                    </h2>

                    <EnterpriseSelector
                        type={EnterpriseType.Tow}
                        enterpriseFiled={towEnterprise}
                        setEnterprise={setTowEnterprise}
                    />
                    {towEnterprise.message && (
                        <div className="margin-top-15">
                            <small className="form-section-message">
                                {towEnterprise.message}
                            </small>
                        </div>
                    )}
                </div>

                <SelfieConfirmer
                    image={userConfirmation}
                    setImage={setUserConfirmation}
                />

                <TermsCheckForm
                    isAcceptedTerms={acceptedTerms}
                    setAcceptedTerms={setAcceptedTerms}
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
    );
};

export default TowRegistration;
