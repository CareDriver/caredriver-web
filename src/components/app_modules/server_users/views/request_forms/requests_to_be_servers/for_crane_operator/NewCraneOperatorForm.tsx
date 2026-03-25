"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import SelfieSection from "@/components/form/view/sections/SelfieSection";
import PrivacyTermsSection from "@/components/form/view/sections/PrivacyTermsSection";
import { uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { AuthContext } from "@/context/AuthContext";
import {
  Vehicle,
  emptyVehicleCar,
  towReqBuilder,
} from "@/interfaces/UserRequest";
import { Timestamp } from "firebase/firestore";
import { Locations } from "@/interfaces/Locations";
import {
  EMPTY_REF_ATTACHMENT,
  RefAttachment,
} from "@/components/form/models/RefAttachment";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceReqState } from "@/interfaces/Services";
import { isImageBase64 } from "@/validators/ImageValidator";
import { saveTowReq } from "@/components/app_modules/server_users/api/TowRequester";
import { updateIdCard } from "@/components/app_modules/users/api/IdCardUpdated";
import {
  DEFAULT_PERSONAL_DATA,
  PersonalData,
} from "@/components/app_modules/server_users/models/PersonalDataFields";
import {
  DEFAULT_VEHICLE,
  Vehicle as VehicleFiels,
} from "@/components/app_modules/server_users/models/VehicleFields";
import {
  AttachmentField,
  TextField,
} from "@/components/form/models/FormFields";
import {
  DEFAUL_ATTACHMENT_FIELD,
  DEFAUL_TEXT_FIELD,
} from "@/components/form/models/DefaultFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import VehicleForm from "../../vehicle_forms/VehicleForm";
import PersonalDataForm from "../../../../../users/views/request_forms/to_manage_data/PersonalDataForm";
import ServiceStateRenderer from "../ServiceStateRenderer";
import { CraneOperatorStatusHandler } from "@/components/app_modules/server_users/api/requests_status_handler/CraneOperatorStatusHandler";
import PageLoading from "@/components/loaders/PageLoading";
import {
  isValidAttachmentField,
  isValidTextField,
} from "@/components/form/validators/FieldValidators";
import { isValidPersonalData } from "@/components/app_modules/server_users/validators/for_data/PersonalDataValidator";
import { isValidVehicle } from "@/components/app_modules/server_users/validators/for_data/VehicleValidator";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { isPhoneValid } from "@/components/app_modules/users/validators/for_data/CredentialsValidator";
import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";
import { acceptTerms } from "@/utils/requesters/AcceptTerms";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";

interface Form {
  personalData: PersonalData;
  vehicle: VehicleFiels;
  towVehiclePhoto: AttachmentField;
  towExperience: TextField;
  selfie: AttachmentField;
  termsCheck: boolean;
}

interface Props {
  baseUser?: UserInterface;
}

