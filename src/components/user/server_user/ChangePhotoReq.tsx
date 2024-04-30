"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import ImageUploader from "../../form/ImageUploader";
import { defaultPhoto, PhotoField } from "../../services/FormModels";
import { AuthContext } from "@/context/AuthContext";
import PageLoader from "../../PageLoader";
import { useRouter } from "next/navigation";
import { saveChangePhotoReq } from "@/utils/requests/ChangePhotoRequester";
import { nanoid } from "nanoid";
import { uploadImageBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { toast } from "react-toastify";

const ChangePhotoReq = () => {
    const { loadingUser, user } = useContext(AuthContext);
    const [newPhoto, setNewPhoto] = useState<PhotoField>(defaultPhoto);
    const [formState, setFormState] = useState({
        isValid: true,
        loading: false,
    });
    const router = useRouter();

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (newPhoto.value) {
            if (!newPhoto.message) {
                if (user.data && user.data.id) {
                    try {
                        var id = nanoid(30);
                        const imgWithRef = await toast.promise(
                            uploadImageBase64(
                                DirectoryPath.Users,
                                newPhoto.value,
                            ),
                            {
                                pending: "Subiendo foto, por favor espera",
                                success: "Foto subida",
                                error: "Error al subir la foto, intentalo de nuevo por favor",
                            },
                        );
                        await toast.promise(
                            saveChangePhotoReq(id, {
                                id,
                                newPhoto: imgWithRef,
                                userId: user.data.id,
                                userName: user.data.fullName,
                                active: true
                            }),
                            {
                                pending: "Enviando la peticion, por favor espera",
                                success: "Peticion enviada",
                                error: "Error al enviar la peticion, intentalo de nuevo por favor",
                            },
                        );
                        toast.info(
                            "Tu peticion sera servisada por uno de nuestros administradores",
                        );
                        setFormState({
                            loading: false,
                            isValid: true,
                        });
                        router.push("/user/profile");
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
            toast.error("Por favor llena los campos que estan vacios", {
                toastId: "toast-error-empty-form",
            });
        }
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: newPhoto.value !== null && !newPhoto.message,
        });
    }, [newPhoto]);

    return loadingUser ? (
        <PageLoader />
    ) : user.data ? (
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
                <ImageUploader
                    content={{
                        id: "req-to-change-profile-photo",
                        indicator: "Nueva Foto de Perfil",
                        isCircle: true,
                    }}
                    uploader={{
                        image: newPhoto,
                        setImage: setNewPhoto,
                    }}
                />
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

export default ChangePhotoReq;
