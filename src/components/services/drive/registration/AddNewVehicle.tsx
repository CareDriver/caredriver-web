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

const AddNewVehicle = ({ type }: { type: "car" | "motorcycle" }) => {
    const { user, loadingUser } = useContext(AuthContext);
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

    const [pdf, setPdf] = useState<PDFField>({
        value: null,
        message: null,
    });

    const [userConfirmation, setUserConfirmation] = useState<PhotoField>(defaultPhoto);
    const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
    const [formState, setFormState] = useState({
        isValid: true,
        loading: false,
    });

    const uploadPDF = async (): Promise<ImgWithRef | null> => {
        if (pdf.value) {
            try {
                return await uploadFileBase64(DirectoryPath.Documents, pdf.value);
            } catch (e) {
                console.log(e);
            }
        }

        return null;
    };

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
        pdfRef: ImgWithRef,
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
                        pdfRef,
                    ),
                );

                var newReqState =
                    type === "car"
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
            vehicle,
            userConfirmation,
            acceptedTerms,
            pdf,
        );
        if (isValid) {
            isValid = isValidForm(
                personalData,
                vehicle,
                userConfirmation,
                acceptedTerms,
                pdf,
            );
            if (isValid && user.data) {
                try {
                    const { vehiclesData, newProfilePhotoImgUrl, realTimePhotoImgUrl } =
                        await toast.promise(uploadImages(), {
                            pending: "Subiendo imagenes, por favor espera",
                            success: "Imagenes subidas",
                            error: "Error al subir imagenes, intentalo de nuevo por favor",
                        });

                    const pdfRef = await toast.promise(uploadPDF(), {
                        pending: "Subiendo PDF",
                        success: "PDF subido",
                        error: "Error al subir el PDF, intentalo de nuevo",
                    });
                    if (pdfRef) {
                        await toast.promise(
                            uploadForm(
                                vehiclesData,
                                newProfilePhotoImgUrl,
                                realTimePhotoImgUrl,
                                pdfRef,
                            ),
                            {
                                pending: "Enviando el formulario, por favor espera",
                                success: "Formulario enviado",
                                error: "Error al enviar el formulario, intentalo de nuevo por favor",
                            },
                        );
                        window.location.replace("/services/drive");
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
                    vehicle,
                    userConfirmation,
                    acceptedTerms,
                    pdf,
                ),
            }),
        [personalData, vehicle, userConfirmation, acceptedTerms],
    );

    useEffect(() => {
        if (!loadingUser) {
            if (user.data && user.data.serviceVehicles) {
                var isValid = user.data.serviceVehicles[type] !== undefined;
                if (isValid) {
                    router.push("/services/drive");
                    toast.error("Ya registraste este vehiculo", {
                        toastId: "vehicle-already-registered-message",
                    });
                }
                isValid =
                    type === "car"
                        ? user.data.serviceRequests !== undefined &&
                          user.data.serviceRequests.driveCar !== undefined &&
                          user.data.serviceRequests.driveCar.state ===
                              ServiceReqState.Reviewing
                        : user.data.serviceRequests !== undefined &&
                          user.data.serviceRequests.driveMotorcycle !== undefined &&
                          user.data.serviceRequests.driveMotorcycle.state ===
                              ServiceReqState.Reviewing;
                if (isValid) {
                    router.push("/services/drive");
                    toast.error("Tu peticion esta siendo revisada", {
                        toastId: "vehicle-already-registered-like-req-message",
                    });
                }
            }
        }
    }, [loadingUser]);

    return (
        <div className="service-form-wrapper" onSubmit={(e) => handleSubmit(e)}>
            <div>
                <h1 className="text | big bolder">Agregar un nuevo Vehiculo</h1>
                <p className="text | bold">
                    Por favor llena este formulario con datos reales para que tu solicitud
                    sea aprovada y puedas empezar a trabajar con este nuevo vehiculo.
                </p>
            </div>
            <form
                className="form-sub-container"
                data-state={formState.loading ? "loading" : "loaded"}
            >
                <PersonalDataForm
                    personalData={personalData}
                    setPersonalData={setPersonalData}
                />
                <SingleVehicleForm vehicle={vehicle} setVehicle={setVehicle} />

                <AntecedentsPdf file={pdf} setFile={setPdf} />

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
