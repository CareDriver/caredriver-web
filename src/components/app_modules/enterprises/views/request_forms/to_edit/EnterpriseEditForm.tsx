"use client";

import {
    AttachmentField,
    GeoPointField,
    TextField as TextFieldForm,
} from "@/components/form/models/FormFields";
import {
    DEFAUL_ATTACHMENT_FIELD,
    DEFAUL_GEOPOINT_FIELD,
    DEFAUL_TEXT_FIELD,
} from "@/components/form/models/DefaultFields";
import { Locations } from "@/interfaces/Locations";
import { Enterprise } from "@/interfaces/Enterprise";
import { FormEvent, useContext, useEffect, useState } from "react";
import { PageStateContext } from "@/context/PageStateContext";
import BaseForm from "@/components/form/view/forms/BaseForm";
import TextField from "@/components/form/view/fields/TextField";
import PhoneField from "@/components/form/view/fields/PhoneField";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import LocationField from "@/components/form/view/fields/LocationField";
import MapLocationField from "@/components/form/view/fields/MapLocationField";
import {
    isValidAttachmentField,
    isValidGeoPointField,
    isValidTextField,
} from "@/components/form/validators/FieldValidators";
import { toast } from "react-toastify";
import { isImageBase64 } from "@/validators/ImageValidator";
import { uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { useRouter } from "next/navigation";
import { IEditedEnterpriseManager } from "../../../models/enterprise_managers_edited/IEditedEnterpriseManager";
import { validateEnterpriseName } from "../../../validators/ValidatorsForConfirmationWithEnterprises";

interface Form {
    name: TextFieldForm;
    phone: TextFieldForm;
    logo: AttachmentField;
    location: Locations;
    coordinates: GeoPointField;
}

interface Props {
    enterprise: Enterprise;
    editedEnterpriseManager: IEditedEnterpriseManager;
}

const EnterpriseEditForm: React.FC<Props> = ({
    enterprise,
    editedEnterpriseManager,
}) => {
    const router = useRouter();
    const { loading, setLoading } = useContext(PageStateContext);
    const [form, setForm] = useState<Form>(DEFAULT_FORM);
    const [isValid, setValid] = useState(true);

    const handleSummbit = async (e: FormEvent) => {
        e.preventDefault();
        if (!loading) {
            setLoading(true);

            if (
                !isValidForm(form) ||
                !enterprise.id ||
                !form.coordinates.value ||
                !form.logo.value
            ) {
                toast.warning("Formulario invalido");
                setLoading(false);
                return;
            }

            if (!hasChanges(form, enterprise)) {
                toast.info("Sin cambios para actualizar...", {
                    toastId: "no-changes-edit-ent-warning-toast",
                });
                setLoading(false);
                return;
            }

            let isValid: boolean = await editedEnterpriseManager.validateData(
                enterprise.userId,
                enterprise.id,
                enterprise.type,
            );
            if (!isValid) {
                setLoading(false);
                return;
            }

            let baseEnterprise = await formToEnterprise(form, enterprise);
            editedEnterpriseManager.handle(baseEnterprise);
            setLoading(false);
            let routeToRedirect =
                editedEnterpriseManager.getRedirectionAfterHandling(
                    enterprise.type,
                );
            if (routeToRedirect) {
                router.push(routeToRedirect);
            }
        }
    };

    useEffect(() => {
        setForm(enterpriseToForm(enterprise));
    }, [enterprise]);

    useEffect(() => {
        setValid(isValidForm(form));
    }, [form]);

    return (
        <BaseForm
            content={{
                button: {
                    content: {
                        legend: "Editar",
                    },
                    behavior: {
                        loading: loading,
                        isValid: isValid,
                    },
                },
            }}
            behavior={{
                loading: loading,
                onSummit: handleSummbit,
            }}
        >
            <TextField
                field={{
                    values: form.name,
                    setter: (d) => setForm((prev) => ({ ...prev, name: d })),
                    validator: validateEnterpriseName,
                }}
                legend="Nombre de la empresa"
            />
            <PhoneField
                values={form.phone}
                setter={(d) => setForm((prev) => ({ ...prev, phone: d }))}
            />
            <ImageUploader
                uploader={{
                    image: form.logo,
                    setImage: (photoField) =>
                        setForm({
                            ...form,
                            logo: photoField,
                        }),
                }}
                content={{
                    id: "workshop-uploader-image",
                    legend: `Logo de la empresa`,
                    imageInCircle: true,
                }}
            />
            <LocationField
                location={form.location}
                setter={(d) => setForm((prev) => ({ ...prev, location: d }))}
            />
            <MapLocationField
                field={{
                    values: form.coordinates,
                    setter: (d) =>
                        setForm((prev) => ({ ...prev, coordinates: d })),
                }}
                legend="Ubicación geografica de la empresa"
            />
        </BaseForm>
    );
};

export default EnterpriseEditForm;

const DEFAULT_FORM: Form = {
    name: DEFAUL_TEXT_FIELD,
    phone: DEFAUL_TEXT_FIELD,
    logo: DEFAUL_ATTACHMENT_FIELD,
    coordinates: DEFAUL_GEOPOINT_FIELD,
    location: Locations.CochabambaBolivia,
};

function isValidForm(form: Form): boolean {
    return (
        isValidTextField(form.name) &&
        isValidTextField(form.phone) &&
        isValidAttachmentField(form.logo) &&
        isValidGeoPointField(form.coordinates)
    );
}

async function formToEnterprise(
    form: Form,
    baseEnterprise: Enterprise,
): Promise<Enterprise> {
    if (!form.logo.value || !form.coordinates.value) {
        return baseEnterprise;
    }

    let image = {
        url: baseEnterprise.logoImgUrl.url,
        ref: baseEnterprise.logoImgUrl.ref,
    };
    if (isImageBase64(form.logo.value)) {
        const imgWithRef = await toast.promise(
            uploadFileBase64(DirectoryPath.Enterprises, form.logo.value),
            {
                pending: "Subiendo el logo, por favor espera",
                success: "Logo subido",
                error: "Error al subir el logo, inténtalo de nuevo por favor",
            },
        );
        image = imgWithRef;
    }

    return {
        ...baseEnterprise,
        name: form.name.value,
        logoImgUrl: image,
        coordinates: form.coordinates.value,
        phone: form.phone.value,
        location: form.location,
        latitude: form.coordinates.value.latitude,
        longitude: form.coordinates.value.longitude,
    };
}

function enterpriseToForm(enterprise: Enterprise): Form {
    return {
        name: {
            value: enterprise.name,
            message: null,
        },
        phone: {
            value: !enterprise.phone ? "" : enterprise.phone,
            message: null,
        },
        coordinates: {
            value: enterprise.coordinates,
            message: null,
        },
        location: enterprise.location
            ? enterprise.location
            : Locations.CochabambaBolivia,
        logo: {
            value: enterprise.logoImgUrl.url,
            message: null,
        },
    };
}

function hasChanges(form: Form, currentEnterprise: Enterprise): boolean {
    return (
        form.name.value !== currentEnterprise.name ||
        form.phone.value !== currentEnterprise.phone ||
        form.logo.value !== currentEnterprise.logoImgUrl.url ||
        (currentEnterprise.location !== undefined &&
            form.location !== currentEnterprise.location) ||
        (form.coordinates.value !== undefined &&
            currentEnterprise.coordinates !== undefined &&
            form.coordinates.value.isEqual(currentEnterprise.coordinates))
    );
}
