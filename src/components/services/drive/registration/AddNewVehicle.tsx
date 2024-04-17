"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { defaultLicense, PersonalDataFormField, VehicleForm } from "../../FormModels";
import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";
import PersonalDataForm from "../../../form/PersonalDataForm";
import SelfieConfirmer from "@/components/form/SelfieConfirmer";
import TermsCheckForm from "@/components/form/TermsCheckForm";
import { defaultPhoto, PhotoField } from "../../FormModels";
import { uploadImageBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { AuthContext } from "@/context/AuthContext";
import {
    CarType,
    MotorcycleType,
    Vehicle,
    driveReqBuilder,
} from "@/interfaces/UserRequest";
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
    });
    const carVehicle: CarType = {
        type: VehicleType.CAR,
        mode: VehicleTransmission.AUTOMATIC,
    };

    const motorcycleVehicle: MotorcycleType = {
        type: VehicleType.MOTORCYCLE,
    };

    const [vehicle, setVehicle] = useState<VehicleForm>({
        type: type === "car" ? carVehicle : motorcycleVehicle,
        license: defaultLicense,
    });
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

            if (vehicle.license.frontPhoto.value && vehicle.license.behindPhoto.value) {
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
        );
        if (isValid) {
            isValid = isValidForm(personalData, vehicle, userConfirmation, acceptedTerms);
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
                    window.location.replace("/services/drive");
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
                    vehicle,
                    userConfirmation,
                    acceptedTerms,
                ),
            }),
        [personalData, vehicle, userConfirmation, acceptedTerms],
    );

    useEffect(() => {
        if (!loadingUser) {
            if (user.data && user.data.licenses) {
                var isValid = user.data.licenses[type] !== undefined;
                if (isValid) {
                    router.push("/services/drive");
                    toast.error("Ya registraste este vehiculo", {
                        toastId: "vehicle-already-registered-message",
                    });
                }
                isValid =
                    type === "car"
                        ? user.data.serviceRequests.driveCar.state ===
                          ServiceReqState.Reviewing
                        : user.data.serviceRequests.driveMotorcycle.state ===
                          ServiceReqState.Reviewing;
                if (isValid) {
                    router.push("/services/drive");
                    toast.error(
                        "Tu peticion esta siendo revisada, no puedes enviar otra",
                        {
                            toastId: "vehicle-already-registered-like-req-message",
                        },
                    );
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
                className="form-sub-container | max-width-60"
                data-state={formState.loading ? "loading" : "loaded"}
            >
                <PersonalDataForm
                    personalData={personalData}
                    setPersonalData={setPersonalData}
                />
                <SingleVehicleForm vehicle={vehicle} setVehicle={setVehicle} />

                <SelfieConfirmer
                    image={userConfirmation}
                    setImage={setUserConfirmation}
                />

                <TermsCheckForm
                    isAcceptedTerms={acceptedTerms}
                    setAcceptedTerms={setAcceptedTerms}
                />
                <button
                    className={`general-button | margin-top-25 touchable ${
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
