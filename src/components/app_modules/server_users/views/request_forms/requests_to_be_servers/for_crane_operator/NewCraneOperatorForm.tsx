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
import Building from "@/icons/Building";
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
  EntityField,
} from "@/components/form/models/FormFields";
import {
  DEFAUL_ATTACHMENT_FIELD,
  DEFAUL_ENTITY_FIELD,
} from "@/components/form/models/DefaultFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import VehicleForm from "../../vehicle_forms/VehicleForm";
import PersonalDataForm from "../../../../../users/views/request_forms/to_manage_data/PersonalDataForm";
import ServiceStateRenderer from "../ServiceStateRenderer";
import { CraneOperatorStatusHandler } from "@/components/app_modules/server_users/api/requests_status_handler/CraneOperatorStatusHandler";
import PageLoading from "@/components/loaders/PageLoading";
import {
  isValidAttachmentField,
  isValidEntityDataField,
  isValidTextField,
} from "@/components/form/validators/FieldValidators";
import { isValidPersonalData } from "@/components/app_modules/server_users/validators/for_data/PersonalDataValidator";
import { isValidVehicle } from "@/components/app_modules/server_users/validators/for_data/VehicleValidator";
import EnterpriseSelectorById from "@/components/app_modules/enterprises/views/selectors/EnterpriseSelectorById";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { isPhoneValid } from "@/components/app_modules/users/validators/for_data/CredentialsValidator";
import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";
import Link from "next/link";
import { routeToAllEnterprisesAsUser } from "@/utils/route_builders/as_user/RouteBuilderForEnterpriseAsUser";

interface Form {
  personalData: PersonalData;
  vehicle: VehicleFiels;
  enterprise: EntityField;
  selfie: AttachmentField;
  termsCheck: boolean;
}

interface Props {
  baseUser?: UserInterface;
  baseEnterprise?: string;
}

const NewCraneOperatorForm: React.FC<Props> = ({
  baseUser,
  baseEnterprise,
}) => {
  const { user, checkingUserAuth } = useContext(AuthContext);
  const [requesterUser, setRequesterUser] = useState<UserInterface | undefined>(
    baseUser,
  );
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [form, setForm] = useState<Form>(DEFAULT_FORM(baseEnterprise));

  const uploadImages = async () => {
    let vehiclesData: Vehicle = emptyVehicleCar;
    var newProfilePhotoImgUrl: string | RefAttachment = EMPTY_REF_ATTACHMENT;
    var realTimePhotoImgUrl: RefAttachment = EMPTY_REF_ATTACHMENT;

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
    }

    return {
      vehiclesData,
      newProfilePhotoImgUrl,
      realTimePhotoImgUrl,
    };
  };

  const uploadForm = async (
    vehicleData: Vehicle,
    newProfilePhotoImgUrl: string | RefAttachment,
    realTimePhotoImgUrl: RefAttachment,
  ) => {
    if (requesterUser && form.enterprise.value) {
      var formId = nanoid(30);
      try {
        await saveTowReq(
          formId,
          towReqBuilder(
            formId,
            requesterUser.id === undefined ? "" : requesterUser.id,
            form.personalData.fullname.value,
            newProfilePhotoImgUrl,
            form.enterprise.value,
            realTimePhotoImgUrl,
            requesterUser.services,
            requesterUser.location === undefined
              ? Locations.CochabambaBolivia
              : requesterUser.location,
            [vehicleData],
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formState.loading) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      loading: true,
    }));

    if (!form.enterprise.value) {
      setForm((prev) => ({
        ...prev,
        enterprise: {
          ...prev.enterprise,
          message: "Por favor selecciona la Empresa de Grúa en la que trabajas",
        },
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
      await updateIdCard(form.personalData.idCard, requesterUser);
      const { vehiclesData, newProfilePhotoImgUrl, realTimePhotoImgUrl } =
        await toast.promise(uploadImages(), {
          pending: "Subiendo imágenes, por favor espera",
          success: "Imágenes subidas",
          error: "Error al subir imágenes, inténtalo de nuevo por favor",
        });
      await toast.promise(
        uploadForm(vehiclesData, newProfilePhotoImgUrl, realTimePhotoImgUrl),
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
                isValid: formState.isValid,
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
          />

          {!baseEnterprise && (
            <div className="margin-top-25">
              <h2 className="text icon-wrapper | medium-big bold margin-bottom-15">
                <Building />
                Empresa de Grúa
              </h2>

              <Link
                href={routeToAllEnterprisesAsUser("tow")}
                className="small-general-button text | bold margin-bottom-15"
              >
                Quiero registrar mi empresa operadora de gruas
              </Link>
              <EnterpriseSelectorById
                typeOfEnterprise="tow"
                field={{
                  values: form.enterprise,
                  setter: (d) =>
                    setForm((prev) => ({
                      ...prev,
                      enterprise: d,
                    })),
                }}
              />
              {form.enterprise.message && (
                <div className="margin-top-15">
                  <small className="form-section-message">
                    {form.enterprise.message}
                  </small>
                </div>
              )}
            </div>
          )}

          <SelfieSection
            image={form.selfie}
            setImage={(d) => setForm((prev) => ({ ...prev, selfie: d }))}
          />

          <PrivacyTermsSection
            isCheck={form.termsCheck}
            setCheck={(d) => setForm((prev) => ({ ...prev, termsCheck: d }))}
          />
        </BaseForm>
      </div>
    )
  );
};

export default NewCraneOperatorForm;

const DEFAULT_FORM = (baseEnterprise: string | undefined): Form => {
  return {
    personalData: DEFAULT_PERSONAL_DATA,
    vehicle: DEFAULT_VEHICLE,
    enterprise: { ...DEFAUL_ENTITY_FIELD, value: baseEnterprise },
    selfie: DEFAUL_ATTACHMENT_FIELD,
    termsCheck: false,
  };
};

function isValidForm(form: Form): boolean {
  return (
    isValidPersonalData(form.personalData) &&
    isValidVehicle(form.vehicle) &&
    isValidAttachmentField(form.selfie) &&
    isValidEntityDataField(form.enterprise) &&
    form.termsCheck
  );
}