const NewCraneOperatorForm: React.FC<Props> = ({ baseUser }) => {
  const { user, checkingUserAuth } = useContext(AuthContext);
  const [requesterUser, setRequesterUser] = useState<UserInterface | undefined>(
    baseUser,
  );
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [invalidFormMessage, setInvalidFormMessage] = useState<string>("");
  const [policeRecorderFile, setPoliceRecorderFile] = useState<AttachmentField>(
    {
      ...DEFAUL_ATTACHMENT_FIELD,
    },
  );
  const [isTowExperienceFocused, setIsTowExperienceFocused] = useState(false);

  const uploadImages = async () => {
    let vehiclesData: Vehicle = emptyVehicleCar;
    var newProfilePhotoImgUrl: string | RefAttachment = EMPTY_REF_ATTACHMENT;
    var addressPhotoRef: string | RefAttachment = EMPTY_REF_ATTACHMENT;
    var realTimePhotoImgUrl: RefAttachment = EMPTY_REF_ATTACHMENT;
    var towVehiclePhotoRef: RefAttachment = EMPTY_REF_ATTACHMENT;

    if (requesterUser) {
      newProfilePhotoImgUrl = requesterUser.photoUrl;
      if (
        !checkingUserAuth &&
        form.personalData.photo.value &&
        isImageBase64(form.personalData.photo.value)
      ) {
        try {
          newProfilePhotoImgUrl = await uploadFileBase64(
            DirectoryPath.TempProfilePhotos,
            form.personalData.photo.value,
          );
        } catch (e) {
          throw e;
        }
      }

      addressPhotoRef = requesterUser.addressPhoto;
      if (
        !checkingUserAuth &&
        form.personalData.addressPhoto.value &&
        isImageBase64(form.personalData.addressPhoto.value)
      ) {
        try {
          addressPhotoRef = await uploadFileBase64(
            DirectoryPath.ElectricityBills,
            form.personalData.addressPhoto.value,
          );
        } catch (e) {
          throw e;
        }
      }

      if (
        form.vehicle.license.frontPhoto.value &&
        form.vehicle.license.behindPhoto.value
      ) {
        try {
          const frontImgUrl = await uploadFileBase64(
            DirectoryPath.Licenses,
            form.vehicle.license.frontPhoto.value,
          );
          const behindImgUrl = await uploadFileBase64(
            DirectoryPath.Licenses,
            form.vehicle.license.behindPhoto.value,
          );
          if (form.vehicle.license.expirationDate.value) {
            vehiclesData = {
              type: form.vehicle.type,
              license: {
                licenseNumber: form.vehicle.license.number.value,
                expiredDateLicense: Timestamp.fromDate(
                  form.vehicle.license.expirationDate.value,
                ),
                frontImgUrl: frontImgUrl,
                backImgUrl: behindImgUrl,
                category: form.vehicle.license.category.value,
                requireGlasses: form.vehicle.license.requireGlasses.value,
                requireHeadphones:
                  form.vehicle.license.requiredHeadphones.value,
              },
            };
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

      if (form.towVehiclePhoto.value) {
        try {
          towVehiclePhotoRef = await uploadFileBase64(
            DirectoryPath.Documents,
            form.towVehiclePhoto.value,
          );
        } catch (e) {
          throw e;
        }
      }
    }

    return {
      vehiclesData,
      newProfilePhotoImgUrl,
      addressPhotoRef,
      realTimePhotoImgUrl,
      towVehiclePhotoRef,
    };
  };

  const uploadForm = async (
    vehicleData: Vehicle,
    newProfilePhotoImgUrl: string | RefAttachment,
    addressPhotoImgUrl: string | RefAttachment,
    realTimePhotoImgUrl: RefAttachment,
    towVehiclePhotoRef: RefAttachment,
  ) => {
    if (requesterUser) {
      var formId = nanoid(30);
      try {
        const pdfRef = await toast.promise(uploadPDF(), {
          pending: "Subiendo PDF de Antecedentes",
          success: "PDF de Antecedentes Subido",
          error: "Error al subir el PDF, inténtalo de nuevo",
        });

        if (!pdfRef) return;

        await saveTowReq(
          formId,
          towReqBuilder(
            formId,
            requesterUser.id === undefined ? "" : requesterUser.id,
            form.personalData.fullname.value,
            form.personalData.homeAddress.value,
            addressPhotoImgUrl,
            newProfilePhotoImgUrl,
            "", // enterprise assigned post-approval
            realTimePhotoImgUrl,
            requesterUser.services,
            requesterUser.location === undefined
              ? Locations.CochabambaBolivia
              : requesterUser.location,
            [vehicleData],
            pdfRef,
            towVehiclePhotoRef,
            isValidTextField(form.towExperience)
              ? form.towExperience.value.trim()
              : undefined,
          ),
        );

        if (requesterUser.id) {
          var toUpdate: Partial<UserInterface> = {
            serviceRequests: {
              ...requesterUser.serviceRequests,
              tow: {
                id: formId,
                state: ServiceReqState.Reviewing,
              },
            },
          };
          if (
            isValidTextField(form.personalData.alternativePhoneNumber) &&
            isPhoneValid(form.personalData.alternativePhoneNumber.value).isValid
          ) {
            toUpdate = {
              ...toUpdate,
              alternativePhoneNumber: parseBoliviaPhone(
                form.personalData.alternativePhoneNumber.value,
              ),
            };
          }

          try {
            await updateUser(requesterUser.id, toUpdate);
          } catch (e) {
            throw e;
          }
        }
      } catch (e) {
        throw e;
      }
    }
  };

  function getInvalidFormMessage(): string {
    if (!isValidPersonalData(form.personalData)) {
      return "Por favor, completa tus datos personales correctamente.";
    }

    if (!isValidVehicle(form.vehicle)) {
      return "Por favor, completa los datos de tu licencia de conducir correctamente.";
    }

    if (!isValidAttachmentField(form.selfie)) {
      return "Por favor, tomate una selfie para verificar tu identidad.";
    }

    if (!isValidAttachmentField(form.towVehiclePhoto)) {
      return "Por favor, sube una foto de tu grúa o vehículo para remolcar.";
    }

    if (!form.termsCheck) {
      return "Debes aceptar los términos y condiciones y la política de privacidad.";
    }

    return "";
  }

  const uploadPDF = async () => {
    if (policeRecorderFile.value) {
      try {
        return await uploadFileBase64(
          DirectoryPath.Documents,
          policeRecorderFile.value,
        );
      } catch (e) {
        console.log(e);
      }
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setInvalidFormMessage(getInvalidFormMessage());
    if (formState.loading) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      loading: true,
    }));

    if (!isValidForm(form) || !requesterUser) {
      toast.error("Formulario invalido");
      setFormState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }
    try {
      await acceptTerms(user?.id ?? "");

      await updateIdCard(form.personalData.idCard, requesterUser);
      const {
        vehiclesData,
        newProfilePhotoImgUrl,
        addressPhotoRef,
        realTimePhotoImgUrl,
        towVehiclePhotoRef,
      } = await toast.promise(uploadImages(), {
        pending: "Subiendo imágenes, por favor espera",
        success: "Imágenes subidas",
        error: "Error al subir imágenes, inténtalo de nuevo por favor",
      });
      await toast.promise(
        uploadForm(
          vehiclesData,
          newProfilePhotoImgUrl,
          addressPhotoRef,
          realTimePhotoImgUrl,
          towVehiclePhotoRef,
        ),
        {
          pending: "Enviando el formulario, por favor espera",
          success: "Formulario enviado",
          error: "Error al enviar el formulario, inténtalo de nuevo por favor",
        },
      );
      window.location.reload();
    } catch (e) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        isValid: false,
      }));
    }
  };

  function isValidForm(form: Form): boolean {
    return (
      isValidPersonalData(form.personalData) &&
      isValidVehicle(form.vehicle) &&
      isValidAttachmentField(form.selfie) &&
      isValidAttachmentField(form.towVehiclePhoto) &&
      policeRecorderFile.value !== undefined &&
      form.termsCheck
    );
  }

  useEffect(
    () =>
      setFormState((prev) => ({
        ...prev,
        isValid: isValidForm(form),
      })),
    [form],
  );

  useEffect(() => {
    if (!requesterUser && user) {
      setRequesterUser(user);
    }
  }, [checkingUserAuth, requesterUser, user]);

  if (checkingUserAuth) {
    return <PageLoading />;
  }

  return (
    requesterUser && (
      <div className="service-form-wrapper">
        <ServiceStateRenderer
          statusHandler={new CraneOperatorStatusHandler(requesterUser)}
        />

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
            styleClasses: "max-width-80",
          }}
          behavior={{
            loading: formState.loading,
            onSummit: handleSubmit,
          }}
        >
          <PersonalDataForm
            baseUser={baseUser}
            personalData={form.personalData}
            setPersonalData={(d) =>
              setForm((prev) => ({ ...prev, personalData: d }))
            }
          />
          <VehicleForm
            vehicle={form.vehicle}
            setVehicle={(d) => setForm((prev) => ({ ...prev, vehicle: d }))}
            craneOperator
          />

          <div className="form-sub-container | margin-top-25">
            <h2 className="text | medium-big bold">
              Foto del vehículo de remolque
            </h2>
            <p className="text | light">
              Sube una foto clara del vehículo que usarás en el servicio de
              remolque (grúa o auto remolcador habilitado).
            </p>
            <ImageUploader
              uploader={{
                image: form.towVehiclePhoto,
                setImage: (d) =>
                  setForm((prev) => ({ ...prev, towVehiclePhoto: d })),
              }}
              content={{
                id: "tow-vehicle-photo",
                legend: "Vehículo de remolque",
                imageInCircle: false,
              }}
            />
          </div>

          <div className="form-sub-container | margin-top-25">
            <h2 className="text | medium-big bold">Experiencia (Opcional)</h2>
            <fieldset className="form-section margin-top-10">
              <textarea
                className="form-section-input"
                value={form.towExperience.value}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    towExperience: {
                      ...prev.towExperience,
                      value: e.target.value,
                      message: null,
                    },
                  }))
                }
                placeholder={
                  isTowExperienceFocused
                    ? "Ejemplo: Tengo 5 años atendiendo remolques urbanos e interprovinciales, con maniobras seguras y buen trato al cliente."
                    : ""
                }
                rows={4}
                onFocus={() => setIsTowExperienceFocused(true)}
                onBlur={() => setIsTowExperienceFocused(false)}
              />
              <legend className="form-section-legend">
                Cuéntanos tu experiencia
              </legend>
            </fieldset>
          </div>

          <SelfieSection
            image={form.selfie}
            setImage={(d) => setForm((prev) => ({ ...prev, selfie: d }))}
          />

          <PrivacyTermsSection
            isCheck={form.termsCheck}
            setCheck={(d) => setForm((prev) => ({ ...prev, termsCheck: d }))}
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

export default NewCraneOperatorForm;

const DEFAULT_FORM: Form = {
  personalData: DEFAULT_PERSONAL_DATA,
  vehicle: DEFAULT_VEHICLE,
  towVehiclePhoto: DEFAUL_ATTACHMENT_FIELD,
  towExperience: DEFAUL_TEXT_FIELD,
  selfie: DEFAUL_ATTACHMENT_FIELD,
  termsCheck: false,
};
