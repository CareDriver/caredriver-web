"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import SelfieSection from "@/components/form/view/sections/SelfieSection";
import PrivacyTermsSection from "@/components/form/view/sections/PrivacyTermsSection";
import { uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { AuthContext } from "@/context/AuthContext";
import { laundryReqBuilder } from "@/interfaces/UserRequest";
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
import { updateIdCard } from "@/components/app_modules/users/api/IdCardUpdated";
import { saveLaundryReq } from "@/components/app_modules/server_users/api/LaundryRequester";
import Soap from "@/icons/Soap";
import {
  DEFAULT_PERSONAL_DATA,
  PersonalData,
} from "@/components/app_modules/server_users/models/PersonalDataFields";
import {
  AttachmentField,
  EntityField,
} from "@/components/form/models/FormFields";
import {
  DEFAUL_ATTACHMENT_FIELD,
  DEFAUL_ENTITY_FIELD,
} from "@/components/form/models/DefaultFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import PersonalDataForm from "../../../../../users/views/request_forms/to_manage_data/PersonalDataForm";
import PageLoading from "@/components/loaders/PageLoading";
import ServiceStateRenderer from "../ServiceStateRenderer";
import { LaundererStatusHandler } from "@/components/app_modules/server_users/api/requests_status_handler/LaundererStatusHandler";
import { isValidPersonalData } from "@/components/app_modules/server_users/validators/for_data/PersonalDataValidator";
import {
  isValidAttachmentField,
  isValidEntityField,
  isValidTextField,
} from "@/components/form/validators/FieldValidators";
import EnterpriseSelectorById from "@/components/app_modules/enterprises/views/selectors/EnterpriseSelectorById";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { isPhoneValid } from "@/components/app_modules/users/validators/for_data/CredentialsValidator";
import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";
import Link from "next/link";
import { routeToAllEnterprisesAsUser } from "@/utils/route_builders/as_user/RouteBuilderForEnterpriseAsUser";
import { acceptTerms } from "@/utils/requesters/AcceptTerms";

interface Form {
  personalData: PersonalData;
  enterprise: EntityField;
  selfie: AttachmentField;
  termsCheck: boolean;
}

interface Props {
  baseUser?: UserInterface;
  baseEnterprise?: string;
}

const NewLaundererForm: React.FC<Props> = ({ baseUser, baseEnterprise }) => {
  const { user, checkingUserAuth } = useContext(AuthContext);
  const [requesterUser, setRequesterUser] = useState<UserInterface | undefined>(
    baseUser
  );
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [form, setForm] = useState<Form>(DEFAULT_FORM(baseEnterprise));
  const [invalidFormMessage, setInvalidFormMessage] = useState<string>("");

  const uploadImages = async () => {
    var newProfilePhotoImgUrl: string | RefAttachment = EMPTY_REF_ATTACHMENT;
    var addressPhotoImgUrl: string | RefAttachment = EMPTY_REF_ATTACHMENT;
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
            form.personalData.photo.value
          );
        } catch (e) {
          throw e;
        }
      }

      addressPhotoImgUrl = requesterUser.addressPhoto;
      if (
        !checkingUserAuth &&
        form.personalData.addressPhoto.value &&
        isImageBase64(form.personalData.addressPhoto.value)
      ) {
        try {
          addressPhotoImgUrl = await uploadFileBase64(
            DirectoryPath.ElectricityBills,
            form.personalData.addressPhoto.value
          );
        } catch (e) {
          throw e;
        }
      }

      if (form.selfie.value) {
        try {
          realTimePhotoImgUrl = await uploadFileBase64(
            DirectoryPath.Selfies,
            form.selfie.value
          );
        } catch (e) {
          throw e;
        }
      }
    }

    return {
      newProfilePhotoImgUrl,
      addressPhotoImgUrl,
      realTimePhotoImgUrl,
    };
  };

  function getInvalidFormMessage(): string {
    if (!isValidPersonalData(form.personalData)) {
      return "Por favor, completa tus datos personales correctamente.";
    }

    if (!isValidAttachmentField(form.selfie)) {
      return "Por favor, tomate una selfie para verificar tu identidad.";
    }

    if (!form.termsCheck) {
      return "Debes aceptar los términos y condiciones y la política de privacidad.";
    }

    return "";
  }

  const uploadForm = async (
    newProfilePhotoImgUrl: string | RefAttachment,
    addressPhotoImgUrl: string | RefAttachment,
    realTimePhotoImgUrl: RefAttachment
  ) => {
    if (requesterUser && form.enterprise.value) {
      var formId = nanoid(30);
      try {
        await saveLaundryReq(
          formId,
          laundryReqBuilder(
            formId,
            requesterUser.id === undefined ? "" : requesterUser.id,
            form.personalData.fullname.value,
            form.personalData.homeAddress.value,
            addressPhotoImgUrl,
            newProfilePhotoImgUrl,
            realTimePhotoImgUrl,
            requesterUser.services,
            requesterUser.location === undefined
              ? Locations.CochabambaBolivia
              : requesterUser.location,
            form.enterprise.value
          )
        );

        if (requesterUser.id) {
          var toUpdate: Partial<UserInterface> = {
            serviceRequests: {
              ...requesterUser.serviceRequests,
              laundry: {
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
      const { newProfilePhotoImgUrl, addressPhotoImgUrl, realTimePhotoImgUrl } =
        await toast.promise(uploadImages(), {
          pending: "Subiendo imágenes, por favor espera",
          success: "Imágenes subidas",
          error: "Error al subir imágenes, inténtalo de nuevo por favor",
        });
      await toast.promise(
        uploadForm(
          newProfilePhotoImgUrl,
          addressPhotoImgUrl,
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

  useEffect(
    () =>
      setFormState((prev) => ({
        ...prev,
        isValid: isValidForm(form),
      })),
    [form]
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
          statusHandler={new LaundererStatusHandler(requesterUser)}
        />

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

          {!baseEnterprise && (
            <div className="form-sub-container | margin-top-25">
              <h2 className="text icon-wrapper | medium-big bold">
                <Soap />
                Lavadero
              </h2>

              <Link
                href={routeToAllEnterprisesAsUser("laundry")}
                className="small-general-button text | bold margin-bottom-15"
              >
                Quiero registrar mi lavadero
              </Link>

              <EnterpriseSelectorById
                typeOfEnterprise="laundry"
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
        {invalidFormMessage && (
          <p style={{ color: "red", fontSize: 16, marginTop: 16 }}>
            * {invalidFormMessage}
          </p>
        )}
      </div>
    )
  );
};

export default NewLaundererForm;

const DEFAULT_FORM = (baseEnterprise: string | undefined): Form => {
  return {
    personalData: DEFAULT_PERSONAL_DATA,
    enterprise: { ...DEFAUL_ENTITY_FIELD, value: baseEnterprise },
    selfie: DEFAUL_ATTACHMENT_FIELD,
    termsCheck: false,
  };
};

function isValidForm(form: Form): boolean {
  return (
    isValidPersonalData(form.personalData) &&
    isValidEntityField(form.enterprise) &&
    isValidAttachmentField(form.selfie) &&
    form.termsCheck
  );
}
