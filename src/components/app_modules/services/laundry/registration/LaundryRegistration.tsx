"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { EnterpriseField, PersonalDataFormField } from "../../FormModels";
import PersonalDataForm from "../../../form/view/forms/PersonalDataForm";
import SelfieSection from "@/components/form/view/sections/SelfieSection";
import PrivacyTermsSection from "@/components/form/view/sections/PrivacyTermsSection";
import { defaultPhoto, PhotoField } from "../../FormModels";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import {
    isValidForm,
    verifyNoEmptyData,
} from "@/utils/validator/service_requests/LaundryValidator";
import { AuthContext } from "@/context/AuthContext";
import { laundryReqBuilder } from "@/interfaces/UserRequest";
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
import { EnterpriseType } from "@/interfaces/Enterprise";
import { updateIdCard } from "@/utils/requests/IdCardUpdated";
import { saveLaundryReq } from "@/utils/requests/services/LaundryRequester";
import Soap from "@/icons/Soap";

const LaundryRegistration = ({
    baseUser,
    defaultTowEnterprise: defaultEnterprise,
}: {
    baseUser: UserInterface | null;
    defaultTowEnterprise: string | null;
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

    const [laundryEnterprise, setLaundryEnterprise] = useState<EnterpriseField>({
        value: defaultEnterprise,
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
        if (requesterUser && laundryEnterprise.value) {
            var formId = nanoid(30);
            try {
                await saveLaundryReq(
                    formId,
                    laundryReqBuilder(
                        formId,
                        requesterUser.id === undefined ? "" : requesterUser.id,
                        personalData.fullname.value,
                        newProfilePhotoImgUrl,
                        realTimePhotoImgUrl,
                        requesterUser.services,
                        requesterUser.location === undefined
                            ? Locations.CochabambaBolivia
                            : requesterUser.location,
                        laundryEnterprise.value,
                    ),
                );

                if (requesterUser.id) {
                    var toUpdate: Partial<UserInterface> = {
                        serviceRequests: {
                            ...requesterUser.serviceRequests,
                            laundry: {
                                id: formId,
                                state: ServiceReqState.Reviewing,
                            },
                        },
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
                userConfirmation,
                acceptedTerms,
                personalData.idCard,
                laundryEnterprise,
            );
            if (isValid) {
                isValid = isValidForm(
                    personalData,
                    userConfirmation,
                    acceptedTerms,
                    personalData.idCard,
                    laundryEnterprise,
                );
                if (isValid && requesterUser) {
                    try {
                        await updateIdCard(personalData.idCard, requesterUser);
                        const { newProfilePhotoImgUrl, realTimePhotoImgUrl } =
                            await toast.promise(uploadImages(), {
                                pending: "Subiendo imágenes, por favor espera",
                                success: "Imágenes subidas",
                                error: "Error al subir imágenes, inténtalo de nuevo por favor",
                            });
                        await toast.promise(
                            uploadForm(newProfilePhotoImgUrl, realTimePhotoImgUrl),
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

    const loadRequesterUser = () => {
        if (!loadingUser && user.data && !requesterUser) {
            setRequesterUser(user.data);
        }
        verifyRefusedReq();
    };

    const verifyRefusedReq = async () => {
        if (!loadingUser && requesterUser) {
            var changed = false;
            var toUpdate = {
                ...requesterUser.serviceRequests,
            };
            if (
                requesterUser.serviceRequests &&
                requesterUser.serviceRequests.laundry &&
                requesterUser.serviceRequests.laundry.state === ServiceReqState.Refused
            ) {
                toUpdate = {
                    ...toUpdate,
                    laundry: {
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

    useEffect(
        () =>
            setFormState({
                ...formState,
                isValid: isValidForm(
                    personalData,
                    userConfirmation,
                    acceptedTerms,
                    personalData.idCard,
                    laundryEnterprise,
                ),
            }),
        [personalData, userConfirmation, acceptedTerms, laundryEnterprise],
    );

    const getState = () => {
        if (
            requesterUser &&
            requesterUser.serviceRequests &&
            requesterUser.serviceRequests.laundry &&
            requesterUser.serviceRequests.laundry.state === ServiceReqState.Refused
        ) {
            return {
                title: "La solicitud fue Rechazada!",
                description:
                    "Puede que alguno de los datos enviados no hayan sido validos, intenta mandar una nueva solicitud.",
                state: ServiceReqState.Refused,
            };
        }

        return {
            title: "Solicitud para trabajar como Lavadero con nosotros!",
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

                {!defaultEnterprise && (
                    <div className="form-sub-container | margin-top-25 max-width-90">
                        <h2 className="text icon-wrapper | medium-big bold">
                            <Soap />
                            Lavadero
                        </h2>

                        <EnterpriseSelector
                            type={EnterpriseType.Laundry}
                            enterpriseFiled={laundryEnterprise}
                            setEnterprise={setLaundryEnterprise}
                        />
                        {laundryEnterprise.message && (
                            <div className="margin-top-15">
                                <small className="form-section-message">
                                    {laundryEnterprise.message}
                                </small>
                            </div>
                        )}
                    </div>
                )}

                <SelfieSection
                    image={userConfirmation}
                    setImage={setUserConfirmation}
                />

                <PrivacyTermsSection
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

export default LaundryRegistration;
