"use client";

import {
  LicenseInterface,
  LicenseUpdateReq,
} from "@/interfaces/PersonalDocumentsInterface";
import { FormEvent, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isValidLicenseDate,
  isValidLicenseNumber,
} from "@/components/app_modules/server_users/validators/for_data/DriveValidator";
import { toast } from "react-toastify";
import { sendLicenseUpdateReq } from "@/components/app_modules/server_users/api/LicenseUpdaterReq";
import {
  EMPTY_REF_ATTACHMENT,
  RefAttachment,
} from "@/components/form/models/RefAttachment";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { nanoid } from "nanoid";
import { Timestamp } from "firebase/firestore";
import { isImageBase64 } from "@/validators/ImageValidator";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import SelfieSection from "@/components/form/view/sections/SelfieSection";
import { AuthContext } from "@/context/AuthContext";
import PageLoading from "@/components/loaders/PageLoading";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { DEFAULT_LICENSE, License } from "../../../models/LicenseFields";
import { AttachmentField } from "@/components/form/models/FormFields";
import { DEFAUL_ATTACHMENT_FIELD } from "@/components/form/models/DefaultFields";
import NumberField from "@/components/form/view/fields/NumberField";
import DateField from "@/components/form/view/fields/DateField";
import {
  isValidAttachmentField,
  isValidDateField,
  isValidTextField,
} from "@/components/form/validators/FieldValidators";
import { RequestLimitValidatorToUpdateLicence } from "../../../validators/for_request_limit/RequestLimitValidatorToUpdateLicence";
import { routeToRequestToBeServerUserAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import { ServiceType } from "@/interfaces/Services";
import BaseForm from "@/components/form/view/forms/BaseForm";
import LicenceNumberField from "@/components/form/view/fields/LicenceNumberField";
import TextField from "@/components/form/view/fields/TextField";
import CheckField from "@/components/form/view/fields/CheckField";
import { VehicleType } from "@/interfaces/VehicleInterface";
import LicenseCategoryField from "@/components/form/view/fields/LicenseCategoryField";
import { LicenseCategories } from "@/interfaces/LicenseCategories";

type LicensedVehicles = VehicleType;

interface Form {
  license: License;
  selfie: AttachmentField;
}

const DEFAULT_FORM: Form = {
  license: DEFAULT_LICENSE,
  selfie: DEFAUL_ATTACHMENT_FIELD,
};

interface Props {
  type: LicensedVehicles;
}

const LicenseRenewalForm: React.FC<Props> = ({ type }) => {
  const router = useRouter();
  const { user, checkingUserAuth } = useContext(AuthContext);
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [invalidFormMessage, setInvalidFormMessage] = useState<string>("");

  const requestLimitValidator = new RequestLimitValidatorToUpdateLicence();
  const isValidForm = useCallback((): boolean => {
    return (
      isValidTextField(form.license.number) &&
      isValidDateField(form.license.expirationDate) &&
      isValidAttachmentField(form.license.behindPhoto) &&
      isValidAttachmentField(form.license.frontPhoto) &&
      isValidAttachmentField(form.selfie)
    );
  }, [form]);

  const getLicenseFormErrors = useCallback((): string => {
    if (!isValidTextField(form.license.number)) {
      return "El número de licencia es inválido.";
    }
    if (!isValidDateField(form.license.expirationDate)) {
      return "La fecha de vencimiento es inválida.";
    }
    if (!isValidAttachmentField(form.license.behindPhoto)) {
      return "La foto del reverso de la licencia es inválida.";
    }
    if (!isValidAttachmentField(form.license.frontPhoto)) {
      return "La foto del anverso de la licencia es inválida.";
    }
    if (!isValidAttachmentField(form.selfie)) {
      return "La foto de selfie es inválida.";
    }
    return "";
  }, [form]);

  const uploadImages = async () => {
    if (user && user.serviceVehicles) {
      var vehicle = user.serviceVehicles[type];
      var frontImgUrl: RefAttachment = vehicle?.license.frontImgUrl
        ? vehicle?.license.frontImgUrl
        : EMPTY_REF_ATTACHMENT;
      var behindImgUrl: RefAttachment = vehicle?.license.backImgUrl
        ? vehicle?.license.backImgUrl
        : EMPTY_REF_ATTACHMENT;
      var realTimePhotoImgUrl: RefAttachment = EMPTY_REF_ATTACHMENT;

      if (form) {
        if (form.license.frontPhoto.value && form.license.behindPhoto.value) {
          try {
            if (isImageBase64(form.license.frontPhoto.value)) {
              frontImgUrl = await uploadFileBase64(
                DirectoryPath.Licenses,
                form.license.frontPhoto.value,
              );
            }
            if (isImageBase64(form.license.behindPhoto.value)) {
              behindImgUrl = await uploadFileBase64(
                DirectoryPath.Licenses,
                form.license.behindPhoto.value,
              );
            }
          } catch (e) {
            throw e;
          }
        }

        if (form.selfie.value) {
          try {
            realTimePhotoImgUrl = await uploadFileBase64(
              DirectoryPath.Selfies,
              form.selfie.value,
            );
          } catch (e) {
            throw e;
          }
        }
      }

      return {
        frontImgUrl,
        behindImgUrl,
        realTimePhotoImgUrl,
      };
    }
  };

  const uploadForm = async (
    vehiclesData: LicenseInterface,
    realTimePhotoImgUrl: RefAttachment,
  ) => {
    if (user && user.id) {
      var formId = nanoid(30);
      try {
        var reqDoc: LicenseUpdateReq = {
          id: formId,
          userId: user.id,
          userName: user.fullName,
          vehicleType: type,
          licenseNumber: vehiclesData.licenseNumber,
          expiredDateLicense: vehiclesData.expiredDateLicense,
          frontImgUrl: vehiclesData.frontImgUrl,
          backImgUrl: vehiclesData.backImgUrl,
          realTimePhotoImgUrl: realTimePhotoImgUrl,
          aproved: false,
          active: true,
          category: vehiclesData.category,
          requireGlasses: vehiclesData.requireGlasses,
          requireHeadphones: vehiclesData.requireHeadphones,
        };
        await sendLicenseUpdateReq(formId, reqDoc);
      } catch (e) {
        throw e;
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setInvalidFormMessage(getLicenseFormErrors());
    if (formState.loading) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      loading: true,
    }));

    if (!isValidForm()) {
      setFormState((prev) => ({
        ...prev,
        isValid: false,
        loading: false,
      }));
      toast.error("Formulario invalido");
      return;
    }

    if (user && user.id) {
      let thereAreActiveReqs = await toast.promise(
        requestLimitValidator.hasRequestsSent(user.id, type),
        {
          pending: "Verificando peticiones activas",
          success: "Verificado",
          error:
            "Error verificando peticiones activas, inténtalo de nuevo por favor",
        },
      );
      if (thereAreActiveReqs) {
        toast.warning(
          "Ya enviaste una petición para editar tu licencia, espera a que se revise",
        );
        setFormState((prev) => ({
          ...prev,
          loading: false,
        }));
        return;
      } else {
        toast.success(
          "Valido para enviar una nueva petición para actualizar tu licencia",
        );
      }
    }

    try {
      const res = await toast.promise(uploadImages(), {
        pending: "Subiendo imágenes, por favor espera",
        success: "Imágenes subidas",
        error: "Error al subir imágenes, inténtalo de nuevo por favor",
      });
      if (res && form.license.expirationDate.value) {
        const { frontImgUrl, behindImgUrl, realTimePhotoImgUrl } = res;
        await toast.promise(
          uploadForm(
            {
              licenseNumber: form.license.number.value,
              expiredDateLicense: Timestamp.fromDate(
                form.license.expirationDate.value,
              ),
              frontImgUrl: frontImgUrl,
              backImgUrl: behindImgUrl,
              category: form.license.category.value,
              requireGlasses: form.license.requireGlasses.value,
              requireHeadphones: form.license.requiredHeadphones.value,
            },
            realTimePhotoImgUrl,
          ),
          {
            pending: "Enviando el formulario, por favor espera",
            success: "Formulario enviado",
            error:
              "Error al enviar el formulario, inténtalo de nuevo por favor",
          },
        );
        toast.info(
          "Tu solicitud sera revisada por uno de nuestros administradores",
          {
            toastId: "toast-info-sent-form-succesful",
          },
        );
        const serviceType: ServiceType = type === "tow" ? "tow" : "driver";
        router.push(routeToRequestToBeServerUserAsUser(serviceType));
        setFormState({
          loading: false,
          isValid: true,
        });
      }
    } catch (e) {
      setFormState({
        loading: false,
        isValid: false,
      });
    }
  };

  useEffect(() => {
    if (user && user.serviceVehicles) {
      switch (type) {
        case "car":
        case "motorcycle":
        case "tow":
          var vehicle = user.serviceVehicles[type];
          if (vehicle) {
            var license: LicenseInterface = vehicle.license;
            setForm((prev) => ({
              ...prev,
              license: {
                ...prev.license,
                number: {
                  value: license.licenseNumber,
                  message: null,
                },
                expirationDate: {
                  value: undefined,
                  message: null,
                },
                frontPhoto: {
                  value: license.frontImgUrl
                    ? license.frontImgUrl.url
                    : undefined,
                  message: license.frontImgUrl
                    ? null
                    : "No tienes foto frontal de tu licencia",
                },
                behindPhoto: {
                  value: license.backImgUrl
                    ? license.backImgUrl.url
                    : undefined,
                  message: license.backImgUrl
                    ? null
                    : "No tienes foto por atrás de tu licencia",
                },
              },
            }));
          }
          break;
        default:
          router.push(`/services/${type === "tow" ? "tow" : "drive"}`);
          toast.error("Licencia no encontrada", {
            toastId: "licence-no-found-error",
          });
          break;
      }
    } else {
      const serviceType: ServiceType = type === "tow" ? "tow" : "driver";
      router.push(routeToRequestToBeServerUserAsUser(serviceType));
      toast.error("Licencia no encontrada", {
        toastId: "licence-no-found-error",
      });
    }
  }, [router, type, user]);

  useEffect(() => {
    setFormState((prev) => ({ ...prev, isValid: isValidForm() }));
  }, [form, isValidForm]);

  if (checkingUserAuth) {
    <PageLoading />;
  }

  return (
    form && (
      <div className="service-form-wrapper">
        <div className="max-width-60">
          <h1 className="text | big bold">Actualiza tu licencia de conducir</h1>
          <p className="text | light">
            Necesitamos verificar que tu licencia sigue siendo valida para que
            continues trabajando con nosotros.
          </p>
        </div>
        <BaseForm
          content={{
            button: {
              content: {
                legend: "Enviar Solicitud",
              },
              behavior: {
                // isValid: formState.isValid,
                isValid: true,
                loading: formState.loading,
              },
            },
            styleClasses: "max-width-60",
          }}
          behavior={{
            loading: formState.loading,
            onSummit: handleSubmit,
          }}
        >
          <LicenceNumberField
            field={{
              values: form.license.number,
              setter: (e) =>
                setForm((prev) => ({
                  ...prev,
                  license: { ...prev.license, number: e },
                })),
              validator: isValidLicenseNumber,
            }}
          />
          <LicenseCategoryField
            location={form.license.category.value}
            setter={(category) =>
              setForm((prev) => ({
                ...prev,
                license: {
                  ...prev.license,
                  category: { value: category, message: null },
                },
              }))
            }
          />
          <CheckField
            marker={{
              isCheck: form.license.requireGlasses.value,
              setCheck: (s) =>
                setForm((prev) => ({
                  ...prev,
                  license: {
                    ...prev.license,
                    requireGlasses: { value: s, message: null },
                  },
                })),
            }}
            content={{
              checkDescription: (
                <p>Marca si requiere usar lentes para conducir</p>
              ),
            }}
          />

          <CheckField
            marker={{
              isCheck: form.license.requiredHeadphones.value,
              setCheck: (s) =>
                setForm((prev) => ({
                  ...prev,
                  license: {
                    ...prev.license,
                    requiredHeadphones: { value: s, message: null },
                  },
                })),
            }}
            content={{
              checkDescription: (
                <p>Marca si requiere usar audífonos para conducir</p>
              ),
            }}
          />
          <DateField
            field={{
              values: form.license.expirationDate,
              setter: (e) =>
                setForm((prev) => ({
                  ...prev,
                  license: {
                    ...prev.license,
                    expirationDate: e,
                  },
                })),
              validator: isValidLicenseDate,
            }}
            legend="Fecha de expiración"
          />
          <ImageUploader
            uploader={{
              image: form.license.frontPhoto,
              setImage: (i) => {
                setForm((prev) => ({
                  ...prev,
                  frontPhoto: i,
                }));
              },
            }}
            content={{
              legend: "Parte frontal de la licencia",
              imageInCircle: false,
              id: "tow-license-front-photo",
            }}
          />
          <ImageUploader
            uploader={{
              image: form.license.behindPhoto,
              setImage: (i) => {
                setForm((prev) => ({
                  ...prev,
                  behindPhoto: i,
                }));
              },
            }}
            content={{
              legend: "Parte posterior de la licencia",
              imageInCircle: false,
              id: "tow-license-behind-photo",
            }}
          />
          <SelfieSection
            image={form.selfie}
            setImage={(e) =>
              setForm((prev) => ({
                ...prev,
                selfie: e,
              }))
            }
          />
        </BaseForm>
        {invalidFormMessage && (
          <p style={{ color: "red", fontSize: 16, marginTop: 16 }}>
            * {invalidFormMessage}
          </p>
        )}
      </div>
    )
  );
};

export default LicenseRenewalForm;
