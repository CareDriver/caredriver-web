"use client";
import "react-international-phone/style.css";

import { AuthContext } from "@/context/AuthContext";
import { isValidWorkshopName } from "@/utils/validator/enterprises/EnterpriseValidator";
import { FormEvent, useContext, useEffect, useState } from "react";
import PhoneForm from "../form/PhoneForm";
import { isPhoneValid } from "@/utils/validator/auth/CredentialsValidator";
import ImageUploader from "../form/ImageUploader";
import { PhotoField } from "../services/FormModels";
import { Location } from "@/utils/map/Locator";
import MapForm from "../form/MapForm";
import {
    deleteEnterpriseReq,
    getEnterpriseById,
} from "@/utils/requests/enterprise/EnterpriseRequester";
import {
    Enterprise,
    EnterpriseTypeRender,
    EnterpriseTypeRenderPronoun,
    EnterpriseTypeRenderPronounV2,
    ReqEditEnterprise,
} from "@/interfaces/Enterprise";
import { nanoid } from "nanoid";
import { GeoPoint } from "firebase/firestore";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { toast } from "react-toastify";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { useRouter } from "next/navigation";
import { isImageBase64 } from "@/utils/validator/ImageValidator";
import PageLoader from "../PageLoader";
import TriangleExclamation from "@/icons/TriangleExclamation";
import { sendEditEnterpriseReq } from "@/utils/requests/enterprise/EditEnterpriseReq";
import { getRoute } from "@/utils/parser/ToSpanishEnterprise";
import {
    EditENT_thereAreActiveReqsFromUser,
    EditENT_hasChanges,
} from "@/utils/validator/enterprises/EditEnterpriseLimiter";
import FieldDeleted from "../requests/data_renderer/form/FieldDeleted";
import ChevronDown from "@/icons/ChevronDown";
import { getLocation } from "@/utils/auth/UserAuth";
import { locationList, Locations } from "@/interfaces/Locations";

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

