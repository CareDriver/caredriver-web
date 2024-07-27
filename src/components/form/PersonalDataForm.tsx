"use client";

import ImageUploader from "@/components/form/ImageUploader";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import UserIcon from "@/icons/UserIcon";
import { IdCardForm, PersonalDataFormField, PhotoField } from "../services/FormModels";
import { isValidName } from "@/utils/validator/auth/CredentialsValidator";
import { AuthContext } from "@/context/AuthContext";
import IdentityCardForm from "../services/IdentityCardForm";
import { UserInterface } from "@/interfaces/UserInterface";

const PersonalDataForm = ({
    baseUser,
    personalData,
    setPersonalData,
}: {
    baseUser: UserInterface | null;
    personalData: PersonalDataFormField;
    setPersonalData: Dispatch<SetStateAction<PersonalDataFormField>>;
}) => {
    const { user, loadingUser } = useContext(AuthContext);
    const [requesterUser, setRequesterUser] = useState<UserInterface | null>(baseUser);
    const [loading, setLoading] = useState<boolean>(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const { isValid, message } = isValidName(value);

        setPersonalData({
            ...personalData,
            fullname: {
                value: value,
                message: isValid ? null : message,
            },
        });
    };

    const loadRequesterUserData = () => {
        if (!baseUser && user.data) {
            setRequesterUser(user.data);
        }

        fillInformation();
    };

    const fillInformation = () => {
        if (requesterUser) {
            var hasIdCard: boolean =
                requesterUser.identityCard !== null &&
                requesterUser.identityCard !== undefined;
            setPersonalData({
                fullname: {
                    value: requesterUser.fullName,
                    message: null,
                },
                photo: {
                    value: requesterUser.photoUrl.url.length > 0 ? requesterUser.photoUrl.url : null,
                    message: requesterUser.photoUrl.url.length > 0
                        ? null
                        : "No se subio una foto de perfil, por favor sube una foto",
                },
                idCard: {
                    frontCard: {
                        value: requesterUser.identityCard
                            ? requesterUser.identityCard.frontCard.url
                            : null,
                        message: hasIdCard
                            ? null
                            : "No se subio una foto frontal del carnet de identidad",
                    },
                    backCard: {
                        value: requesterUser.identityCard
                            ? requesterUser.identityCard.backCard.url
                            : null,
                        message: hasIdCard
                            ? null
                            : "No se subio una foto posterior del carnet de identidad",
                    },
                    location: {
                        value: requesterUser.identityCard
                            ? requesterUser.identityCard.location
                            : "",
                        message: hasIdCard
                            ? null
                            : "No se agrego la localización en base al carnet de indentidad",
                    },
                },
            });
            setLoading(false);
        } else {
            setPersonalData({
                fullname: {
                    value: "",
                    message: "Completa este campo por favor",
                },
                photo: {
                    value: null,
                    message: "Sube una foto de perfil",
                },
                idCard: {
                    frontCard: {
                        value: null,
                        message: "No se subio una foto frontal del carnet de identidad",
                    },
                    backCard: {
                        value: null,
                        message: "No se subio una foto posterior del carnet de identidad",
                    },
                    location: {
                        value: "",
                        message:
                            "No se agrego la localización en base al carnet de indentidad",
                    },
                },
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loadingUser) {
            loadRequesterUserData();
        }
    }, [loadingUser]);

    return (
        <>
            <div className="form-sub-container | margin-top-25 max-width-60">
                <h2 className="text icon-wrapper | medium-big bold">
                    <UserIcon />
                    Datos Personales
                </h2>

                {loading && (
                    <span className="row-wrapper">
                        <span className="loader | loader-gray small-loader"></span>
                        <span className="text | bold gray-dark">Cargando datos</span>
                    </span>
                )}
                <div
                    className="form-sub-container"
                    data-state={loading ? "loading" : "loaded"}
                >
                    <fieldset className="form-section">
                        <input
                            type="text"
                            placeholder=""
                            className="form-section-input"
                            value={personalData.fullname.value}
                            name="fullname"
                            onChange={(e) => handleInputChange(e)}
                        />
                        <legend className="form-section-legend">Nombre completo</legend>
                        {personalData.fullname.message && (
                            <small>{personalData.fullname.message}</small>
                        )}
                    </fieldset>
                    <ImageUploader
                        uploader={{
                            image: personalData.photo,
                            setImage: (image: PhotoField) => {
                                setPersonalData({ ...personalData, photo: image });
                            },
                        }}
                        content={{
                            id: "personal-data-photo-uploader",
                            indicator: "Foto de Perfil",
                            isCircle: true,
                        }}
                    />
                </div>
            </div>
            <IdentityCardForm
                idCardForm={personalData.idCard}
                setIdCardForm={(idCardForm: IdCardForm) =>
                    setPersonalData({
                        ...personalData,
                        idCard: idCardForm,
                    })
                }
            />
        </>
    );
};

export default PersonalDataForm;
