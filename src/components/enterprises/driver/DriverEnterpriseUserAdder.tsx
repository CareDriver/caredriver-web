"use client";

import { FormEvent, useEffect, useState } from "react";
import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";
import TermsCheckForm from "@/components/form/TermsCheckForm";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import {
    isValidForm,
    verifyNoEmptyData,
} from "@/utils/validator/service_requests/DriveValidator";
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
import { isImageBase64 } from "@/utils/validator/ImageValidator";
import { updateIdCard } from "@/utils/requests/IdCardUpdated";
import {
    defaultLicense,
    defaultPhoto,
    PersonalDataFormField,
    PhotoField,
    VehicleForm,
} from "@/components/services/FormModels";
import ServiceHeader from "@/components/services/ServiceHeader";
import PersonalDataForm from "@/components/form/PersonalDataForm";
import VehiclesForm from "@/components/services/drive/registration/VehiclesForm";
import { useRouter } from "next/navigation";
import SelfieConfirmer from "@/components/form/SelfieConfirmer";

const loadInitialPersonalData = (userToAdd: UserInterface): PersonalDataFormField => {
    let data = {
        fullname: {
            value: userToAdd.fullName,
            message: null,
        },
        photo: {
            value:
                userToAdd.photoUrl.url.trim().length > 0 ? userToAdd.photoUrl.url : null,
            message: "El usuario no tiene foto de perfil",
        },
        idCard: {
            frontCard: {
                value: userToAdd.identityCard?.frontCard.url
                    ? userToAdd.identityCard?.frontCard.url
                    : null,
                message: userToAdd.identityCard?.frontCard.url
                    ? null
                    : "El usuario no tiene foto de su carnet de la parte anterior",
            },
            backCard: {
                value: userToAdd.identityCard?.backCard.url
                    ? userToAdd.identityCard?.backCard.url
                    : null,
                message: userToAdd.identityCard?.backCard.url
                    ? null
                    : "El usuario no tiene foto de su carnet de la parte posterior",
            },
            location: {
                value: userToAdd.identityCard?.location
                    ? userToAdd.identityCard?.location
                    : "",
                message: userToAdd.identityCard?.location
                    ? null
                    : "El usuario no tiene su localizacion de su carnet agregada",
            },
        },
    };

    return data;
};

const DriverEnterpriseUserAdder = ({ userToAdd }: { userToAdd: UserInterface }) => {
    const router = useRouter();
    const [personalData, setPersonalData] = useState<PersonalDataFormField>(
        loadInitialPersonalData(userToAdd),
    );
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

        if (userToAdd) {
            newProfilePhotoImgUrl = userToAdd.photoUrl;
            if (personalData.photo.value && isImageBase64(personalData.photo.value)) {
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
        var formId = nanoid(30);
        try {
            await saveDriveReq(
                formId,
                driveReqBuilder(
                    formId,
                    userToAdd.id === undefined ? "" : userToAdd.id,
                    personalData.fullname.value,
                    newProfilePhotoImgUrl,
                    vehiclesData,
                    realTimePhotoImgUrl,
                    userToAdd.services,
                    userToAdd.location === undefined
                        ? Locations.CochabambaBolivia
                        : userToAdd.location,
                ),
            );

            var newReqState;
            if (vehicles.length > 1) {
                newReqState = {
                    ...userToAdd.serviceRequests,
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
                              ...userToAdd.serviceRequests,
                              driveCar: {
                                  id: formId,
                                  state: ServiceReqState.Reviewing,
                              },
                          }
                        : {
                              ...userToAdd.serviceRequests,
                              driveMotorcycle: {
                                  id: formId,
                                  state: ServiceReqState.Reviewing,
                              },
                          };
            }

            if (userToAdd.id) {
                var toUpdate: Partial<UserInterface> = {
                    serviceRequests: newReqState,
                };
                try {
                    await updateUser(userToAdd.id, toUpdate);
                } catch (e) {
                    throw e;
                }
            }
        } catch (e) {
            throw e;
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
                if (isValid && userToAdd) {
                    try {
                        await updateIdCard(personalData.idCard, userToAdd);
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
                        router.push("/enterprise/driver");
                        setFormState({
                            loading: false,
                            isValid: true,
                        });
                    } catch (e) {
                        setFormState({
                            loading: false,
                            isValid: false,
                        });
                        router.push("/enterprise/driver");
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

    const verifyRefusedReq = async () => {
        var changed = false;
        var toUpdate = {
            ...userToAdd.serviceRequests,
        };
        if (
            userToAdd.serviceRequests &&
            userToAdd.serviceRequests.driveCar &&
            userToAdd.serviceRequests.driveCar.state === ServiceReqState.Refused
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
            userToAdd.serviceRequests &&
            userToAdd.serviceRequests.driveMotorcycle &&
            userToAdd.serviceRequests.driveMotorcycle.state === ServiceReqState.Refused
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

        if (changed && userToAdd.id) {
            var toUpdateDoc: Partial<UserInterface> = {
                serviceRequests: toUpdate,
            };
            try {
                await updateUser(userToAdd.id, toUpdateDoc);
            } catch (e) {
                throw e;
            }
        }
    };

    useEffect(() => {
        verifyRefusedReq();
    }, []);

    const getState = () => {
        if (userToAdd && userToAdd.serviceRequests) {
            if (
                userToAdd.serviceRequests.driveCar &&
                userToAdd.serviceRequests.driveCar.state === ServiceReqState.Refused
            ) {
                return {
                    title: "La solicitud del usuario fue Rechazada!",
                    description:
                        "Puede que alguno de los datos no fueron validos, pero puedes volver a intentar mandar una nueva solicitud.",
                    state: ServiceReqState.Refused,
                };
            } else if (
                userToAdd.serviceRequests.driveMotorcycle &&
                userToAdd.serviceRequests.driveMotorcycle.state ===
                    ServiceReqState.Refused
            ) {
                return {
                    title: "La solicitud del usuario fue Rechazada!",
                    description:
                        "Puede que alguno de los datos no fueron validos, pero puedes volver a intentar mandar una nueva solicitud.",
                    state: ServiceReqState.Refused,
                };
            }
        }

        return {
            title: "Solicitud para registrar un nuevo chofer",
            description:
                "Por favor, llena este formulario con datos reales para que la solicitud sea aprobada y el usuario pueda empezar a trabajar con nosotros.",
            state: ServiceReqState.NotSent,
        };
    };

    return (
        <div>
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

export default DriverEnterpriseUserAdder;
