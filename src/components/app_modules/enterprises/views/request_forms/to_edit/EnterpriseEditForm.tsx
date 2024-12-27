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
import { uploadFileBlod } from "@/utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { useRouter } from "next/navigation";
import { IEditedEnterpriseManager } from "../../../models/enterprise_managers_edited/IEditedEnterpriseManager";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import {
    validateEnterpriseDescription,
    validateEnterpriseName,
} from "../../../validators/EnterpriseValidator";
import Handshake from "@/icons/Handshake";
import CheckField from "@/components/form/view/fields/CheckField";
import GuardOfModule from "@/components/guards/views/module_guards/GuardOfModule";
import { AuthContext } from "@/context/AuthContext";
import PageLoading from "@/components/loaders/PageLoading";
import { ROLES_TO_ADD_AGREEMENT_TO_ENTERPRISES } from "@/components/guards/models/PermissionsByUserRole";
import { compressFileBase64 } from "@/utils/compressors/FileCompressor";
import { NAME_BUSINESS } from "@/models/Business";
import { isNullOrEmptyText } from "@/validators/TextValidator";
import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";

interface Form {
    name: TextFieldForm;
    description: TextFieldForm;
    phone: TextFieldForm;
    logo: AttachmentField;
    location: Locations;
    coordinates: GeoPointField;
    hasCommition: boolean;
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
    const { checkingUserAuth, user: adminUser } = useContext(AuthContext);
    const { loading, setLoadingAll } = useContext(PageStateContext);
    const [form, setForm] = useState<Form>(DEFAULT_FORM);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

    const handleSummbit = async (e: FormEvent) => {
        e.preventDefault();
        if (!loading) {
            setLoadingAll(true, setFormState);

            if (
                !isValidForm(form) ||
                !enterprise.id ||
                !form.coordinates.value ||
                !form.logo.value
            ) {
                toast.warning("Formulario invalido");
                setLoadingAll(false, setFormState);

                return;
            }

            if (!hasChanges(form, enterprise)) {
                toast.info("Sin cambios para actualizar...", {
                    toastId: "no-changes-edit-ent-warning-toast",
                });
                setLoadingAll(false, setFormState);

                return;
            }

            let isValid: boolean = await editedEnterpriseManager.validateData(
                enterprise.userId,
                enterprise.id,
                enterprise.type,
            );
            if (!isValid) {
                setLoadingAll(false, setFormState);
                return;
            }

            let baseEnterprise = await formToEnterprise(form, enterprise);
            editedEnterpriseManager.handle(enterprise, baseEnterprise);
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
        setFormState((prev) => ({ ...prev, isValid: isValidForm(form) }));
    }, [form]);

    if (checkingUserAuth || !adminUser) {
        return <PageLoading />;
    }

    return (
        <BaseForm
            content={{
                button: {
                    content: {
                        legend: "Editar",
                    },
                    behavior: {
                        loading: formState.loading,
                        isValid: formState.isValid,
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
                    setter: (d) => setForm((prev) => ({ ...prev, name: d })),
                    validator: validateEnterpriseName,
                }}
                legend="Nombre de la empresa"
            />
            <TextField
                field={{
                    values: form.description,
                    setter: (d) =>
                        setForm((prev) => ({ ...prev, description: d })),
                    validator: validateEnterpriseDescription,
                }}
                legend="Descripcion de la empresa"
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
            {form.coordinates.value ? (
                <MapLocationField
                    field={{
                        values: form.coordinates,
                        setter: (d) =>
                            setForm((prev) => ({ ...prev, coordinates: d })),
                    }}
                    legend="Ubicación geográfica de la empresa"
                />
            ) : (
                <span className="loader-gray-medium small-loader | text gray bold">
                    Cargando ubicación geográfica
                </span>
            )}
            <GuardOfModule
                user={adminUser}
                roles={ROLES_TO_ADD_AGREEMENT_TO_ENTERPRISES}
            >
                <div>
                    <h3 className="text | bold | icon-wrapper lb">
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
            </GuardOfModule>
        </BaseForm>
    );
};

export default EnterpriseEditForm;

const DEFAULT_FORM: Form = {
    name: DEFAUL_TEXT_FIELD,
    description: DEFAUL_TEXT_FIELD,
    phone: DEFAUL_TEXT_FIELD,
    logo: DEFAUL_ATTACHMENT_FIELD,
    coordinates: DEFAUL_GEOPOINT_FIELD,
    location: Locations.CochabambaBolivia,
    hasCommition: false,
};

function isValidForm(form: Form): boolean {
    return (
        isValidTextField(form.name) &&
        isValidTextField(form.description) &&
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
        image = imgWithRef;
    }

    const enterprisePhone = parseBoliviaPhone(form.phone.value);

    return {
        ...baseEnterprise,
        name: form.name.value,
        description: form.description.value,
        logoImgUrl: image,
        coordinates: form.coordinates.value,
        phone: enterprisePhone.number ?? "",
        phoneCountryCode: enterprisePhone.countryCode ?? "",
        location: form.location,
        latitude: form.coordinates.value.latitude,
        longitude: form.coordinates.value.longitude,
        commition: form.hasCommition,
    };
}

function enterpriseToForm(enterprise: Enterprise): Form {
    return {
        name: {
            value: enterprise.name,
            message: null,
        },
        description: {
            value: enterprise.description ?? "",
            message: isNullOrEmptyText(enterprise.description)
                ? "Agrega una descripcion a la empresa"
                : null,
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
        hasCommition: enterprise.commition ?? false,
    };
}

function hasChanges(form: Form, currentEnterprise: Enterprise): boolean {
    return (
        form.name.value !== currentEnterprise.name ||
        form.description.value !== currentEnterprise?.description ||
        form.phone.value !== currentEnterprise.phone ||
        form.logo.value !== currentEnterprise.logoImgUrl.url ||
        (currentEnterprise.location !== undefined &&
            form.location !== currentEnterprise.location) ||
        (form.coordinates.value !== undefined &&
            currentEnterprise.coordinates !== undefined &&
            !form.coordinates.value.isEqual(currentEnterprise.coordinates)) ||
        form.hasCommition !== (currentEnterprise.commition ?? false)
    );
}
