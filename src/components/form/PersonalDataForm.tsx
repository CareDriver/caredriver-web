"use client";

import ImageUploader from "@/components/form/ImageUploader";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import UserIcon from "@/icons/UserIcon";
import { PersonalDataFormField, PhotoField } from "../services/FormModels";
import { isValidName } from "@/utils/validator/auth/CredentialsValidator";
import { AuthContext } from "@/context/AuthContext";
const PersonalDataForm = ({
    personalData,
    setPersonalData,
}: {
    personalData: PersonalDataFormField;
    setPersonalData: Dispatch<SetStateAction<PersonalDataFormField>>;
}) => {
    const { user, loadingUser } = useContext(AuthContext);
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

    useEffect(() => {
        if (!loadingUser) {
            if (user.data) {
                setPersonalData({
                    fullname: {
                        value: user.data.fullName,
                        message: null,
                    },
                    photo: {
                        value: user.hasPhoto ? user.data.photoUrl : null,
                        message: user.hasPhoto
                            ? null
                            : "No tienes foto de perfil, por favor sube una foto de perfil",
                    },
                });
                setLoading(false);
            } else {
                setPersonalData({
                    fullname: {
                        value: "",
                        message: "Ingresa tu nombre completo por favor",
                    },
                    photo: {
                        value: null,
                        message: "Sube una foto de perfil",
                    },
                });
                setLoading(false);
            }
        }
    }, [loadingUser]);

    return (
        <div className="form-sub-container | margin-top-25 max-width-60">
            <h2 className="text icon-wrapper | medium-big bold">
                <UserIcon />
                Datos Personales
            </h2>

            {loading && (
                <span className="row-wrapper">
                    <span className="loader | loader-gray small-loader"></span>
                    <span className="text | bold gray-dark">Cargando Datos</span>
                </span>
            )}
            <div
                className="form-sub-container"
                data-state={loading ? "loading" : "loaded"}
            >
                <fieldset className="form-section">
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        className="form-section-input"
                        value={personalData.fullname.value}
                        name="fullname"
                        onChange={(e) => handleInputChange(e)}
                    />

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
    );
};

export default PersonalDataForm;
