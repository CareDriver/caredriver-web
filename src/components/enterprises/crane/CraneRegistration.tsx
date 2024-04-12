"use client";
import "react-international-phone/style.css";

import { AuthContext } from "@/context/AuthContext";
import { isValidWorkshopName } from "@/utils/validator/enterprises/EnterpriseValidator";
import { useContext, useState } from "react";
import PhoneForm from "../../form/PhoneForm";
import { isPhoneValid } from "@/utils/validator/auth/CredentialsValidator";
import ImageUploader from "../../form/ImageUploader";
import { PhotoField } from "../../services/FormModels";
import { Location } from "@/utils/map/Locator";
import MapForm from "../../form/MapForm";

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

const CraneRegistration = () => {
    const { user, loadingUser } = useContext(AuthContext);
    const [formState, setFormState] = useState({
        isValid: true,
        loading: false,
    });
    const [formData, setFormData] = useState<FormData>({
        name: {
            value: "",
            message: null,
        },
        phone: {
            value: "",
            message: null,
        },
        logo: {
            value: null,
            message: null,
        },
        coordinates: null,
    });

    const handleSummbit = async () => {};

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
        <section className="service-form-wrapper">
            <h1 className="text | big bolder">Registar Empresa Operadora de Grua</h1>
            <p>
                Necesitamos verificar que la nueva empresa sea valida antes de
                registrarla.
            </p>
            <form className="form-sub-container | margin-top-25" onSubmit={handleSummbit}>
                <fieldset className="form-section | max-width-60">
                    <input
                        type="text"
                        placeholder="Nombre de la Empresa"
                        className="form-section-input"
                        value={formData.name.value}
                        name="fullname"
                        onChange={(e) => handleInputChange(e)}
                    />

                    {formData.name.message && <small>{formData.name.message}</small>}
                </fieldset>
                <fieldset className="form-section | max-width-60">
                    <PhoneForm
                        phone={formData.phone.value}
                        validatePhone={validatePhone}
                    />
                    {formData.phone.message && <small>{formData.phone.message}</small>}
                </fieldset>
                <div className="max-width-60">
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
                </div>
                <span className="text | bold gray-dark">Ubicacion del Taller</span>
                <fieldset className="form-section-map | max-width-80">
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
                    className="general-button | margin-top-25 max-width-60"
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

export default CraneRegistration;
