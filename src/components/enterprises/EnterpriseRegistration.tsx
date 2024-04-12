"use client";
import { AuthContext } from "@/context/AuthContext";
import { isValidWorkshopName } from "@/utils/validator/enterprises/EnterpriseValidator";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import PhoneForm from "../form/PhoneForm";
import { isPhoneValid } from "@/utils/validator/auth/CredentialsValidator";
import ImageUploader from "../form/ImageUploader";
import { PhotoField } from "../services/FormModels";
import { Location } from "@/utils/map/Locator";
import MapForm from "../form/MapForm";

interface FormData {
    name: {
        value: string;
        message: string | null;
    };
    phone: {
        value: string;
        message: string | null;
    };
    logo: PhotoField;
    coordinates: Location | null;
}

const EnterpriseRegistration = ({
    formData,
    setFormData,
    summbit,
}: {
    formData: FormData;
    setFormData: Dispatch<SetStateAction<FormData>>;
    summbit: () => Promise<void>;
}) => {
    const { user, loadingUser } = useContext(AuthContext);
    const [formState, setFormState] = useState({
        isValid: true,
        loading: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const { isValid, message } = isValidWorkshopName(value);

        setFormData({
            ...formData,
            name: {
                value: value,
                message: isValid ? null : message,
            },
        });
    };

    const validatePhone = (phone: string) => {
        const { isValid, message } = isPhoneValid(phone);

        setFormData({
            ...formData,
            phone: {
                value: phone,
                message: isValid ? "" : message,
            },
        });
    };

    return (
        <section>
            <h1>Registar Taller Mecanico</h1>
            <p>
                Necesitamos verificar que el taller mecanico es valido antes de
                registrarlo.
            </p>
            <form onSubmit={summbit}>
                <fieldset className="form-section">
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        className="form-section-input"
                        value={formData.name.value}
                        name="fullname"
                        onChange={(e) => handleInputChange(e)}
                    />

                    {formData.name.message && <small>{formData.name.message}</small>}
                </fieldset>
                <fieldset className="form-section">
                    <PhoneForm
                        phone={formData.phone.value}
                        validatePhone={validatePhone}
                    />
                    {formData.phone.message && <small>{formData.phone.message}</small>}
                </fieldset>
                <ImageUploader
                    uploader={{
                        image: formData.logo,
                        setImage: (photoField) =>
                            setFormData({
                                ...formData,
                                logo: photoField,
                            }),
                    }}
                    content={{
                        id: "workshop-uploader-image",
                        indicator: "Logo del Taller",
                        isCircle: true,
                    }}
                />
                <fieldset>
                    <MapForm
                        setLocation={(location: Location) =>
                            setFormData({
                                ...formData,
                                coordinates: location,
                            })
                        }
                    />
                </fieldset>
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
                        "Solicitar registro"
                    )}
                </button>
            </form>
        </section>
    );
};

export default EnterpriseRegistration;
