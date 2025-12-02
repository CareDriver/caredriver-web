"use client";

import { FormEvent, useCallback, useContext, useEffect, useState } from "react";
import {
  VehicleTransmission,
  VehicleType,
} from "@/interfaces/VehicleInterface";
import SelfieSection from "@/components/form/view/sections/SelfieSection";
import PrivacyTermsSection from "@/components/form/view/sections/PrivacyTermsSection";
import { uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { AuthContext } from "@/context/AuthContext";
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
import VehicleForm from "../../vehicle_forms/VehicleForm";
import { useRouter } from "next/navigation";
import { updateIdCard } from "@/components/app_modules/users/api/IdCardUpdated";
import {
  DEFAULT_PERSONAL_DATA,
  PersonalData,
} from "@/components/app_modules/server_users/models/PersonalDataFields";
import { Vehicle as VehicleFiels } from "@/components/app_modules/server_users/models/VehicleFields";
import { AttachmentField } from "@/components/form/models/FormFields";
import { DEFAUL_ATTACHMENT_FIELD } from "@/components/form/models/DefaultFields";
import { DEFAULT_LICENSE } from "@/components/app_modules/server_users/models/LicenseFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import PersonalDataForm from "../../../../../users/views/request_forms/to_manage_data/PersonalDataForm";
import { genDocId } from "@/utils/generators/IdGenerator";
import PageLoading from "@/components/loaders/PageLoading";
import { isValidPersonalData } from "@/components/app_modules/server_users/validators/for_data/PersonalDataValidator";
import { isValidVehicle } from "@/components/app_modules/server_users/validators/for_data/VehicleValidator";
import {
  isValidAttachmentField,
  isValidTextField,
} from "@/components/form/validators/FieldValidators";
import { routeToRequestToBeServerUserAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { isPhoneValid } from "@/components/app_modules/users/validators/for_data/CredentialsValidator";
import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";
import { VehicleToAddAsDriver } from "@/components/app_modules/server_users/models/DriverRegistration";
import { BloodTypes } from "@/interfaces/BloodTypes";
import { acceptTerms } from "@/utils/requesters/AcceptTerms";

interface Form {
  personalData: PersonalData;
  vehicle: VehicleFiels;
  selfie: AttachmentField;
  termsCheck: boolean;
}

interface Props {
  baseUser?: UserInterface;
  defaultEnterprise?: string;
  type: VehicleToAddAsDriver;
}

const NewVehicleForm: React.FC<Props> = ({
  baseUser,
  defaultEnterprise,
  type,
}) => {
  const { user, checkingUserAuth } = useContext(AuthContext);
  const router = useRouter();
  const [requesterUser, setRequesterUser] = useState<UserInterface | undefined>(
    baseUser
  );
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [form, setForm] = useState<Form>(DEFAULT_FORM(type));
  const [invalidFormMessage, setInvalidFormMessage] = useState<string>("");

  /* const uploadPDF = async (): Promise<ImgWithRef | null> => {
        if (pdf.value) {
            try {
                return await uploadFileBase64(DirectoryPath.Documents, pdf.value);
            } catch (e) {
                console.log(e);
            }
        }

        return null;
    }; */

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
            form.personalData.photo.value
          );
        } catch (e) {
          throw e;
        }
      }

      if (
        !checkingUserAuth &&
        form.personalData.addressPhoto.value &&
        isImageBase64(form.personalData.addressPhoto.value)
      ) {
        try {
          addressPhotoRef = await uploadFileBase64(
            DirectoryPath.ElectricityBills,
            form.personalData.addressPhoto.value
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
            form.vehicle.license.frontPhoto.value
          );
          const behindImgUrl = await uploadFileBase64(
            DirectoryPath.Licenses,
            form.vehicle.license.behindPhoto.value
          );
          if (form.vehicle.license.expirationDate.value) {
            vehiclesData.push({
              type: form.vehicle.type,
              license: {
                licenseNumber: form.vehicle.license.number.value,
                expiredDateLicense: Timestamp.fromDate(
                  form.vehicle.license.expirationDate.value
                ),
                frontImgUrl: frontImgUrl,
                backImgUrl: behindImgUrl,
                category: form.vehicle.license.category.value,
                requireGlasses: form.vehicle.license.requireGlasses.value,
                requireHeadphones:
                  form.vehicle.license.requiredHeadphones.value,
              },
            });
          }
        } catch (e) {
          throw e;
        }
      }

      if (form.selfie.value) {
        try {
          selfieRef = await uploadFileBase64(
            DirectoryPath.Selfies,
            form.selfie.value
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
    selfieRef: RefAttachment
  ) => {
    if (requesterUser) {
      var formId = genDocId();
      try {
        /* const pdfRef = await toast.promise(uploadPDF(), {
          pending: "Subiendo PDF de Antecedentes",
          success: "PDF de Antecedentes Subido",
          error: "Error al subir el PDF, inténtalo de nuevo",
        });

        if (!pdfRef) return; */

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
            requesterUser.bloodType ?? BloodTypes.OPositive,
            requesterUser.gender ?? Gender.Male,
            defaultEnterprise
          )
        );

        var newReqState =
          type === "car"
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
                form.personalData.alternativePhoneNumber.value
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
        profilePhotoRef: newProfilePhotoImgUrl,
        addressPhotoRef,
        selfieRef: realTimePhotoImgUrl,
      } = await toast.promise(uploadImages(), {
        pending: "Subiendo imágenes, por favor espera",
        success: "Imágenes subidas",
        error: "Error al subir imágenes, inténtalo de nuevo por favor",
      });

      /* const pdfRef = await toast.promise(uploadPDF(), {
                pending: "Subiendo PDF",
                success: "PDF subido",
                error: "Error al subir el PDF, inténtalo de nuevo",
            }); */
      await toast.promise(
        uploadForm(
          vehiclesData,
          newProfilePhotoImgUrl,
          addressPhotoRef,
          realTimePhotoImgUrl
        ),
        {
          pending: "Enviando el formulario, por favor espera",
          success: "Formulario enviado",
          error: "Error al enviar el formulario, inténtalo de nuevo por favor",
        }
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
      form.termsCheck
    );
  }

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

    if (!form.termsCheck) {
      return "Debes aceptar los términos y condiciones y la política de privacidad.";
    }

    return "";
  }

  useEffect(
    () =>
      setFormState((prev) => ({
        ...prev,
        isValid: isValidForm(form),
      })),
    [form]
  );

  const verifyRequestAvailability = useCallback(() => {
    if (requesterUser && requesterUser.serviceVehicles) {
      var isValid = requesterUser.serviceVehicles[type] !== undefined;
      if (isValid) {
        router.push(routeToRequestToBeServerUserAsUser("driver"));
        toast.error("Ya registraste este vehículo", {
          toastId: "vehicle-already-registered-message",
        });
      }
      isValid =
        type === "car"
          ? requesterUser.serviceRequests !== undefined &&
            requesterUser.serviceRequests.driveCar !== undefined &&
            requesterUser.serviceRequests.driveCar.state ===
              ServiceReqState.Reviewing
          : requesterUser.serviceRequests !== undefined &&
            requesterUser.serviceRequests.driveMotorcycle !== undefined &&
            requesterUser.serviceRequests.driveMotorcycle.state ===
              ServiceReqState.Reviewing;
      if (isValid) {
        router.push(routeToRequestToBeServerUserAsUser("driver"));
        toast.error("Tu petición está siendo revisada", {
          toastId: "vehicle-already-registered-like-req-message",
        });
      }
    }
  }, [router, requesterUser, type]);

  useEffect(() => {
    const loadRequesterUser = () => {
      if (!checkingUserAuth && user && !requesterUser) {
        setRequesterUser(user);
      }
      verifyRequestAvailability();
    };

    if (!checkingUserAuth) {
      loadRequesterUser();
    }
  }, [checkingUserAuth, requesterUser, user, verifyRequestAvailability]);

  if (checkingUserAuth) {
    return <PageLoading />;
  }

  return (
    requesterUser && (
      <div className="service-form-wrapper">
        <div>
          <h1 className="text | big bold">Agregar un nuevo Vehículo</h1>
          <p className="text | bold">
            Por favor llena este formulario con datos reales para que tu
            solicitud sea aprobada y puedas empezar a trabajar con este nuevo
            vehículo.
          </p>
        </div>
        <BaseForm
          content={{
            button: {
              content: {
                legend: "Enviar Solicitud",
              },
              behavior: {
                loading: formState.loading,
                // isValid: formState.isValid,
                isValid: true,
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
      </div>
    )
  );
};

export default NewVehicleForm;

const DEFAULT_FORM = (typeVehicle: VehicleToAddAsDriver): Form => {
  return {
    personalData: DEFAULT_PERSONAL_DATA,
    vehicle: {
      type: {
        type: typeVehicle === "car" ? VehicleType.CAR : VehicleType.MOTORCYCLE,
        mode: [VehicleTransmission.AUTOMATIC],
      },
      license: DEFAULT_LICENSE,
    },
    selfie: DEFAUL_ATTACHMENT_FIELD,
    termsCheck: false,
  };
};

