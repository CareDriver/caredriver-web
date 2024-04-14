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
import { uploadImageBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import {
    isValidForm,
    verifyNoEmptyData,
} from "@/utils/validator/service_requests/TowValidator";
import { AuthContext } from "@/context/AuthContext";
import {
    Vehicle,
    driveReqBuilder,
    emptyVehicleCar,
    towReqBuilder,
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
import ServiceHeader from "../../ServiceHeader";
import { isImageBase64 } from "@/utils/validator/ImageValidator";
import TowVehicle from "./TowVehicle";
import EnterpriseSelector from "@/components/enterprises/EnterpriseSelector";
import { EnterpriseType } from "@/interfaces/Enterprise";
import { saveTowReq } from "@/utils/requests/services/TowRequester";

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
    });
    const [vehicle, setVehicle] = useState<VehicleForm>({
        type: {
            type: VehicleType.CAR,
            mode: VehicleTransmission.AUTOMATIC,
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
        setFormState({
            ...formState,
            loading: true,
        });
        if (!towEnterprise.value) {
            setTowEnterprise({
                ...towEnterprise,
                message: "Por favor selecciona la Empresa de Grua en la que trabajas",
            });
        }
        var isValid = verifyNoEmptyData(
            personalData,
            vehicle,
            userConfirmation,
            acceptedTerms,
            towEnterprise,
        );
        if (isValid) {
            isValid = isValidForm(
                personalData,
                vehicle,
                userConfirmation,
                acceptedTerms,
                towEnterprise,
            );
            if (isValid && user.data) {
                const { vehiclesData, newProfilePhotoImgUrl, realTimePhotoImgUrl } =
                    await toast.promise(uploadImages(), {
                        pending: "Subiendo imagenes, por favor espera",
                        success: "Imagenes subidas",
                        error: "Error al subir imagenes, intentalo de nuevo por favor",
                    });
                await toast.promise(
                    uploadForm(vehiclesData, newProfilePhotoImgUrl, realTimePhotoImgUrl),
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
            } else {
                setFormState({
                    loading: false,
                    isValid: false,
                });
            }
        } else {
            setFormState({
                loading: false,
                isValid: false,
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
                    towEnterprise,
                ),
            }),
        [personalData, vehicle, userConfirmation, acceptedTerms],
    );

    return (
        <div className="service-form-wrapper" onSubmit={(e) => handleSubmit(e)}>
            <ServiceHeader
                title={
                    user.data &&
                    user.data.serviceRequests.drive.state === ServiceReqState.Refused
                        ? "Tu solicitud fue Rechazada!"
                        : "Solicita trabajar como Chofer con nosotros!"
                }
                description={
                    user.data &&
                    user.data.serviceRequests.drive.state === ServiceReqState.Refused
                        ? "Puede que alguno de tus datos no fueron validos, pero puedes volver a intertar mandar una nueva solicitud."
                        : "Por favor llena este formulario con datos reales para que tu solicitud sea aprovada y puedas empezar a trabajar con nosotros."
                }
                state={
                    user.data
                        ? user.data.serviceRequests.drive.state
                        : ServiceReqState.NotSent
                }
            />
            <form className="form-sub-container | max-width-60">
                <PersonalDataForm
                    personalData={personalData}
                    setPersonalData={setPersonalData}
                />
                <TowVehicle vehicle={vehicle} setVehicle={setVehicle} />

                <EnterpriseSelector
                    type={EnterpriseType.Tow}
                    enterpriseFiled={towEnterprise}
                    setEnterprise={setTowEnterprise}
                />

                <SelfieConfirmer
                    image={userConfirmation}
                    setImage={setUserConfirmation}
                />

                <TermsCheckForm
                    isAcceptedTerms={acceptedTerms}
                    setAcceptedTerms={setAcceptedTerms}
                />
                <button
                    className="general-button | margin-top-25"
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
