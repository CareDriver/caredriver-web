"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { defaultLicense, PersonalDataFormField, VehicleForm } from "../../FormModels";
import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";
import PersonalDataForm from "../../../form/PersonalDataForm";
import SelfieConfirmer from "@/components/form/SelfieConfirmer";
import TermsCheckForm from "@/components/form/TermsCheckForm";
import { defaultPhoto, PhotoField } from "../../FormModels";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { AuthContext } from "@/context/AuthContext";
import { VehicleTypeAndMode, Vehicle, driveReqBuilder } from "@/interfaces/UserRequest";
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
import SingleVehicleForm from "./SingleVehicleForm";
import {
    isValidForm,
    verifyNoEmptyData,
} from "@/utils/validator/service_requests/NewVehicleValidator";
import { useRouter } from "next/navigation";
import AntecedentsPdf from "@/components/form/AntecedentsPdf";
import { PDFField } from "@/components/form/PDFUploader";
import { updateIdCard } from "@/utils/requests/IdCardUpdated";

const AddNewVehicle = ({
    baseUser,
    defaultTowEnterprise: defaultEnterprise,
    type,
}: {
    baseUser: UserInterface | null;
    defaultTowEnterprise: string;
    type: "car" | "motorcycle";
}) => {
    const { user, loadingUser } = useContext(AuthContext);
    const [requesterUser, setRequesterUser] = useState<UserInterface | null>(baseUser);
    const router = useRouter();
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
    const vehicleTypeAndMode: VehicleTypeAndMode = {
        type: type === "car" ? VehicleType.CAR : VehicleType.MOTORCYCLE,
        mode: [VehicleTransmission.AUTOMATIC],
    };

    const [vehicle, setVehicle] = useState<VehicleForm>({
        type: vehicleTypeAndMode,
        license: defaultLicense,
    });

    
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
                        defaultEnterprise,
                    ),
                );

                var newReqState =
                    type === "car"
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
                vehicle,
                userConfirmation,
                acceptedTerms,
                personalData.idCard,
            );
            if (isValid) {
                isValid = isValidForm(
                    personalData,
                    vehicle,
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
                    vehicle,
                    userConfirmation,
                    acceptedTerms,
                    personalData.idCard,
                ),
            }),
        [personalData, vehicle, userConfirmation, acceptedTerms],
    );

    const loadRequesterUser = () => {
        if (!loadingUser && user.data && !requesterUser) {
            setRequesterUser(user.data);
        }
        verifyRequestAvailability();
    };

    const verifyRequestAvailability = () => {
        if (requesterUser && requesterUser.serviceVehicles) {
            var isValid = requesterUser.serviceVehicles[type] !== undefined;
            if (isValid) {
                router.push("/services/drive");
                toast.error("Ya registraste este vehículo", {
                    toastId: "vehicle-already-registered-message",
                });
            }
            isValid =
                type === "car"
                    ? requesterUser.serviceRequests !== undefined &&
                      requesterUser.serviceRequests.driveCar !== undefined &&
                      requesterUser.serviceRequests.driveCar.state ===
                          ServiceReqState.Reviewing
                    : requesterUser.serviceRequests !== undefined &&
                      requesterUser.serviceRequests.driveMotorcycle !== undefined &&
                      requesterUser.serviceRequests.driveMotorcycle.state ===
                          ServiceReqState.Reviewing;
            if (isValid) {
                router.push("/services/drive");
                toast.error("Tu petición esta siendo revisada", {
                    toastId: "vehicle-already-registered-like-req-message",
                });
            }
        }
    };

    useEffect(() => {
        if (!loadingUser) {
            loadRequesterUser();
        }
    }, [loadingUser]);

    return (
        <div className="service-form-wrapper">
            <div>
                <h1 className="text | big bolder">Agregar un nuevo Vehículo</h1>
                <p className="text | bold">
                    Por favor llena este formulario con datos reales para que tu solicitud
                    sea aprobada y puedas empezar a trabajar con este nuevo vehículo.
                </p>
            </div>
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
                <SingleVehicleForm vehicle={vehicle} setVehicle={setVehicle} />

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

export default AddNewVehicle;
