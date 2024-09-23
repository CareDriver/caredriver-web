"use client";
import "react-international-phone/style.css";

import { FormEvent, useContext, useEffect, useState } from "react";
import { sendEnterpriseReq } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { Enterprise } from "@/interfaces/Enterprise";
import { uploadFileBlod } from "@/utils/requesters/FileUploader";
import { toast } from "react-toastify";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { useRouter } from "next/navigation";
import { Locations } from "@/interfaces/Locations";
import {
    AttachmentField,
    EntityField,
    GeoPointField,
    TextField as TextFieldForm,
} from "@/components/form/models/FormFields";
import {
    DEFAUL_ATTACHMENT_FIELD,
    DEFAUL_ENTITY_FIELD,
    DEFAUL_GEOPOINT_FIELD,
    DEFAUL_TEXT_FIELD,
} from "@/components/form/models/DefaultFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { genDocId } from "@/utils/generators/IdGenerator";
import BaseForm from "@/components/form/view/forms/BaseForm";
import MapLocationField from "@/components/form/view/fields/MapLocationField";
import LocationField from "@/components/form/view/fields/LocationField";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import PhoneField from "@/components/form/view/fields/PhoneField";
import TextField from "@/components/form/view/fields/TextField";
import {
    isValidAttachmentField,
    isValidEntityField,
    isValidGeoPointField,
    isValidTextField,
} from "@/components/form/validators/FieldValidators";
import EnterpriseOwnerAdder from "./EnterpriseOwnerAdder";
import { ServiceType } from "@/interfaces/Services";
import { routeToAllEnterprisesAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import { PageStateContext } from "@/context/PageStateContext";
import { validateEnterpriseName } from "../../../validators/EnterpriseValidator";
import CheckField from "@/components/form/view/fields/CheckField";
import Handshake from "@/icons/Handshake";
import { AuthContext } from "@/context/AuthContext";
import PageLoading from "@/components/loaders/PageLoading";
import { compressFileBase64 } from "@/utils/compressors/FileCompressor";
import { toCapitalize } from "@/utils/text_helpers/TextFormatter";
import { DRIVER_PLURAL, NAME_BUSINESS } from "@/models/Business";

interface Form {
    name: TextFieldForm;
    phone: TextFieldForm;
    logo: AttachmentField;
    location: Locations;
    coordinates: GeoPointField;
    userOwner: EntityField;
    hasCommition: boolean;
}

interface Props {
    enterpriseType: ServiceType;
}

const NewEnterpriseForm: React.FC<Props> = ({ enterpriseType }) => {
    const router = useRouter();
    const { checkingUserAuth, user: adminUser } = useContext(AuthContext);
    const { loading, setLoadingAll } = useContext(PageStateContext);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [form, setForm] = useState<Form>(DEFAULT_FORM);

    const handleSummbit = async (e: FormEvent) => {
        e.preventDefault();
        if (!loading && !formState.loading) {
            setLoadingAll(true, setFormState);

            if (
                !isValidForm(form) ||
                !form.logo.value ||
                !form.coordinates.value ||
                !form.userOwner.value
            ) {
                setLoadingAll(false, setFormState);
                toast.error("Formulario invalido", {
                    toastId: "toast-error-invalid-form",
                });
                return;
            }

            try {
                const imageBlob = await toast.promise(
                    compressFileBase64(form.logo.value),
                    {
                        pending: "Comprimiendo el logo",
                        success: "Logo comprimido",
                        error: "Error al comprimir el logo",
                    },
                );
                const imgWithRef = await toast.promise(
                    uploadFileBlod(DirectoryPath.Enterprises, imageBlob),
                    {
                        pending: "Subiendo el logo, por favor espera",
                        success: "Logo subido",
                        error: "Error al subir el logo, inténtalo de nuevo por favor",
                    },
                );

                var id = genDocId();
                const enterprise: Enterprise = {
                    id,
                    type: enterpriseType,
                    name: form.name.value,
                    logoImgUrl: imgWithRef,
                    coordinates: form.coordinates.value,
                    latitude: form.coordinates.value.latitude,
                    longitude: form.coordinates.value.longitude,
                    phone: form.phone.value,
                    userId: form.userOwner.value,
                    aproved: true,
                    deleted: false,
                    active: true,
                    location: form.location,
                    addedUsers: [],
                    addedUsersId: [],
                    commition: form.hasCommition,
                };

                await toast.promise(sendEnterpriseReq(id, enterprise), {
                    pending: "Creando nueva empresa",
                    success: "Empresa creada",
                    error: "Error al crear la Empresa, inténtalo de nuevo por favor",
                });

                router.push(routeToAllEnterprisesAsAdmin(enterpriseType));
            } catch (e) {
                window.location.reload();
            }
        }
    };

    useEffect(() => {
        setFormState((prev) => ({
            ...prev,
            isValid: isValidForm(form),
        }));
    }, [form]);

    if (checkingUserAuth || !adminUser) {
        return <PageLoading />;
    }

    return (
        <section className="service-form-wrapper">
            <h1 className="text | big bolder">Crear nueva empresa</h1>
            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Registrar",
                        },
                        behavior: {
                            isValid: formState.isValid,
                            loading: formState.loading,
                        },
                    },
                    styleClasses: "max-width-80",
                }}
                behavior={{
                    loading: loading || formState.loading,
                    onSummit: handleSummbit,
                }}
            >
                <TextField
                    field={{
                        values: form.name,
                        setter: (n) =>
                            setForm((prev) => ({ ...prev, name: n })),
                        validator: validateEnterpriseName,
                    }}
                    legend="Nombre de la empresa"
                />
                <PhoneField
                    values={form.phone}
                    setter={(n) => setForm((prev) => ({ ...prev, phone: n }))}
                />
                <ImageUploader
                    uploader={{
                        image: form.logo,
                        setImage: (n) =>
                            setForm((prev) => ({
                                ...prev,
                                logo: n,
                            })),
                    }}
                    content={{
                        id: "driver-enterprise-uploader-image",
                        legend: `Logo de la Empresa de ${toCapitalize(
                            DRIVER_PLURAL,
                        )}`,
                        imageInCircle: true,
                    }}
                />

                <LocationField
                    location={form.location}
                    setter={(d) =>
                        setForm((prev) => ({ ...prev, location: d }))
                    }
                />
                <MapLocationField
                    field={{
                        values: form.coordinates,
                        setter: (d) =>
                            setForm((prev) => ({ ...prev, coordinates: d })),
                    }}
                    legend="Ubicación geográfica de la empresa"
                />
                <EnterpriseOwnerAdder
                    owner={{
                        values: form.userOwner,
                        setter: (d) =>
                            setForm((prev) => ({ ...prev, userOwner: d })),
                    }}
                    enterprise={{
                        localization: form.location,
                        type: enterpriseType,
                    }}
                />
                <div>
                    <h3 className="text | bolder | icon-wrapper lb">
                        <Handshake />
                        Convenio con {NAME_BUSINESS} (Opcional)
                    </h3>
                    <CheckField
                        content={{
                            checkDescription: `Marca la casilla si la empresa tiene convenio con ${NAME_BUSINESS}`,
                        }}
                        marker={{
                            isCheck: form.hasCommition,
                            setCheck: (c) =>
                                setForm((prev) => ({
                                    ...prev,
                                    hasCommition: c,
                                })),
                        }}
                    />
                </div>
            </BaseForm>
        </section>
    );
};

export default NewEnterpriseForm;

const DEFAULT_FORM: Form = {
    name: DEFAUL_TEXT_FIELD,
    phone: DEFAUL_TEXT_FIELD,
    logo: DEFAUL_ATTACHMENT_FIELD,
    coordinates: DEFAUL_GEOPOINT_FIELD,
    location: Locations.CochabambaBolivia,
    userOwner: DEFAUL_ENTITY_FIELD,
    hasCommition: false,
};

function isValidForm(form: Form): boolean {
    return (
        isValidTextField(form.name) &&
        isValidTextField(form.phone) &&
        isValidAttachmentField(form.logo) &&
        isValidGeoPointField(form.coordinates) &&
        isValidEntityField(form.userOwner)
    );
}
