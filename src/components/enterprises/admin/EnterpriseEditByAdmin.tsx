"use client";
import "react-international-phone/style.css";

import { isValidWorkshopName } from "@/utils/validator/enterprises/EnterpriseValidator";
import { FormEvent, useEffect, useState } from "react";
import PhoneForm from "../../form/PhoneForm";
import { isPhoneValid } from "@/utils/validator/auth/CredentialsValidator";
import ImageUploader from "../../form/ImageUploader";
import { PhotoField } from "../../services/FormModels";
import { Location } from "@/utils/map/Locator";
import MapForm from "../../form/MapForm";
import {
    deleteEnterpriseReq,
    getEnterpriseById,
    updateEnterprise,
} from "@/utils/requests/enterprise/EnterpriseRequester";
import {
    Enterprise,
    EnterpriseTypeRender,
    EnterpriseTypeRenderPronoun,
    EnterpriseTypeRenderPronounV2,
} from "@/interfaces/Enterprise";
import { GeoPoint } from "firebase/firestore";
import { deleteFile, uploadFileBase64 } from "@/utils/requests/FileUploader";
import { toast } from "react-toastify";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { useRouter } from "next/navigation";
import { isImageBase64 } from "@/utils/validator/ImageValidator";
import PageLoader from "../../PageLoader";
import TriangleExclamation from "@/icons/TriangleExclamation";
import { getRoute } from "@/utils/parser/ToSpanishEnterprise";
import { locationList, Locations } from "@/interfaces/Locations";
import ChevronDown from "@/icons/ChevronDown";
import { getLocation } from "@/utils/auth/UserAuth";

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

