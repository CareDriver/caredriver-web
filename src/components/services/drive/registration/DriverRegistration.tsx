"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import {
    defaultLicense,
    PersonalData,
    PersonalDataFormField,
    VehicleForm,
} from "../../FormModels";
import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";
import PersonalDataForm from "../../../form/PersonalDataForm";
import VehiclesForm from "./VehiclesForm";
import SelfieConfirmer from "@/components/form/SelfieConfirmer";
import TermsCheckForm from "@/components/form/TermsCheckForm";
import { defaultPhoto, PhotoField } from "../../FormModels";
import { uploadImageBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import {
    isValidForm,
    verifyNoEmptyData,
} from "@/utils/validator/service_requests/DriveValidator";
import { AuthContext } from "@/context/AuthContext";
import { Vehicle, driveReqBuilder } from "@/interfaces/UserRequest";
import { Timestamp } from "firebase/firestore";
import { saveDriveReq } from "@/utils/requests/services/DriveRequester";
import { Locations } from "@/interfaces/Locations";
import { emptyPhotoWithRef, ImgWithRef } from "@/interfaces/ImageInterface";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { updateUser } from "@/utils/requests/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceReqState } from "@/interfaces/Services";
import ServiceHeader from "../../ServiceHeader";
import { isImageBase64 } from "@/utils/validator/ImageValidator";

const DriverRegistration = () => {
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
    });
    const [vehicles, setVehicles] = useState<VehicleForm[]>([
        {
            type: {
                type: VehicleType.CAR,
                mode: [VehicleTransmission.AUTOMATIC],
            },
            license: defaultLicense,
        },
    ]);
    const [userConfirmation, setUserConfirmation] = useState<PhotoField>(defaultPhoto);
    const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
    const [formState, setFormState] = useState({
        isValid: true,
        loading: false,
    });

    const uploadImages = async () => {
        let vehiclesData: Vehicle[] = [];
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
                    newProfilePhotoImgUrl = await uploadImageBase64(
                        DirectoryPath.TempProfilePhotos,
                        personalData.photo.value,
                    );
                } catch (e) {
                    throw e;
                }
            }

            for (let i = 0; i < vehicles.length; i++) {
                var vehicle = vehicles[i];
                if (
                    vehicle.license.frontPhoto.value &&
                    vehicle.license.behindPhoto.value
                ) {
                    try {
                        const frontImgUrl = await uploadImageBase64(
                            DirectoryPath.Licenses,
                            vehicle.license.frontPhoto.value,
                        );
                        const behindImgUrl = await uploadImageBase64(
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
            vehiclesData,
            newProfilePhotoImgUrl,
            realTimePhotoImgUrl,
        };
    };

    const uploadForm = async (
        vehiclesData: Vehicle[],
        newProfilePhotoImgUrl: string | ImgWithRef,
        realTimePhotoImgUrl: ImgWithRef,
    ) => {
        if (user.data) {
            var formId = nanoid(30);
            try {
                await saveDriveReq(
                    formId,
                    driveReqBuilder(
                        formId,
                        user.data.id === undefined ? "" : user.data.id,
                        personalData.fullname.value,
                        newProfilePhotoImgUrl,
                        vehiclesData,
                        realTimePhotoImgUrl,
                        user.data.services,
                        user.data.location === undefined
                            ? Locations.CochabambaBolivia
                            : user.data.location,
                    ),
                );

                var newReqState;
                if (vehicles.length > 1) {
                    newReqState = {
                        ...user.data.serviceRequests,
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
                        vehicles[0].type.type === VehicleType.CAR
                            ? {
                                  ...user.data.serviceRequests,
                                  driveCar: {
                                      id: formId,
                                      state: ServiceReqState.Reviewing,
                                  },
                              }
                            : {
                                  ...user.data.serviceRequests,
                                  driveMotorcycle: {
                                      id: formId,
                                      state: ServiceReqState.Reviewing,
                                  },
                              };
                }

                if (user.data.id) {
                    var toUpdate: Partial<UserInterface> = {
                        serviceRequests: newReqState,
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
        setFormState({
            ...formState,
            loading: true,
        });
        var isValid = verifyNoEmptyData(
            personalData,
            vehicles,
            userConfirmation,
            acceptedTerms,
        );
        if (isValid) {
            isValid = isValidForm(
                personalData,
                vehicles,
                userConfirmation,
                acceptedTerms,
            );
            if (isValid && user.data) {
                try {
                    const { vehiclesData, newProfilePhotoImgUrl, realTimePhotoImgUrl } =
                        await toast.promise(uploadImages(), {
                            pending: "Subiendo imagenes, por favor espera",
                            success: "Imagenes subidas",
                            error: "Error al subir imagenes, intentalo de nuevo por favor",
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
                            error: "Error al enviar el formulario, intentalo de nuevo por favor",
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
            toast.error("Por favor llena los campos que estan vacios", {
                toastId: "toast-error-empty-form",
            });
        }
    };

    useEffect(
        () =>
            setFormState({
                ...formState,
                isValid: isValidForm(
                    personalData,
                    vehicles,
                    userConfirmation,
                    acceptedTerms,
                ),
            }),
        [personalData, vehicles, userConfirmation, acceptedTerms],
    );

    const verifyRefusedReq = async () => {
        if (!loadingUser && user.data) {
            var changed = false;
            var toUpdate = {
                ...user.data.serviceRequests,
            };
            if (
                user.data.serviceRequests &&
                user.data.serviceRequests.driveCar &&
                user.data.serviceRequests.driveCar.state === ServiceReqState.Refused
            ) {
                toUpdate = {
                    ...toUpdate,
                    driveCar: {
                        id: "",
                        state: ServiceReqState.NotSent,
                    },
                };
                changed = true;
            }
            if (
                user.data.serviceRequests &&
                user.data.serviceRequests.driveMotorcycle &&
                user.data.serviceRequests.driveMotorcycle.state ===
                    ServiceReqState.Refused
            ) {
                toUpdate = {
                    ...toUpdate,
                    driveMotorcycle: {
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

    const getState = () => {
        if (user.data && user.data.serviceRequests) {
            if (
                user.data.serviceRequests.driveCar &&
                user.data.serviceRequests.driveCar.state === ServiceReqState.Refused
            ) {
                return {
                    title: "Tu solicitud fue Rechazada!",
                    description:
                        "Puede que alguno de tus datos no fueron validos, pero puedes volver a intertar mandar una nueva solicitud.",
                    state: ServiceReqState.Refused,
                };
            } else if (
                user.data.serviceRequests.driveMotorcycle &&
                user.data.serviceRequests.driveMotorcycle.state ===
                    ServiceReqState.Refused
            ) {
                return {
                    title: "Tu solicitud fue Rechazada!",
                    description:
                        "Puede que alguno de tus datos no fueron validos, pero puedes volver a intertar mandar una nueva solicitud.",
                    state: ServiceReqState.Refused,
                };
            }
        }

        return {
            title: "Solicita trabajar como Chofer con nosotros!",
            description:
                "Por favor llena este formulario con datos reales para que tu solicitud sea aprovada y puedas empezar a trabajar con nosotros.",
            state: ServiceReqState.NotSent,
        };
    };

    return (
        <div className="service-form-wrapper" onSubmit={(e) => handleSubmit(e)}>
            <ServiceHeader data={getState()} />
            <form
                className="form-sub-container"
                data-state={formState.loading ? "loading" : "loaded"}
            >
                <PersonalDataForm
                    personalData={personalData}
                    setPersonalData={setPersonalData}
                />
                <VehiclesForm vehicles={vehicles} setVehicles={setVehicles} />

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

export default DriverRegistration;
