"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { saveChangePhotoReq } from "@/components/app_modules/users/api/ChangePhotoRequester";
import { uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { toast } from "react-toastify";
import { AttachmentField } from "@/components/form/models/FormFields";
import { DEFAUL_ATTACHMENT_FIELD } from "@/components/form/models/DefaultFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import PageLoading from "@/components/loaders/PageLoading";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { isValidAttachmentField } from "@/components/form/validators/FieldValidators";
import { genDocId } from "@/utils/generators/IdGenerator";
import { RequestLimitValidatorToChangePhoto } from "../../../validators/for_request_limit/RequestLimitValidatorToChangePhoto";
import { routeToProfileAsUser } from "@/utils/route_builders/as_user/RouteBuilderForProfileAsUser";

const FormToChangeProfilePhoto = () => {
    const { checkingUserAuth, user } = useContext(AuthContext);
    const [newPhoto, setNewPhoto] = useState<AttachmentField>(
        DEFAUL_ATTACHMENT_FIELD,
    );
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const router = useRouter();
    const requestLimitValidator = new RequestLimitValidatorToChangePhoto();

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (formState.loading) {
            return;
        }

        setFormState((prev) => ({
            ...prev,
            loading: true,
        }));

        if (
            !isValidAttachmentField(newPhoto) ||
            !user ||
            !user.id ||
            !newPhoto.value
        ) {
            setFormState((prev) => ({
                ...prev,
                loading: false,
                isValid: false,
            }));
            toast.error("Formulario invalido");
            return;
        }

        if (user && user.id) {
            let thereAreActiveReqs = await toast.promise(
                requestLimitValidator.hasRequestsSent(user.id),
                {
                    pending: "Verificando peticiones activas",
                    error: "Error verificando peticiones activas, inténtalo de nuevo por favor",
                },
            );
            if (thereAreActiveReqs) {
                toast.warning(
                    "Ya enviaste una petición para actulizar tu foto, espera a que se revise",
                );
                setFormState((prev) => ({
                    ...prev,
                    loading: false,
                }));
                return;
            } else {
                toast.success(
                    "Valido para enviar una nueva petición para actualizar tu foto",
                );
            }
        }
        try {
            var id = genDocId();
            const imgWithRef = await toast.promise(
                uploadFileBase64(DirectoryPath.Users, newPhoto.value),
                {
                    pending: "Subiendo foto, por favor espera",
                    success: "Foto subida",
                    error: "Error al subir la foto, inténtalo de nuevo por favor",
                },
            );
            await toast.promise(
                saveChangePhotoReq(id, {
                    id,
                    newPhoto: imgWithRef,
                    userId: user.id,
                    userName: user.fullName,
                    active: true,
                }),
                {
                    pending: "Enviando la petición, por favor espera",
                    success:
                        "Tu petición sera servisada por uno de nuestros administradores",
                    error: "Error al enviar la petición, inténtalo de nuevo por favor",
                },
            );
            router.push(routeToProfileAsUser());
        } catch (e) {
            setFormState((prev) => ({
                ...prev,
                loading: false,
                isValid: true,
            }));
        }
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: isValidAttachmentField(newPhoto),
        });
    }, [newPhoto]);

    if (checkingUserAuth) {
        return <PageLoading />;
    }

    return (
        user && (
            <section className="service-form-wrapper | max-height-100">
                <h1 className="text | big bolder">
                    Actualiza tu Foto de Perfil
                </h1>
                <p>
                    Se mandara una solicitud por Whatsapp para que puedas
                    actualizar tu foto de perfil.
                </p>

                <BaseForm
                    content={{
                        button: {
                            content: {
                                legend: "Solicitar cambio de foto",
                            },
                            behavior: {
                                loading: formState.loading,
                                isValid: formState.isValid,
                            },
                        },
                        styleClasses: "max-width-60",
                    }}
                    behavior={{
                        loading: formState.loading,
                        onSummit: submit,
                    }}
                >
                    <ImageUploader
                        content={{
                            id: "req-to-change-profile-photo",
                            legend: "Nueva Foto de Perfil",
                            imageInCircle: true,
                        }}
                        uploader={{
                            image: newPhoto,
                            setImage: setNewPhoto,
                        }}
                    />
                </BaseForm>
                <span className="circles-right-bottomv2 green"></span>
            </section>
        )
    );
};

export default FormToChangeProfilePhoto;
