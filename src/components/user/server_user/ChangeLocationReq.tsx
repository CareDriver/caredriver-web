"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import ImageUploader from "../../form/ImageUploader";
import { defaultPhoto, PhotoField } from "../../services/FormModels";
import { AuthContext } from "@/context/AuthContext";
import PageLoader from "../../PageLoader";
import { useRouter } from "next/navigation";
import { updateUser } from "@/utils/requests/UserRequester";
import { saveChangePhotoReq } from "@/utils/requests/ChangePhotoRequester";
import { nanoid } from "nanoid";
import { uploadImageBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { toast } from "react-toastify";
import { locationList, Locations } from "@/interfaces/Locations";
import { getGreeting } from "@/utils/contact/Content";
import { sendWhatsapp } from "@/utils/contact/Sender";

const ChangeLocationReq = () => {
    const { loadingUser, user } = useContext(AuthContext);
    const [location, setLocation] = useState<{
        default: Locations | null;
        value: Locations | null;
        message: string | null;
    }>({
        default: null,
        value: null,
        message: null,
    });
    const [formState, setFormState] = useState({
        isValid: true,
        loading: false,
    });
    const router = useRouter();

    useEffect(() => {
        if (!loadingUser && user.data && user.data.location) {
            setLocation({
                ...location,
                default: user.data.location,
                value: user.data.location,
            });
        }
    }, [loadingUser]);

    const sendMessage = () => {
        const number = "+59164868951";
        const message = `${getGreeting()}\n\nSoy el usuario servidor ${
            user.data?.fullName
        }, quiero pedirle cambiarme de grupo porque **acabo de cambiar mi localizacion de ${
            location.default
        } a ${location.value}**`;
        sendWhatsapp(number, message);
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (
            location.value &&
            location.default &&
            user.data &&
            location.value !== user.data.location
        ) {
            if (!location.message) {
                if (user.data.id && user.data.location) {
                    try {
                        await toast.promise(
                            updateUser(user.data.id, {
                                location: location.value,
                            }),
                            {
                                pending: "Actualizando localizacion, por favor espera",
                                success: "Localizacion actualizada",
                                error: "Error al actualizar tu localizacion, intentalo de nuevo por favor",
                            },
                        );

                        setFormState({
                            loading: false,
                            isValid: true,
                        });
                        sendMessage();
                        window.location.replace("/user/profile");
                    } catch (e) {
                        setFormState({
                            loading: false,
                            isValid: true,
                        });
                        window.location.reload();
                    }
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
            setLocation({
                ...location,
                message: "Ya tienes establecido esta localizacion",
            });
        }
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: location.value !== null && !location.message,
        });
    }, [location]);

    const getLocation = (input: string): Locations => {
        var location = Locations.CochabambaBolivia;
        locationList.forEach((value) => {
            if (value === input) {
                location = value;
            }
        });

        return location;
    };

    return loadingUser ? (
        <PageLoader />
    ) : user.data && location.value ? (
        <section className="service-form-wrapper">
            <h1 className="text | big bolder">Actualiza tu Foto de Perfil</h1>
            <p>
                Se mandara una solicitud por Whatsapp para que puedas actualizar tu foto
                de perfil.
            </p>

            <form
                className="max-width-60 margin-top-50"
                data-state={formState.loading ? "loading" : "loaded"}
                onSubmit={submit}
            >
                <fieldset className="form-section">
                    <select
                        className="form-section-input"
                        onChange={(e) => {
                            const newLocation = getLocation(e.target.value);
                            setLocation({
                                ...location,
                                value: newLocation,
                                message:
                                    newLocation === location.default
                                        ? "Ya tienes establecido esta localizacion"
                                        : null,
                            });
                        }}
                        value={location.value}
                    >
                        {locationList.map((location, i) => (
                            <option key={`location-option-${i}`} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                    {location.message && <small>{location.message}</small>}
                </fieldset>
                <div
                    className="row-wrapper | gap-20 | margin-top-25 loading-section"
                    data-state={formState.loading ? "loading" : "loaded"}
                >
                    <button
                        className="general-button | gray "
                        type="button"
                        onClick={() => router.push("/user/profile")}
                    >
                        Cancelar
                    </button>
                    <button
                        className={`general-button | touchable max-width-60 ${
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
                            "Solicitar Edicion"
                        )}
                    </button>
                </div>
            </form>
        </section>
    ) : (
        <h1>No tienes Cuenta</h1>
    );
};

export default ChangeLocationReq;
