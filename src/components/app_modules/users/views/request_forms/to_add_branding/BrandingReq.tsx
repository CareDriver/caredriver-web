/* "use client";

import ImageUploader from "@/components/form/ImageUploader";
import PageLoader from "@/components/PageLoader";
import { PhotoField } from "@/components/services/FormModels";
import { AuthContext } from "@/context/AuthContext";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { saveBrandingRequest } from "@/utils/requests/BrandingReqs";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { ReqBranding_thereAreActiveReqs } from "@/utils/validator/branding/RendingReqLimiter";
import { isImageBase64 } from "@/utils/validator/ImageValidator";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const BrandingReq = () => {
    const { loadingUser, user } = useContext(AuthContext);
    const router = useRouter();
    const [formState, setFormState] = useState({
        loading: false,
        isValid: false,
    });
    const [image, setImage] = useState<PhotoField>({
        value: null,
        message: null,
    });

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formState.loading) {
            setFormState({
                ...formState,
                loading: true,
            });
            if (user.data && user.data.id) {
                let thereAreActiveReqs = await toast.promise(
                    ReqBranding_thereAreActiveReqs(user.data.id),
                    {
                        pending: "Verificando peticiones activas",
                        success: "Verificado",
                        error: "Error verificando peticiones activas, inténtalo de nuevo por favor",
                    },
                );
                if (thereAreActiveReqs) {
                    toast.warning(
                        "Ya enviaste una petición para verificar el branding con tu vehículo, espera a que se revise",
                    );
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                    return;
                } else {
                    toast.success(
                        "Valido para enviar una nueva petición para verificar el branding con tu vehículo",
                    );
                }
            }
            if (
                formState.isValid &&
                image.value !== null &&
                isImageBase64(image.value) &&
                user.data &&
                user.data.id
            ) {
                try {
                    const imgRef = await toast.promise(
                        uploadFileBase64(DirectoryPath.BrandingReqs, image.value),
                        {
                            pending: "Subiendo la foto, por favor espera",
                            success: "Foto subida",
                            error: "Error al subir la foto, inténtalo de nuevo por favor",
                        },
                    );

                    const brandingReqId = nanoid();
                    await toast.promise(
                        saveBrandingRequest(brandingReqId, {
                            id: brandingReqId,
                            active: true,
                            aproved: false,
                            brandingImage: imgRef,
                            userId: user.data.id,
                            userName: user.data.fullName,
                        }),
                        {
                            pending: "Enviando la petición, por favor espera",
                            success: "Petición enviada",
                            error: "Error al enviar la petición, inténtalo de nuevo por favor",
                        },
                    );

                    toast.info(
                        "Uno de nuestros administradores revisara tu solicitud, se paciente",
                    );
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                    router.push("");
                } catch (e) {
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                }
            } else {
                toast.error("Por favor llena los campos con datos validos");
                setFormState({
                    ...formState,
                    loading: false,
                });
            }
        }
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: image.value !== null && !image.message,
        });
    }, [image]);

    return loadingUser ? (
        <PageLoader />
    ) : (
        <section className="service-form-wrapper | max-height-100">
            <h1 className="text | big bold">Branding</h1>
            <p className="text | light">
                Por favor sube una foto de tu vehículo con el logo de nuestra aplicación
                pegado a tu vehículo
            </p>
            <form
                className="max-width-60 margin-top-50"
                data-state={formState.loading ? "loading" : "loaded"}
                onSubmit={submit}
            >
                <ImageUploader
                    content={{
                        id: "branding-user-uploader",
                        indicator: "Foto de tu vehículo",
                        isCircle: false,
                    }}
                    uploader={{
                        image,
                        setImage,
                    }}
                />
                <div
                    className="row-wrapper | gap-20 | margin-top-25 loading-section"
                    data-state={formState.loading ? "loading" : "loaded"}
                >
                    <button
                        className="general-button | gray "
                        type="button"
                        onClick={() => router.push("")}
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
                            "Solicitar revision"
                        )}
                    </button>
                </div>
            </form>
            <span className="circles-right-bottomv2 green"></span>
        </section>
    );
};

export default BrandingReq;
 */