const EnterpriseEditByAdmin = ({
    id,
    type,
}: {
    id: string;
    type: "mechanical" | "tow" | "laundry" | "driver";
}) => {
    const router = useRouter();
    const [enterpriseData, setEnterpriseData] = useState<Enterprise | null>(null);
    const [formState, setFormState] = useState({
        isValid: true,
        loading: false,
        loadingRev: false,
        loadingEdit: false,
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

    const [validToDelete, setValidToDelete] = useState<boolean>(false);
    const [validToDisable, setValidToDisable] = useState<boolean>(false);

    const handleSummbit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formState.loading) {
            setFormState({
                ...formState,
                loading: true,
            });
            if (formData.coordinates.value === null) {
                setFormData({
                    ...formData,
                    coordinates: {
                        value: null,
                        message: `Por favor selecciona la Ubicación ${EnterpriseTypeRenderPronounV2[type]}`,
                    },
                });
            } else if (
                formData.name.value &&
                formData.logo.value &&
                formData.coordinates.value &&
                enterpriseData &&
                enterpriseData.id
            ) {
                var image = {
                    url: enterpriseData.logoImgUrl.url,
                    ref: enterpriseData.logoImgUrl.ref,
                };
                if (isImageBase64(formData.logo.value)) {
                    const imgWithRef = await toast.promise(
                        uploadFileBase64(DirectoryPath.Enterprises, formData.logo.value),
                        {
                            pending: "Cambiando el logo, por favor espera",
                            success: "Logo cambiado",
                            error: "Error al cambiar el logo, inténtalo de nuevo por favor",
                        },
                    );
                    await toast.promise(deleteFile(enterpriseData.logoImgUrl.ref), {
                        pending: "Borrando el anterior logo",
                        success: "Logo anterior borrado",
                        error: "Error al borrar el anterior logo",
                    });
                    image = imgWithRef;
                }

                const enterprise: Partial<Enterprise> = {
                    name: formData.name.value,
                    logoImgUrl: image,
                    coordinates: new GeoPoint(
                        formData.coordinates.value.lat,
                        formData.coordinates.value.lng,
                    ),
                    latitude: formData.coordinates.value.lat,
                    longitude: formData.coordinates.value.lng,
                    phone: isPhoneValid(formData.phone.value).isValid
                        ? formData.phone.value
                        : "",
                    location: formData.location,
                    active: true,
                };

                await toast.promise(updateEnterprise(enterpriseData.id, enterprise), {
                    pending: `Editando ${EnterpriseTypeRender[type]}`,
                    success: "Editado",
                    error: `Error al editar ${EnterpriseTypeRender[type]}, inténtalo de nuevo por favor`,
                });

                setFormState({
                    ...formState,
                    loading: false,
                });
                router.push(`/admin/enterprises/${getRoute(type)}`);
            } else {
                console.log("error");
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
        getEnterpriseById(id)
            .then((data) => {
                if (
                    data !== undefined &&
                    data.coordinates?.latitude &&
                    data.coordinates?.longitude
                ) {
                    if (data.deleted) {
                        toast.warning("Servicio no encontrado", {
                            toastId: "no-found-service-enterprise",
                        });
                        router.push(`/admin/enterprises/${getRoute(type)}`);
                        return;
                    }
                    setFormData({
                        name: {
                            value: data.name,
                            message: null,
                        },
                        phone: {
                            value: data.phone === undefined ? "" : data.phone,
                            message: null,
                        },
                        coordinates: {
                            value: {
                                lat: data.coordinates.latitude,
                                lng: data.coordinates.longitude,
                            },
                            message: null,
                        },
                        location: data.location
                            ? data.location
                            : Locations.CochabambaBolivia,
                        logo: {
                            value: data.logoImgUrl.url,
                            message: null,
                        },
                    });
                    setEnterpriseData(data);
                } else {
                    router.push("/");
                    toast.error(EnterpriseTypeRender[type].concat(" no encontrado"));
                }
            })
            .catch(() => {
                router.push("/");
                toast.error(EnterpriseTypeRender[type].concat(" no encontrado"));
            });
    }, []);

    useEffect(() => {
        setFormState({
            ...formState,
            isValid:
                !formData.name.message &&
                !formData.logo.message &&
                !formData.coordinates.message &&
                formData.name.value !== null &&
                formData.logo.value !== null &&
                formData.coordinates.value !== null,
        });
    }, [formData]);

    const toggleDisableEnterprise = async () => {
        if (!formState.loadingEdit) {
            if (enterpriseData && enterpriseData.id) {
                setFormState({
                    ...formState,
                    loadingEdit: true,
                });
                try {
                    const newState = !enterpriseData.active;
                    const messages = newState
                        ? {
                              pending: `Habilitando ${EnterpriseTypeRenderPronoun[type]}`,
                              success: "Habilitado",
                              error: `Error al habilitar ${EnterpriseTypeRenderPronoun[type]}, inténtalo de nuevo por favor`,
                          }
                        : {
                              pending: `Deshabilitando ${EnterpriseTypeRenderPronoun[type]}`,
                              success: "Deshabilitado",
                              error: `Error al deshabilitar ${EnterpriseTypeRenderPronoun[type]}, inténtalo de nuevo por favor`,
                          };

                    await toast.promise(
                        updateEnterprise(enterpriseData.id, {
                            active: newState,
                        }),
                        messages,
                    );
                    setEnterpriseData({
                        ...enterpriseData,
                        active: newState,
                    });
                    setFormState({
                        ...formState,
                        loadingEdit: false,
                    });
                } catch (e) {
                    setFormState({
                        ...formState,
                        loadingEdit: false,
                    });
                    window.location.reload();
                }
            }
        }
    };

    const deleteEnterprise = async () => {
        if (!formState.loadingRev) {
            if (enterpriseData && enterpriseData.id) {
                setFormState({
                    ...formState,
                    loadingRev: true,
                });
                try {
                    await toast.promise(deleteEnterpriseReq(enterpriseData.id), {
                        pending: `Eliminando ${EnterpriseTypeRenderPronoun[type]}`,
                        success: "Eliminado",
                        error: `Error al eliminar ${EnterpriseTypeRenderPronoun[type]}, inténtalo de nuevo por favor`,
                    });
                    router.push(`/admin/enterprises/${getRoute(type)}`);
                    setFormState({
                        ...formState,
                        loadingRev: false,
                    });
                } catch (e) {
                    setFormState({
                        ...formState,
                        loadingRev: false,
                    });
                    window.location.reload();
                }
            }
        }
    };

    return enterpriseData ? (
        <section className="service-form-wrapper">
            <h1 className="text | big bolder">Editar {EnterpriseTypeRender[type]}</h1>
            <form
                className="form-sub-container | margin-top-25"
                onSubmit={handleSummbit}
                data-state={
                    formState.loading || formState.loadingRev ? "loading" : "loaded"
                }
            >
                <fieldset className="form-section | max-width-60">
                    <input
                        type="text"
                        placeholder={`Nombre ${EnterpriseTypeRenderPronounV2[type]}`}
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
                    {formData.phone.message && (
                        <small className="yellow">
                            {formData.phone.message} {"(Este campo es opcional)"}
                        </small>
                    )}
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
                            indicator: `Logo ${EnterpriseTypeRenderPronounV2[type]}`,
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
                    <span className="text | bold gray-dark">
                        Ubicación {EnterpriseTypeRenderPronounV2[type]}
                    </span>
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
                <div
                    className="row-wrapper | gap-20 | margin-top-25 max-width-60 loading-section"
                    data-state={
                        formState.loading || formState.loadingRev ? "loading" : "loaded"
                    }
                >
                    <button
                        className="general-button touchable | gray"
                        type="button"
                        onClick={() =>
                            router.push(`/admin/enterprises/${getRoute(type)}`)
                        }
                    >
                        Cancelar
                    </button>
                    <button
                        className={`general-button touchable ${
                            formState.loading && "loading-section"
                        }`}
                        title={
                            !formState.isValid
                                ? "Por favor completa los campos con datos validos"
                                : ""
                        }
                        disabled={!formState.isValid}
                    >
                        {formState.loading ? <span className="loader"></span> : "Editar"}
                    </button>
                </div>
                <div
                    className={`form-sub-container | margin-top-50 max-width-60 ${
                        formState.loadingRev && "loading-section"
                    }`}
                    data-state={
                        formState.loading || formState.loadingRev || formState.loadingEdit
                            ? "loading"
                            : "loaded"
                    }
                >
                    <h2 className="text icon-wrapper | yellow yellow-icon medium-big bold">
                        <TriangleExclamation />
                        Zona Peligrosa
                    </h2>
                    <p>
                        Esta acción si puede revertir, pero si afectara los datos que
                        están relacionados con este mientras este deshabilitado. Por favor
                        escribe el nombre {EnterpriseTypeRenderPronounV2[type]} para
                        confirmar la acción.
                    </p>
                    <fieldset className="form-section | max-width-60">
                        <input
                            type="text"
                            placeholder={`Nombre ${EnterpriseTypeRenderPronounV2[type]}`}
                            className="form-section-input"
                            name="fullname"
                            onChange={(e) =>
                                setValidToDisable(e.target.value === enterpriseData.name)
                            }
                            autoComplete="off"
                        />

                        {formData.name.message && <small>{formData.name.message}</small>}
                    </fieldset>
                    <button
                        type="button"
                        onClick={toggleDisableEnterprise}
                        className={`general-button | yellow no-full touchable ${
                            formState.loadingEdit && "loading-section"
                        }`}
                        disabled={!validToDisable}
                    >
                        {formState.loadingEdit ? (
                            <span className="loader-black"></span>
                        ) : (
                            `${enterpriseData.active ? "Deshabilitar" : "Habilitar"} 
                        ${EnterpriseTypeRender[type]}`
                        )}
                    </button>
                </div>
                <div
                    className={`form-sub-container | margin-top-50 max-width-60 ${
                        formState.loadingRev && "loading-section"
                    }`}
                    data-state={
                        formState.loading || formState.loadingRev || formState.loadingEdit
                            ? "loading"
                            : "loaded"
                    }
                >
                    <h2 className="text icon-wrapper | red red-icon medium-big bold">
                        <TriangleExclamation />
                        Zona Peligrosa
                    </h2>
                    <p>
                        Esta acción no se puede revertir, aunque no se afectara los datos
                        que están relacionados con este. Por favor escribe el nombre{" "}
                        {EnterpriseTypeRenderPronounV2[type]} para confirmar su
                        eliminacion.
                    </p>
                    <fieldset className="form-section | max-width-60">
                        <input
                            type="text"
                            placeholder={`Nombre ${EnterpriseTypeRenderPronounV2[type]}`}
                            className="form-section-input"
                            name="fullname"
                            onChange={(e) =>
                                setValidToDelete(e.target.value === enterpriseData.name)
                            }
                            autoComplete="off"
                        />

                        {formData.name.message && <small>{formData.name.message}</small>}
                    </fieldset>
                    <button
                        type="button"
                        onClick={deleteEnterprise}
                        className={`general-button | red no-full touchable ${
                            formState.loadingRev && "loading-section"
                        }`}
                        disabled={!validToDelete}
                    >
                        {formState.loadingRev ? (
                            <span className="loader"></span>
                        ) : (
                            `Eliminar 
                        ${EnterpriseTypeRender[type]}`
                        )}
                    </button>
                </div>
            </form>
        </section>
    ) : (
        <PageLoader />
    );
};

export default EnterpriseEditByAdmin;
