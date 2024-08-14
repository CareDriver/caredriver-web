"use client";

import { useContext, useEffect, useState } from "react";
import UserIcon from "@/icons/UserIcon";

import { isValidName } from "@/components/app_modules/users/validators/CredentialsValidator";
import { AuthContext } from "@/context/AuthContext";
import { UserInterface } from "@/interfaces/UserInterface";
import ImageUploader from "../../../../../form/view/attachment_fields/ImageUploader";
import IdentityCardForm from "./IdentityCardForm";
import { PersonalData } from "../../../models/PersonalDataFields";
import TextField from "@/components/form/view/fields/TextField";

interface Props {
    baseUser?: UserInterface;
    personalData: PersonalData;
    setPersonalData: (p: PersonalData) => void;
}

const PersonalDataForm: React.FC<Props> = ({
    baseUser,
    personalData,
    setPersonalData,
}) => {
    const { user, checkingUserAuth } = useContext(AuthContext);
    const [requesterUser, setRequesterUser] = useState<
        UserInterface | undefined
    >(baseUser);
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
        if (!baseUser && user) {
            setRequesterUser(user);
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
                    value:
                        requesterUser.photoUrl.url.length > 0
                            ? requesterUser.photoUrl.url
                            : null,
                    message:
                        requesterUser.photoUrl.url.length > 0
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
                        message:
                            "No se subio una foto frontal del carnet de identidad",
                    },
                    backCard: {
                        value: null,
                        message:
                            "No se subio una foto posterior del carnet de identidad",
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
        if (!checkingUserAuth) {
            loadRequesterUserData();
        }
    }, [checkingUserAuth]);

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
                        <span className="text | bold gray-dark">
                            Cargando datos
                        </span>
                    </span>
                )}
                <div
                    className="form-sub-container"
                    data-state={loading ? "loading" : "loaded"}
                >
                    <TextField
                        field={{
                            values: personalData.fullname,
                            setter: (e) =>
                                setPersonalData({
                                    ...personalData,
                                    fullname: e,
                                }),
                            validator: isValidName,
                        }}
                        legend="Nombre completo"
                    />
                    <ImageUploader
                        uploader={{
                            image: personalData.photo,
                            setImage: (i) => {
                                setPersonalData({
                                    ...personalData,
                                    photo: i,
                                });
                            },
                        }}
                        content={{
                            id: "personal-data-photo-uploader",
                            legend: "Foto de Perfil",
                            imageInCircle: true,
                        }}
                    />
                </div>
            </div>
            <IdentityCardForm
                idCardForm={personalData.idCard}
                setIdCardForm={(i) =>
                    setPersonalData({
                        ...personalData,
                        idCard: i,
                    })
                }
            />
        </>
    );
};

export default PersonalDataForm;
