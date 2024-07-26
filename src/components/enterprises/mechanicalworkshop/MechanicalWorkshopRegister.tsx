"use client";
import "react-international-phone/style.css";

import { AuthContext } from "@/context/AuthContext";
import {
    isValidForm,
    isValidWorkshopName,
    verifyNoEmptyData,
} from "@/utils/validator/enterprises/EnterpriseValidator";
import { FormEvent, useContext, useEffect, useState } from "react";
import PhoneForm from "../../form/PhoneForm";
import { isPhoneValid } from "@/utils/validator/auth/CredentialsValidator";
import ImageUploader from "../../form/ImageUploader";
import { PhotoField } from "../../services/FormModels";
import { Location } from "@/utils/map/Locator";
import MapForm from "../../form/MapForm";
import { sendEnterpriseReq } from "@/utils/requests/enterprise/EnterpriseRequester";
import { Enterprise } from "@/interfaces/Enterprise";
import { nanoid } from "nanoid";
import { GeoPoint } from "firebase/firestore";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { toast } from "react-toastify";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { useRouter } from "next/navigation";
import { locationList, Locations } from "@/interfaces/Locations";
import { getLocation } from "@/utils/auth/UserAuth";
import ChevronDown from "@/icons/ChevronDown";

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
    location: Locations;
    coordinates: {
        value: Location | null;
        message: string | null;
    };
}

const MechanicRegister = () => {
    const { user, loadingUser } = useContext(AuthContext);
    const router = useRouter();
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
        location: Locations.CochabambaBolivia,
        coordinates: {
            value: null,
            message: null,
        },
    });

    const handleSummbit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formState.loading) {
            setFormState({
                ...formState,
                loading: true,
            });
            if (!loadingUser && user.data && user.data.id) {
                if (
                    formData.name.value &&
                    formData.logo.value &&
                    formData.phone.value &&
                    formData.coordinates.value
                ) {
                    if (isValidForm(formData)) {
                        try {
                            const imgWithRef = await toast.promise(
                                uploadFileBase64(
                                    DirectoryPath.Enterprises,
                                    formData.logo.value,
                                ),
                                {
                                    pending: "Subiendo el logo, por favor espera",
                                    success: "Logo subido",
                                    error: "Error al subir el logo, inténtalo de nuevo por favor",
                                },
                            );

                            var id = nanoid(25);
                            const enterprise: Enterprise = {
                                id,
                                type: "mechanical",
                                name: formData.name.value,
                                logoImgUrl: imgWithRef,
                                coordinates: new GeoPoint(
                                    formData.coordinates.value.lat,
                                    formData.coordinates.value.lng,
                                ),
                                latitude: formData.coordinates.value.lat,
                                longitude: formData.coordinates.value.lng,
                                phone: formData.phone.value,
                                userId: user.data.id,
                                aproved: false,
                                deleted: false,
                                active: true,
                                location: formData.location,
                                addedUsers: [],
                                addedUsersId: [],
                            };

                            await toast.promise(sendEnterpriseReq(id, enterprise), {
                                pending: "Enviando el formulario, por favor espera",
                                success: "Formulario enviado",
                                error: "Error al enviar el formulario, inténtalo de nuevo por favor",
                            });

                            setFormState({
                                ...formState,
                                loading: false,
                            });
                            toast.info(
                                "Tu solicitud sera revisada, por favor se paciente",
                            );
                            router.push("/enterprise/workshops");
                        } catch (e) {
                            window.location.reload();
                        }
                    } else {
                        setFormState({
                            ...formState,
                            loading: false,
                        });
                        toast.error("Por favor llena los campos con datos validos", {
                            toastId: "toast-error-invalid-form",
                        });
                    }
                } else {
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                    toast.error("Por favor llena los campos que están vacíos", {
                        toastId: "toast-error-empty-form",
                    });
                }
            }
        }
    };

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
                message: isValid ? null : message,
            },
        });
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: verifyNoEmptyData(formData) && isValidForm(formData),
        });
    }, [formData]);

    return (
        <section className="service-form-wrapper">
            <h1 className="text | big bolder">Registrar Taller Mecánico</h1>
            <p className="text | light">
                Necesitamos verificar que el taller mecánico es valido antes de
                registrarlo.
            </p>
            <form
                className="form-sub-container | margin-top-50"
                onSubmit={handleSummbit}
                data-state={formState.loading ? "loading" : "loaded"}
            >
                <fieldset className="form-section | max-width-60">
                    <input
                        type="text"
                        placeholder=""
                        className="form-section-input"
                        value={formData.name.value}
                        name="fullname"
                        onChange={(e) => handleInputChange(e)}
                    />
                    <legend className="form-section-legend">Nombre del taller</legend>

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
                <fieldset className="form-section | select-item | max-width-60">
                    <ChevronDown />
                    <select
                        className="form-section-input"
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                location: getLocation(e.target.value),
                            })
                        }
                        value={formData.location}
                    >
                        {locationList.map((location, i) => (
                            <option key={`location-option-${i}`} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                    <legend className="form-section-legend">Ubicación</legend>
                </fieldset>
                <fieldset className="form-section">
                    <span className="text | bold gray-dark">Ubicación del Taller</span>
                    <div className="form-section-map | max-width-80">
                        <MapForm
                            location={formData.coordinates.value}
                            setLocation={(location: Location) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    coordinates: {
                                        value: location,
                                        message: null,
                                    },
                                }))
                            }
                        />
                    </div>
                    {formData.coordinates.message && (
                        <small>{formData.coordinates.message}</small>
                    )}
                </fieldset>
                <button
                    className={`general-button | touchable margin-top-25 max-width-60 ${
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
                        "Solicitar registro"
                    )}
                </button>
            </form>
        </section>
    );
};

export default MechanicRegister;
