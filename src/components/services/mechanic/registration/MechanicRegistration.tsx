"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { EnterpriseField, PersonalDataFormField } from "../../FormModels";
import PersonalDataForm from "../../../form/PersonalDataForm";
import SelfieConfirmer from "@/components/form/SelfieConfirmer";
import TermsCheckForm from "@/components/form/TermsCheckForm";
import { defaultPhoto, PhotoField } from "../../FormModels";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import {
    isValidForm,
    verifyNoEmptyData,
} from "@/utils/validator/service_requests/MechanicValidator";
import { AuthContext } from "@/context/AuthContext";
import { mechanicReqBuilder } from "@/interfaces/UserRequest";
import { Locations } from "@/interfaces/Locations";
import { emptyPhotoWithRef, ImgWithRef } from "@/interfaces/ImageInterface";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { updateUser } from "@/utils/requests/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceReqState } from "@/interfaces/Services";
import ServiceHeader from "../../ServiceHeader";
import { isImageBase64 } from "@/utils/validator/ImageValidator";
import EnterpriseSelector from "../../../enterprises/EnterpriseSelector";
import Warehouse from "@/icons/Warehouse";
import { EnterpriseType } from "@/interfaces/Enterprise";
import { saveMechanicReq } from "@/utils/requests/services/MechanicRequester";
import { updateIdCard } from "@/utils/requests/IdCardUpdated";

const MechanicRegistration = () => {
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

    const [mechanicWorkshop, setMechanicWorkshop] = useState<EnterpriseField>({
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
            newProfilePhotoImgUrl,
            realTimePhotoImgUrl,
        };
    };

    const uploadForm = async (
        newProfilePhotoImgUrl: string | ImgWithRef,
        realTimePhotoImgUrl: ImgWithRef,
    ) => {
        if (user.data) {
            var formId = nanoid(30);
            try {
                await saveMechanicReq(
                    formId,
                    mechanicReqBuilder(
                        formId,
                        user.data.id === undefined ? "" : user.data.id,
                        personalData.fullname.value,
                        newProfilePhotoImgUrl,
                        realTimePhotoImgUrl,
                        user.data.services,
                        user.data.location === undefined
                            ? Locations.CochabambaBolivia
                            : user.data.location,
                        mechanicWorkshop.value,
                    ),
                );

                if (user.data.id) {
                    var toUpdate: Partial<UserInterface> = {
                        serviceRequests: {
                            ...user.data.serviceRequests,
                            mechanic: {
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
        var isValid = verifyNoEmptyData(
            personalData,
            userConfirmation,
            acceptedTerms,
            personalData.idCard,
        );
        if (isValid) {
            isValid = isValidForm(
                personalData,
                userConfirmation,
                acceptedTerms,
                personalData.idCard,
            );
            if (isValid && user.data) {
                try {
                    await updateIdCard(personalData.idCard, user.data);
                    const { newProfilePhotoImgUrl, realTimePhotoImgUrl } =
                        await toast.promise(uploadImages(), {
                            pending: "Subiendo imagenes, por favor espera",
                            success: "Imagenes subidas",
                            error: "Error al subir imagenes, intentalo de nuevo por favor",
                        });
                    await toast.promise(
                        uploadForm(newProfilePhotoImgUrl, realTimePhotoImgUrl),
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

    const verifyRefusedReq = async () => {
        if (!loadingUser && user.data) {
            var changed = false;
            var toUpdate = {
                ...user.data.serviceRequests,
            };
            if (
                user.data.serviceRequests &&
                user.data.serviceRequests.mechanic &&
                user.data.serviceRequests.mechanic.state === ServiceReqState.Refused
            ) {
                toUpdate = {
                    ...toUpdate,
                    mechanic: {
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
                    userConfirmation,
                    acceptedTerms,
                    personalData.idCard,
                ),
            }),
        [personalData, userConfirmation, acceptedTerms],
    );

    const getState = () => {
        if (
            user.data &&
            user.data.serviceRequests &&
            user.data.serviceRequests.mechanic &&
            user.data.serviceRequests.mechanic.state === ServiceReqState.Refused
        ) {
            return {
                title: "Tu solicitud fue Rechazada!",
                description:
                    "Puede que alguno de tus datos no fueron validos, pero puedes volver a intertar mandar una nueva solicitud.",
                state: ServiceReqState.Refused,
            };
        }

        return {
            title: "Solicita trabajar como Mecanico con nosotros!",
            description:
                "Necesitamos verificar que trabajas en un taller antes que empieces a trabajar con nosotros.",
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

                <div className="form-sub-container | margin-top-25 max-width-90">
                    <h2 className="text icon-wrapper | medium-big bold">
                        <Warehouse />
                        Taller mecanico {"(Opcional)"}
                    </h2>

                    <EnterpriseSelector
                        type={EnterpriseType.Mechanical}
                        enterpriseFiled={mechanicWorkshop}
                        setEnterprise={setMechanicWorkshop}
                    />
                    {mechanicWorkshop.message && (
                        <div className="margin-top-15">
                            <small className="form-section-message">
                                {mechanicWorkshop.message}
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

export default MechanicRegistration;
