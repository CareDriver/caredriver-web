"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { VehicleType } from "@/interfaces/VehicleInterface";
import VehiclesForm from "../../vehicle_forms/VehiclesForm";
import SelfieSection from "@/components/form/view/sections/SelfieSection";
import PrivacyTermsSection from "@/components/form/view/sections/PrivacyTermsSection";
import { uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { AuthContext } from "@/context/AuthContext";
import {
  DEFAULT_VEHICLE,
  Vehicle as VehicleFiels,
} from "@/components/app_modules/server_users/models/VehicleFields";
import { Vehicle, driveReqBuilder } from "@/interfaces/UserRequest";
import { Timestamp } from "firebase/firestore";
import { saveDriveReq } from "@/components/app_modules/server_users/api/DriveRequester";
import { Locations } from "@/interfaces/Locations";
import {
  EMPTY_REF_ATTACHMENT,
  RefAttachment,
} from "@/components/form/models/RefAttachment";
import { toast } from "react-toastify";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import { Gender, UserInterface } from "@/interfaces/UserInterface";
import { ServiceReqState } from "@/interfaces/Services";
import { isImageBase64 } from "@/validators/ImageValidator";
import { updateIdCard } from "@/components/app_modules/users/api/IdCardUpdated";
import {
  DEFAULT_PERSONAL_DATA,
  PersonalData,
} from "@/components/app_modules/server_users/models/PersonalDataFields";
import {
  AttachmentField,
  TextField,
} from "@/components/form/models/FormFields";
import {
  DEFAUL_ATTACHMENT_FIELD,
  DEFAUL_TEXT_FIELD,
} from "@/components/form/models/DefaultFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import PersonalDataForm from "../../../../../users/views/request_forms/to_manage_data/PersonalDataForm";
import ServiceStateRenderer from "../ServiceStateRenderer";
import { DriverStatusHandler } from "@/components/app_modules/server_users/api/requests_status_handler/DriverStatusHandler";
import PageLoading from "@/components/loaders/PageLoading";
import { genDocId } from "@/utils/generators/IdGenerator";
import BaseForm from "@/components/form/view/forms/BaseForm";
import {
  isValidAttachmentField,
  isValidTextField,
} from "@/components/form/validators/FieldValidators";
import { isPhoneValid } from "@/components/app_modules/users/validators/for_data/CredentialsValidator";
import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";
import { isValidPersonalData } from "@/components/app_modules/server_users/validators/for_data/PersonalDataValidator";
import { areValidVehicles } from "@/components/app_modules/server_users/validators/for_data/VehicleValidator";
import { acceptTerms } from "@/utils/requesters/AcceptTerms";
import PoliceRecordUploader from "@/components/form/view/attachment_fields/PoliceRecordUploader";
import Popup from "@/components/modules/Popup";

interface Form {
  personalData: PersonalData;
  vehicles: VehicleFiels[];
  driverExperience: TextField;
  selfie: AttachmentField;
  termsCheck: boolean;
}

interface Props {
  baseUser?: UserInterface;
}

const NewDriverForm: React.FC<Props> = ({ baseUser }) => {
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
  const [policeRecordByChat, setPoliceRecordByChat] = useState(false);
  const [showPoliceRecordModal, setShowPoliceRecordModal] = useState(false);
  const [isDriverExperienceFocused, setIsDriverExperienceFocused] =
    useState(false);

  const uploadImages = async () => {
    let vehiclesData: Vehicle[] = [];
    var profilePhotoRef: string | RefAttachment = EMPTY_REF_ATTACHMENT;
    var addressPhotoRef: string | RefAttachment = EMPTY_REF_ATTACHMENT;
    var selfieRef: RefAttachment = EMPTY_REF_ATTACHMENT;

    if (requesterUser) {
      profilePhotoRef = requesterUser.photoUrl;
      if (
        !checkingUserAuth &&
        form.personalData.photo.value &&
        isImageBase64(form.personalData.photo.value)
      ) {
        try {
          profilePhotoRef = await uploadFileBase64(
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

      for (let i = 0; i < form.vehicles.length; i++) {
        var vehicle = form.vehicles[i];
        if (
          vehicle.license.frontPhoto.value &&
          vehicle.license.behindPhoto.value
        ) {
          try {
            const frontImgUrl = await uploadFileBase64(
              DirectoryPath.Licenses,
              vehicle.license.frontPhoto.value,
            );
            const behindImgUrl = await uploadFileBase64(
              DirectoryPath.Licenses,
              vehicle.license.behindPhoto.value,
            );
            if (vehicle.license.expirationDate.value) {
              vehiclesData.push({
                type: vehicle.type,
                license: {
                  licenseNumber: vehicle.license.number.value,
                  expiredDateLicense: Timestamp.fromDate(
                    vehicle.license.expirationDate.value,
                  ),
                  frontImgUrl: frontImgUrl,
                  backImgUrl: behindImgUrl,
                  category: vehicle.license.category.value,
                  requireGlasses: vehicle.license.requireGlasses.value,
                  requireHeadphones: vehicle.license.requiredHeadphones.value,
                },
              });
            }
          } catch (e) {
            throw e;
          }
        }
      }

      if (form.selfie.value) {
        try {
          selfieRef = await uploadFileBase64(
            DirectoryPath.Selfies,
            form.selfie.value,
          );
        } catch (e) {
          throw e;
        }
      }
    }

    return {
      vehiclesData,
      profilePhotoRef,
      addressPhotoRef,
      selfieRef,
    };
  };

  const uploadForm = async (
    vehiclesData: Vehicle[],
    profilePhotoRef: string | RefAttachment,
    addressPhotoRef: string | RefAttachment,
    selfieRef: RefAttachment,
  ) => {
    if (requesterUser) {
      var formId = genDocId();
      try {
        let pdfRef: RefAttachment | null | undefined = undefined;
        if (policeRecorderFile.value) {
          pdfRef = await toast.promise(uploadPDF(), {
            pending: "Subiendo PDF de Antecedentes",
            success: "PDF de Antecedentes Subido",
            error: "Error al subir el PDF, inténtalo de nuevo",
          });
        }

        await saveDriveReq(
          formId,
          driveReqBuilder(
            formId,
            requesterUser.id === undefined ? "" : requesterUser.id,
            form.personalData.fullname.value,
            form.personalData.homeAddress.value,
            addressPhotoRef,
            profilePhotoRef,
            vehiclesData,
            selfieRef,
            requesterUser.services,
            requesterUser.location === undefined
              ? Locations.CochabambaBolivia
              : requesterUser.location,
            form.personalData.bloodType.value,
            form.personalData.gender.value as Gender,
            undefined, // enterprise assigned post-approval
            pdfRef ?? undefined,
            policeRecordByChat,
            isValidTextField(form.driverExperience)
              ? form.driverExperience.value.trim()
              : undefined,
          ),
        );

        var newReqState;
        if (form.vehicles.length > 1) {
          newReqState = {
            ...requesterUser.serviceRequests,
            driveCar: {
              id: formId,
              state: ServiceReqState.Reviewing,
            },
            driveMotorcycle: {
              id: formId,
              state: ServiceReqState.Reviewing,
            },
          };
        } else {
          newReqState =
            form.vehicles[0].type.type === VehicleType.CAR
              ? {
                  ...requesterUser.serviceRequests,
                  driveCar: {
                    id: formId,
                    state: ServiceReqState.Reviewing,
                  },
                }
              : {
                  ...requesterUser.serviceRequests,
                  driveMotorcycle: {
                    id: formId,
                    state: ServiceReqState.Reviewing,
                  },
                };
        }

        if (requesterUser.id) {
          var toUpdate: Partial<UserInterface> = {
            serviceRequests: newReqState,
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
              bloodType: form.personalData.bloodType.value,
              gender: form.personalData.gender.value as Gender,
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

  function isValidForm(form: Form): boolean {
    return (
      isValidPersonalData(form.personalData) &&
      areValidVehicles(form.vehicles) &&
      isValidAttachmentField(form.selfie) &&
      (policeRecorderFile.value !== undefined || policeRecordByChat) &&
      form.termsCheck
    );
  }

  function getInvalidFormMessage(): string {
    if (!isValidPersonalData(form.personalData)) {
      return "Por favor, completa tus datos personales correctamente.";
    }

    if (!areValidVehicles(form.vehicles)) {
      return "Por favor, completa los datos de tu(s) licencia(s) de conducir correctamente.";
    }

    if (!isValidAttachmentField(form.selfie)) {
      return "Por favor, tomate una selfie para verificar tu identidad.";
    }

    if (!policeRecorderFile.value && !policeRecordByChat) {
      return "Debes subir tus antecedentes policiales o confirmar que los enviarás por chat.";
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

    if (!policeRecorderFile.value && !policeRecordByChat) {
      setShowPoliceRecordModal(true);
      setFormState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

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
      const { vehiclesData, profilePhotoRef, addressPhotoRef, selfieRef } =
        await toast.promise(uploadImages(), {
          pending: "Subiendo imágenes, por favor espera",
          success: "Imágenes subidas",
          error: "Error al subir imágenes, inténtalo de nuevo por favor",
        });

      await toast.promise(
        uploadForm(vehiclesData, profilePhotoRef, addressPhotoRef, selfieRef),
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

  useEffect(
    () =>
      setFormState((prev) => ({
        ...prev,
        ...formState,
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
          statusHandler={new DriverStatusHandler(requesterUser)}
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

          <VehiclesForm
            vehicles={form.vehicles}
            setVehicles={(d) => setForm((prev) => ({ ...prev, vehicles: d }))}
          />

          <div className="form-sub-container | margin-top-25">
            <h2 className="text | medium-big bold">Experiencia (Opcional)</h2>
            <fieldset className="form-section margin-top-10">
              <textarea
                className="form-section-input"
                value={form.driverExperience.value}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    driverExperience: {
                      ...prev.driverExperience,
                      value: e.target.value,
                      message: null,
                    },
                  }))
                }
                placeholder={
                  isDriverExperienceFocused
                    ? "Ejemplo: Tengo 4 años conduciendo en ciudad y carretera, con buen trato al cliente y manejo responsable."
                    : ""
                }
                rows={4}
                onFocus={() => setIsDriverExperienceFocused(true)}
                onBlur={() => setIsDriverExperienceFocused(false)}
              />
              <legend className="form-section-legend">
                Cuéntanos tu experiencia
              </legend>
            </fieldset>
          </div>

          <PoliceRecordUploader
            file={policeRecorderFile}
            setFile={setPoliceRecorderFile}
            allowByChat={policeRecordByChat}
            setAllowByChat={setPoliceRecordByChat}
          />

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

        <Popup
          isOpen={showPoliceRecordModal}
          close={() => setShowPoliceRecordModal(false)}
        >
          <div className="form-sub-container">
            <h2 className="text | medium-big bold">Antecedentes policiales</h2>
            <p className="text | light margin-top-10">
              ¿Tienes antecedentes policiales para adjuntar?
            </p>
            <p className="text | light margin-top-10">
              Si tu licencia fue emitida hace menos de 4 meses, también nos
              sirve un documento reciente de antecedentes, incluso si ya no está
              vigente.
            </p>
            <div className="row-wrapper | gap-10 margin-top-15">
              <button
                type="button"
                className="general-button gray"
                onClick={() => {
                  setPoliceRecordByChat(false);
                  setShowPoliceRecordModal(false);
                  toast.error(
                    "Necesitas antecedentes policiales para enviar tu solicitud.",
                  );
                }}
              >
                No tengo antecedentes
              </button>
              <button
                type="button"
                className="general-button green"
                onClick={() => {
                  setPoliceRecordByChat(true);
                  setShowPoliceRecordModal(false);
                  toast.info(
                    "Perfecto, puedes enviar la solicitud y luego enviar antecedentes por chat.",
                  );
                }}
              >
                Sí tengo, lo envío por chat
              </button>
            </div>
          </div>
        </Popup>
      </div>
    )
  );
};

export default NewDriverForm;

const DEFAULT_FORM: Form = {
  personalData: DEFAULT_PERSONAL_DATA,
  vehicles: [DEFAULT_VEHICLE],
  driverExperience: DEFAUL_TEXT_FIELD,
  selfie: DEFAUL_ATTACHMENT_FIELD,
  termsCheck: false,
};
