"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { defaultLicense, PersonalDataFormField, VehicleForm } from "../../FormModels";
import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";
import PersonalDataForm from "../../../form/PersonalDataForm";
import VehiclesForm from "./VehiclesForm";
import SelfieConfirmer from "@/components/form/SelfieConfirmer";
import TermsCheckForm from "@/components/form/TermsCheckForm";
import { defaultPhoto, PhotoField } from "../../FormModels";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
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
import { PDFField } from "@/components/form/PDFUploader";
import { updateIdCard } from "@/utils/requests/IdCardUpdated";

const DriverRegistration = ({
    baseUser,
    defaultTowEnterprise: defaultEnterprise,
}: {
    baseUser: UserInterface | null;
    defaultTowEnterprise: string;
}) => {
    const { user, loadingUser } = useContext(AuthContext);
    const [requesterUser, setRequesterUser] = useState<UserInterface | null>(baseUser);
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
    /* const [pdf, setPdf] = useState<PDFField>({
        value: null,
        message: null,
    }); */

    /* const uploadPDF = async (): Promise<ImgWithRef | null> => {
        if (pdf.value) {
            try {
                return await uploadFileBase64(DirectoryPath.Documents, pdf.value);
            } catch (e) {
                console.log(e);
            }
        }

        return null;
    }; */

    const uploadImages = async () => {
        let vehiclesData: Vehicle[] = [];
        var newProfilePhotoImgUrl: string | ImgWithRef = emptyPhotoWithRef;
        var realTimePhotoImgUrl: ImgWithRef = emptyPhotoWithRef;

        if (requesterUser) {
            newProfilePhotoImgUrl = requesterUser.photoUrl;
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

            for (let i = 0; i < vehicles.length; i++) {
                var vehicle = vehicles[i];
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
        vehiclesData: Vehicle[],
        newProfilePhotoImgUrl: string | ImgWithRef,
        realTimePhotoImgUrl: ImgWithRef,
    ) => {
        if (requesterUser) {
            var formId = nanoid(30);
            try {
                await saveDriveReq(
                    formId,
                    driveReqBuilder(
                        formId,
                        requesterUser.id === undefined ? "" : requesterUser.id,
                        personalData.fullname.value,
                        newProfilePhotoImgUrl,
                        vehiclesData,
                        realTimePhotoImgUrl,
                        requesterUser.services,
                        requesterUser.location === undefined
                            ? Locations.CochabambaBolivia
                            : requesterUser.location,
                        defaultEnterprise
                    ),
                );

                var newReqState;
                if (vehicles.length > 1) {
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
                        vehicles[0].type.type === VehicleType.CAR
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
        if (!formState.loading) {
            setFormState({
                ...formState,
                loading: true,
            });
            var isValid = verifyNoEmptyData(
                personalData,
                vehicles,
                userConfirmation,
                acceptedTerms,
                personalData.idCard,
            );
            if (isValid) {
                isValid = isValidForm(
                    personalData,
                    vehicles,
                    userConfirmation,
                    acceptedTerms,
                    personalData.idCard,
                );
                if (isValid && requesterUser) {
                    try {
                        await updateIdCard(personalData.idCard, requesterUser);
                        const {
                            vehiclesData,
                            newProfilePhotoImgUrl,
                            realTimePhotoImgUrl,
                        } = await toast.promise(uploadImages(), {
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

    useEffect(
        () =>
            setFormState({
                ...formState,
                isValid: isValidForm(
                    personalData,
                    vehicles,
                    userConfirmation,
                    acceptedTerms,
                    personalData.idCard,
                ),
            }),
        [personalData, vehicles, userConfirmation, acceptedTerms],
    );

    const loadRequesterUser = () => {
        if (!loadingUser && user.data && !requesterUser) {
            setRequesterUser(user.data);
        }
        verifyRefusedReq();
    };

    const verifyRefusedReq = async () => {
        if (requesterUser) {
            var changed = false;
            var toUpdate = {
                ...requesterUser.serviceRequests,
            };
            if (
                requesterUser.serviceRequests &&
                requesterUser.serviceRequests.driveCar &&
                requesterUser.serviceRequests.driveCar.state === ServiceReqState.Refused
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
                requesterUser.serviceRequests &&
                requesterUser.serviceRequests.driveMotorcycle &&
                requesterUser.serviceRequests.driveMotorcycle.state ===
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

            if (changed && requesterUser.id) {
                var toUpdateDoc: Partial<UserInterface> = {
                    serviceRequests: toUpdate,
                };
                try {
                    await updateUser(requesterUser.id, toUpdateDoc);
                } catch (e) {
                    throw e;
                }
            }
        }
    };

    useEffect(() => {
        loadRequesterUser();
    }, [loadingUser]);

    const getState = () => {
        if (requesterUser && requesterUser.serviceRequests) {
            if (
                requesterUser.serviceRequests.driveCar &&
                requesterUser.serviceRequests.driveCar.state === ServiceReqState.Refused
            ) {
                return {
                    title: "La solicitud fue Rechazada!",
                    description:
                        "Puede que alguno de los datos enviados no hayan sido validos, intenta mandar una nueva solicitud.",
                    state: ServiceReqState.Refused,
                };
            } else if (
                requesterUser.serviceRequests.driveMotorcycle &&
                requesterUser.serviceRequests.driveMotorcycle.state ===
                    ServiceReqState.Refused
            ) {
                return {
                    title: "La solicitud fue Rechazada!",
                    description:
                        "Puede que alguno de los datos enviados no hayan sido validos, intenta mandar una nueva solicitud.",
                    state: ServiceReqState.Refused,
                };
            }
        }

        return {
            title: "Solicitud para trabajar como chofer con nosotros!",
            description:
                "Necesitamos verificar que todos los datos que se llenen sean validos antes registrar al nuevo usuario servidor.",
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
                    baseUser={baseUser}
                    personalData={personalData}
                    setPersonalData={setPersonalData}
                />
                <VehiclesForm vehicles={vehicles} setVehicles={setVehicles} />

                {/* <AntecedentsPdf file={pdf} setFile={setPdf} /> */}

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