const EnterpriseEditData = ({
    id,
    type,
}: {
    id: string;
    type: "mechanical" | "tow" | "laundry" | "driver";
}) => {
    const { user, loadingUser } = useContext(AuthContext);
    const router = useRouter();
    const [enterpriseData, setEnterpriseData] = useState<Enterprise | null>(null);
    const [formState, setFormState] = useState({
        isValid: true,
        loading: false,
        loadingRev: false,
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

    const handleSummbit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formState.loading) {
            setFormState({
                ...formState,
                loading: true,
            });

            if (enterpriseData) {
                if (!EditENT_hasChanges(formData, enterpriseData)) {
                    toast.warning(
                        "No hiciste ningún cambio para solicitar la edicion de este servicio",
                        {
                            toastId: "no-changes-edit-ent-warning-toast",
                        },
                    );
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                    return;
                }
            }

            if (user.data && user.data.id && enterpriseData && enterpriseData.id) {
                let thereAreActiveReqs: boolean = await toast.promise(
                    EditENT_thereAreActiveReqsFromUser(user.data.id, enterpriseData.id),
                    {
                        pending: "Verificando peticiones activas",
                        success: "Verificado",
                        error: "Error verificando peticiones activas, inténtalo de nuevo por favor",
                    },
                );
                if (thereAreActiveReqs) {
                    toast.warning(
                        "Ya enviaste una petición para editar este servicio, espera a que las demas se aprueben",
                    );
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                    return;
                } else {
                    toast.success("Valido para enviar una nueva petición de edicion");
                }
            }

            if (formData.coordinates.value === null) {
                setFormData({
                    ...formData,
                    coordinates: {
                        value: null,
                        message: `Por favor selecciona la Ubicación ${EnterpriseTypeRenderPronounV2[type]}`,
                    },
                });
            } else if (!loadingUser && user.data && user.data.id) {
                if (
                    formData.name.value &&
                    formData.logo.value &&
                    formData.coordinates.value &&
                    enterpriseData
                ) {
                    var image = {
                        url: enterpriseData.logoImgUrl.url,
                        ref: enterpriseData.logoImgUrl.ref,
                    };
                    if (isImageBase64(formData.logo.value)) {
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
                        image = imgWithRef;
                    }

                    var reqId = nanoid(25);
                    const enterprise: ReqEditEnterprise = {
                        id: reqId,
                        enterpriseId: id,
                        type: type,
                        name: formData.name.value,
                        logoImgUrl: image,
                        coordinates: new GeoPoint(
                            formData.coordinates.value.lat,
                            formData.coordinates.value.lng,
                        ),
                        phone: isPhoneValid(formData.phone.value).isValid
                            ? formData.phone.value
                            : "",
                        userId: user.data.id,
                        location: formData.location,
                        latitude: formData.coordinates.value.lat,
                        longitude: formData.coordinates.value.lng,
                        aproved: false,
                        deleted: false,
                        active: true,
                    };

                    await toast.promise(sendEditEnterpriseReq(reqId, enterprise), {
                        pending: "Enviando el formulario, por favor espera",
                        success: "Formulario enviado",
                        error: "Error al enviar el formulario, inténtalo de nuevo por favor",
                    });

                    setFormState({
                        ...formState,
                        loading: false,
                    });
                    toast.info("Tu solicitud sera revisada, por favor se paciente");
                    router.push(`/enterprise/${getRoute(type)}`);
                } else {
                    console.log("error");
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
        getEnterpriseById(id)
            .then((data) => {
                if (
                    data !== undefined &&
                    data.coordinates?.latitude &&
                    data.coordinates?.longitude
                ) {
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
                    router.push(`/enterprise/${getRoute(type)}`);
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
            <p>
                Necesitamos verificar que los nuevos datos{" "}
                {EnterpriseTypeRenderPronounV2[type]} sean validos antes de editarlo.
            </p>
            {enterpriseData.deleted && (
                <div className="margin-top-25 max-width-60">
                    <FieldDeleted description="Este servicio fue eliminado" />
                </div>
            )}
            <form
                className="form-sub-container | margin-top-25"
                onSubmit={handleSummbit}
                data-state={
                    formState.loading || formState.loadingRev || enterpriseData.deleted
                        ? "loading"
                        : "loaded"
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
                {!enterpriseData.deleted && (
                    <>
                        <div
                            className="row-wrapper | gap-20 | margin-top-25 max-width-60 loading-section"
                            data-state={
                                formState.loading || formState.loadingRev
                                    ? "loading"
                                    : "loaded"
                            }
                        >
                            <button
                                className="general-button touchable | gray "
                                type="button"
                                onClick={() =>
                                    router.push(`/enterprise/${getRoute(type)}`)
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
                                {formState.loading ? (
                                    <span className="loader"></span>
                                ) : (
                                    "Solicitar Edicion"
                                )}
                            </button>
                        </div>
                        <div
                            className={`form-sub-container | margin-top-50 max-width-60 ${
                                formState.loadingRev && "loading-section"
                            }`}
                            data-state={
                                formState.loading || formState.loadingRev
                                    ? "loading"
                                    : "loaded"
                            }
                        >
                            <h2 className="text icon-wrapper | red red-icon medium-big bold">
                                <TriangleExclamation />
                                Zona Peligrosa
                            </h2>
                            <p>
                                Esta acción no se puede revertir, aunque no se afectara
                                los datos que están relacionados con este. Por favor
                                escribe el nombre {EnterpriseTypeRenderPronounV2[type]}{" "}
                                para confirmar su eliminacion.
                            </p>
                            <fieldset className="form-section | max-width-60">
                                <input
                                    type="text"
                                    placeholder={`Nombre ${EnterpriseTypeRenderPronounV2[type]}`}
                                    className="form-section-input"
                                    name="fullname"
                                    onChange={(e) =>
                                        setValidToDelete(
                                            e.target.value === enterpriseData.name,
                                        )
                                    }
                                    autoComplete="off"
                                />

                                {formData.name.message && (
                                    <small>{formData.name.message}</small>
                                )}
                            </fieldset>
                            <button
                                type="button"
                                onClick={deleteEnterprise}
                                className={`small-general-button | red touchable ${
                                    formState.loadingRev && "loading-section"
                                }`}
                                disabled={!validToDelete}
                            >
                                {formState.loadingRev ? (
                                    <span className="loader"></span>
                                ) : (
                                    <span className="text | white bold">
                                        Eliminar {EnterpriseTypeRender[type]}
                                    </span>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </form>
        </section>
    ) : (
        <PageLoader />
    );
};

export default EnterpriseEditData;
