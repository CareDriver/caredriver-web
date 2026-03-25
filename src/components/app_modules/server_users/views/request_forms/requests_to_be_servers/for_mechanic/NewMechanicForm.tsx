"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import SelfieSection from "@/components/form/view/sections/SelfieSection";
import PrivacyTermsSection from "@/components/form/view/sections/PrivacyTermsSection";
import { uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { AuthContext } from "@/context/AuthContext";
import {
  mechanicReqBuilder,
  MECHANIC_SUB_SERVICES,
  MechanicSubService,
  MechanicToolEvidence,
  TechnicalTitleEvidence,
} from "@/interfaces/UserRequest";
import { Locations } from "@/interfaces/Locations";
import {
  EMPTY_REF_ATTACHMENT,
  RefAttachment,
} from "@/components/form/models/RefAttachment";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceReqState, Services } from "@/interfaces/Services";
import { isImageBase64 } from "@/validators/ImageValidator";
import { saveMechanicReq } from "@/components/app_modules/server_users/api/MechanicRequester";
import { getReqToBeUserServerById } from "@/components/app_modules/server_users/api/ServicesRequester";
import { updateIdCard } from "@/components/app_modules/users/api/IdCardUpdated";
import {
  DEFAULT_PERSONAL_DATA,
  PersonalData,
} from "@/components/app_modules/server_users/models/PersonalDataFields";
import {
  AttachmentField,
  DateField,
  TextField,
} from "@/components/form/models/FormFields";
import {
  DEFAUL_ATTACHMENT_FIELD,
  DEFAUL_DATE_FIELD,
  DEFAUL_TEXT_FIELD,
} from "@/components/form/models/DefaultFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import PersonalDataForm from "../../../../../users/views/request_forms/to_manage_data/PersonalDataForm";
import PageLoading from "@/components/loaders/PageLoading";
import ServiceStateRenderer from "../ServiceStateRenderer";
import { MechanicStatusHandler } from "@/components/app_modules/server_users/api/requests_status_handler/MechanicStatusHandler";
import { isValidPersonalData } from "@/components/app_modules/server_users/validators/for_data/PersonalDataValidator";
import {
  isValidAttachmentField,
  isValidDateField,
  isValidTextField,
} from "@/components/form/validators/FieldValidators";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { isPhoneValid } from "@/components/app_modules/users/validators/for_data/CredentialsValidator";
import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";
import { acceptTerms } from "@/utils/requesters/AcceptTerms";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import DateFieldRenderer from "@/components/form/view/fields/DateField";
import { Timestamp } from "firebase/firestore";
import { mechanicReqCollection } from "@/components/app_modules/server_users/api/MechanicRequester";

interface Form {
  personalData: PersonalData;
  mechanicTools: TextField;
  mechanicSubServices: MechanicSubService[];
  mechanicExperience: TextField;
  technicalTitleName: TextField;
  technicalTitleDate: DateField;
  technicalTitlePhoto: AttachmentField;
  selfie: AttachmentField;
  termsCheck: boolean;
}

interface ToolEvidenceForm {
  id: string;
  name: TextField;
  photo: AttachmentField;
}

interface Props {
  baseUser?: UserInterface;
  isUpdateRequest?: boolean;
}

const NewMechanicForm: React.FC<Props> = ({
  baseUser,
  isUpdateRequest = false,
}) => {
  const { user, checkingUserAuth } = useContext(AuthContext);
  const [requesterUser, setRequesterUser] = useState<UserInterface | undefined>(
    baseUser,
  );
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [toolEvidences, setToolEvidences] = useState<ToolEvidenceForm[]>([
    {
      id: nanoid(),
      name: DEFAUL_TEXT_FIELD,
      photo: DEFAUL_ATTACHMENT_FIELD,
    },
  ]);
  const [invalidFormMessage, setInvalidFormMessage] = useState<string>("");
  const [focusState, setFocusState] = useState({
    toolsSummary: false,
    technicalTitleName: false,
    experience: false,
  });
  const [focusedToolId, setFocusedToolId] = useState<string | null>(null);

  const mechanicSubServicesCatalog =
    Array.isArray(MECHANIC_SUB_SERVICES) && MECHANIC_SUB_SERVICES.length > 0
      ? MECHANIC_SUB_SERVICES
      : [
          {
            key: MechanicSubService.BatteryJumpStart,
            description: "Cuando la batería está descargada.",
          },
          {
            key: MechanicSubService.TireChange,
            description:
              "Cuando el conductor tiene la llanta de repuesto pero no sabe cambiarla o no tiene herramientas.",
          },
          {
            key: MechanicSubService.TireInflation,
            description: "Si la llanta está baja pero no pinchada.",
          },
          {
            key: MechanicSubService.FlatTireAssistance,
            description: "Parche rápido o ayuda para instalar la de repuesto.",
          },
          {
            key: MechanicSubService.FuelDelivery,
            description: "Cuando alguien se queda sin gasolina.",
          },
          {
            key: MechanicSubService.VehicleUnlock,
            description: "Cuando el conductor deja las llaves dentro del auto.",
          },
          {
            key: MechanicSubService.ObdScan,
            description: "Diagnóstico con escáner OBD.",
          },
          {
            key: MechanicSubService.HomeQuickCheck,
            description:
              "Revisión de aceite, refrigerante, líquido de frenos, batería, presión de llantas, luces y fugas visibles (10–15 min).",
          },
        ];

  const uploadImages = async () => {
    var newProfilePhotoImgUrl: string | RefAttachment = EMPTY_REF_ATTACHMENT;
    var addressPhotoImgUrl: string | RefAttachment = EMPTY_REF_ATTACHMENT;
    var realTimePhotoImgUrl: RefAttachment = EMPTY_REF_ATTACHMENT;
    var uploadedToolEvidences: MechanicToolEvidence[] = [];
    var technicalTitleEvidence: TechnicalTitleEvidence | undefined = undefined;

    if (requesterUser) {
      newProfilePhotoImgUrl = requesterUser.photoUrl;
      if (
        !isUpdateRequest &&
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

      addressPhotoImgUrl = requesterUser.addressPhoto;
      if (
        !isUpdateRequest &&
        !checkingUserAuth &&
        form.personalData.addressPhoto.value &&
        isImageBase64(form.personalData.addressPhoto.value)
      ) {
        try {
          addressPhotoImgUrl = await uploadFileBase64(
            DirectoryPath.ElectricityBills,
            form.personalData.addressPhoto.value,
          );
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

      for (const tool of toolEvidences) {
        if (tool.photo.value && isValidTextField(tool.name)) {
          try {
            const photo = await uploadFileBase64(
              DirectoryPath.Documents,
              tool.photo.value,
            );
            uploadedToolEvidences.push({
              name: tool.name.value.trim(),
              photo,
            });
          } catch (e) {
            throw e;
          }
        }
      }

      if (
        form.technicalTitlePhoto.value &&
        isValidTextField(form.technicalTitleName)
      ) {
        const photo = await uploadFileBase64(
          DirectoryPath.Documents,
          form.technicalTitlePhoto.value,
        );
        technicalTitleEvidence = {
          titleName: form.technicalTitleName.value.trim(),
          photo,
          issueDate: form.technicalTitleDate.value
            ? Timestamp.fromDate(form.technicalTitleDate.value)
            : undefined,
        };
      }
    }

    return {
      newProfilePhotoImgUrl,
      addressPhotoImgUrl,
      realTimePhotoImgUrl,
      uploadedToolEvidences,
      technicalTitleEvidence,
    };
  };

  function getInvalidFormMessage(): string {
    if (!isUpdateRequest && !isValidPersonalData(form.personalData)) {
      return "Por favor, completa tus datos personales correctamente.";
    }

    if (!isValidTextField(form.mechanicTools)) {
      return "Por favor, describe tus herramientas de trabajo.";
    }

    if (form.mechanicSubServices.length === 0) {
      return "Selecciona al menos un subservicio mecánico que puedes ofrecer.";
    }

    if (!areValidToolEvidences(toolEvidences)) {
      return "Debes registrar al menos una herramienta con su foto de evidencia.";
    }

    if (
      isValidAttachmentField(form.technicalTitlePhoto) &&
      !isValidTextField(form.technicalTitleName)
    ) {
      return "Si adjuntas foto de título técnico, debes ingresar el nombre del título.";
    }

    if (
      isValidTextField(form.technicalTitleName) &&
      !isValidAttachmentField(form.technicalTitlePhoto)
    ) {
      return "Si ingresas título técnico, debes adjuntar su foto.";
    }

    if (
      form.technicalTitleDate.value !== undefined &&
      !isValidDateField(form.technicalTitleDate)
    ) {
      return "La fecha del título técnico no es válida.";
    }

    if (!isUpdateRequest && !isValidAttachmentField(form.selfie)) {
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
    realTimePhotoImgUrl: RefAttachment,
    uploadedToolEvidences: MechanicToolEvidence[],
    technicalTitleEvidence?: TechnicalTitleEvidence,
  ) => {
    if (requesterUser) {
      var formId = nanoid(30);
      try {
        const isAlreadyMechanic =
          requesterUser.services.includes(Services.Mechanic) ||
          requesterUser.serviceRequests?.mechanic?.state ===
            ServiceReqState.Approved;

        await saveMechanicReq(
          formId,
          mechanicReqBuilder(
            formId,
            requesterUser.id === undefined ? "" : requesterUser.id,
            isUpdateRequest
              ? requesterUser.fullName
              : form.personalData.fullname.value,
            isUpdateRequest
              ? requesterUser.homeAddress
              : form.personalData.homeAddress.value,
            addressPhotoImgUrl,
            newProfilePhotoImgUrl,
            realTimePhotoImgUrl,
            requesterUser.services,
            requesterUser.location === undefined
              ? Locations.CochabambaBolivia
              : requesterUser.location,
            undefined, // enterprise assigned post-approval
            form.mechanicTools.value,
            form.mechanicSubServices,
            uploadedToolEvidences,
            technicalTitleEvidence,
            isValidTextField(form.mechanicExperience)
              ? form.mechanicExperience.value.trim()
              : undefined,
            isUpdateRequest,
          ),
        );

        if (requesterUser.id && !isAlreadyMechanic) {
          var toUpdate: Partial<UserInterface> = {
            serviceRequests: {
              ...requesterUser.serviceRequests,
              mechanic: {
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
    setInvalidFormMessage(getInvalidFormMessage());
    if (formState.loading) {
      return;
    }
    setFormState((prev) => ({
      ...prev,
      loading: true,
    }));

    if (!isValidForm(form, toolEvidences, isUpdateRequest) || !requesterUser) {
      toast.error("Formulario invalido");
      setFormState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    try {
      await acceptTerms(user?.id ?? "");

      if (!isUpdateRequest) {
        await updateIdCard(form.personalData.idCard, requesterUser);
      }

      const {
        newProfilePhotoImgUrl,
        addressPhotoImgUrl,
        realTimePhotoImgUrl,
        uploadedToolEvidences,
        technicalTitleEvidence,
      } = await toast.promise(uploadImages(), {
        pending: "Subiendo imágenes, por favor espera",
        success: "Imágenes subidas",
        error: "Error al subir imágenes, inténtalo de nuevo por favor",
      });
      await toast.promise(
        uploadForm(
          newProfilePhotoImgUrl,
          addressPhotoImgUrl,
          realTimePhotoImgUrl,
          uploadedToolEvidences,
          technicalTitleEvidence,
        ),
        {
          pending: "Enviando el formulario, por favor espera",
          success: "Formulario enviado",
          error: "Error al enviar el formulario, inténtalo de nuevo por favor",
        },
      );
      window.location.reload();
    } catch (e) {
      setFormState({
        loading: false,
        isValid: false,
      });
    }
  };

  useEffect(
    () =>
      setFormState((prev) => ({
        ...prev,
        isValid: isValidForm(form, toolEvidences, isUpdateRequest),
      })),
    [form, toolEvidences, isUpdateRequest],
  );

  useEffect(() => {
    if (!requesterUser && user) {
      setRequesterUser(user);
    }
  }, [checkingUserAuth, requesterUser, user]);

  useEffect(() => {
    const loadPreviousMechanicData = async () => {
      if (!isUpdateRequest || !requesterUser) {
        return;
      }

      const previousReqId = requesterUser.serviceRequests?.mechanic?.id;
      if (!previousReqId) {
        return;
      }

      try {
        const previousReq = await getReqToBeUserServerById(
          previousReqId,
          mechanicReqCollection,
        );

        if (!previousReq) {
          return;
        }

        setForm((prev) => ({
          ...prev,
          mechanicTools: {
            ...prev.mechanicTools,
            value: previousReq.mechanicTools ?? "",
          },
          mechanicSubServices:
            previousReq.mechanicSubServices &&
            previousReq.mechanicSubServices.length > 0
              ? previousReq.mechanicSubServices
              : [],
          mechanicExperience: {
            ...prev.mechanicExperience,
            value: previousReq.mechanicExperience ?? "",
          },
          technicalTitleName: {
            ...prev.technicalTitleName,
            value: previousReq.mechanicTechnicalTitle?.titleName ?? "",
          },
          technicalTitleDate: {
            ...prev.technicalTitleDate,
            value: previousReq.mechanicTechnicalTitle?.issueDate
              ? previousReq.mechanicTechnicalTitle.issueDate.toDate()
              : undefined,
          },
          technicalTitlePhoto: {
            ...prev.technicalTitlePhoto,
            value: previousReq.mechanicTechnicalTitle?.photo?.url,
          },
        }));

        if (
          previousReq.mechanicToolEvidences &&
          previousReq.mechanicToolEvidences.length > 0
        ) {
          setToolEvidences(
            previousReq.mechanicToolEvidences.map((tool) => ({
              id: nanoid(),
              name: {
                ...DEFAUL_TEXT_FIELD,
                value: tool.name,
              },
              photo: {
                ...DEFAUL_ATTACHMENT_FIELD,
                value: tool.photo.url,
              },
            })),
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadPreviousMechanicData();
  }, [isUpdateRequest, requesterUser]);

  if (checkingUserAuth) {
    return <PageLoading />;
  }

  return (
    requesterUser && (
      <div className="service-form-wrapper">
        <ServiceStateRenderer
          statusHandler={new MechanicStatusHandler(requesterUser)}
        />
        <BaseForm
          content={{
            button: {
              content: {
                legend: isUpdateRequest
                  ? "Enviar Actualización"
                  : "Enviar Solicitud",
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
          {!isUpdateRequest && (
            <PersonalDataForm
              baseUser={baseUser}
              personalData={form.personalData}
              setPersonalData={(d) =>
                setForm((prev) => ({ ...prev, personalData: d }))
              }
            />
          )}

          <div className="form-sub-container | margin-top-25">
            <h2 className="text | medium-big bold">Herramientas de trabajo</h2>
            <p className="text | light margin-top-10">
              Describe tus herramientas y agrega una foto por cada una.
            </p>

            <fieldset className="form-section">
              <input
                type="text"
                className="form-section-input"
                value={form.mechanicTools.value}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    mechanicTools: {
                      ...prev.mechanicTools,
                      value: e.target.value,
                      message: null,
                    },
                  }))
                }
                placeholder={
                  focusState.toolsSummary
                    ? "Ej: Escáner OBD, gato hidráulico, compresor, herramientas manuales"
                    : ""
                }
                onFocus={() =>
                  setFocusState((prev) => ({ ...prev, toolsSummary: true }))
                }
                onBlur={() =>
                  setFocusState((prev) => ({ ...prev, toolsSummary: false }))
                }
              />
              <legend className="form-section-legend">
                Resumen de herramientas
              </legend>
            </fieldset>

            <div className="form-sub-container | margin-top-15">
              <h3 className="text | bold">
                Subservicios mecánicos que ofreces
              </h3>
              <p className="text | light margin-top-10">
                Marca todos los subservicios que actualmente puedes atender
                basado en las herramientas y experiencia que tienes.
              </p>
              <div className="margin-top-10">
                {mechanicSubServicesCatalog.map((subService) => {
                  const isSelected = form.mechanicSubServices.includes(
                    subService.key,
                  );

                  return (
                    <label
                      key={subService.key}
                      className="row-wrapper | gap-10 margin-top-10 touchable"
                      style={{ alignItems: "flex-start" }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const nextValues = e.target.checked
                            ? [...form.mechanicSubServices, subService.key]
                            : form.mechanicSubServices.filter(
                                (value) => value !== subService.key,
                              );

                          setForm((prev) => ({
                            ...prev,
                            mechanicSubServices: nextValues,
                          }));
                        }}
                      />
                      <span className="text">
                        <b>{subService.key}</b>
                        <br />
                        <span className="light">{subService.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {toolEvidences.map((tool, index) => (
              <div
                key={tool.id}
                className="form-sub-container | margin-top-15 card padded"
              >
                <h3 className="text | bold">Herramienta {index + 1}</h3>
                <fieldset className="form-section margin-top-10">
                  <input
                    type="text"
                    className="form-section-input"
                    value={tool.name.value}
                    onChange={(e) =>
                      setToolEvidences((prev) =>
                        prev.map((item) =>
                          item.id === tool.id
                            ? {
                                ...item,
                                name: {
                                  ...item.name,
                                  value: e.target.value,
                                  message: null,
                                },
                              }
                            : item,
                        ),
                      )
                    }
                    placeholder={
                      focusedToolId === tool.id ? "Ej: Escáner OBD" : ""
                    }
                    onFocus={() => setFocusedToolId(tool.id)}
                    onBlur={() => setFocusedToolId(null)}
                  />
                  <legend className="form-section-legend">Nombre</legend>
                </fieldset>

                <ImageUploader
                  uploader={{
                    image: tool.photo,
                    setImage: (image) =>
                      setToolEvidences((prev) =>
                        prev.map((item) =>
                          item.id === tool.id
                            ? { ...item, photo: image }
                            : item,
                        ),
                      ),
                  }}
                  content={{
                    id: `mechanic-tool-photo-${tool.id}`,
                    legend: "Foto de la herramienta",
                    imageInCircle: false,
                  }}
                />

                {toolEvidences.length > 1 && (
                  <button
                    type="button"
                    className="small-general-button text | bold gray margin-top-10"
                    onClick={() =>
                      setToolEvidences((prev) =>
                        prev.filter((item) => item.id !== tool.id),
                      )
                    }
                  >
                    Quitar herramienta
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="small-general-button text | bold margin-top-15"
              onClick={() =>
                setToolEvidences((prev) => [
                  ...prev,
                  {
                    id: nanoid(),
                    name: DEFAUL_TEXT_FIELD,
                    photo: DEFAUL_ATTACHMENT_FIELD,
                  },
                ])
              }
            >
              Agregar otra herramienta
            </button>
          </div>

          <div className="form-sub-container | margin-top-25">
            <h2 className="text | medium-big bold">
              Título técnico (Opcional)
            </h2>
            <fieldset className="form-section margin-top-10">
              <input
                type="text"
                className="form-section-input"
                value={form.technicalTitleName.value}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    technicalTitleName: {
                      ...prev.technicalTitleName,
                      value: e.target.value,
                      message: null,
                    },
                  }))
                }
                placeholder={
                  focusState.technicalTitleName
                    ? "Ej: Técnico Superior en Mecánica Automotriz"
                    : ""
                }
                onFocus={() =>
                  setFocusState((prev) => ({
                    ...prev,
                    technicalTitleName: true,
                  }))
                }
                onBlur={() =>
                  setFocusState((prev) => ({
                    ...prev,
                    technicalTitleName: false,
                  }))
                }
              />
              <legend className="form-section-legend">Nombre del título</legend>
            </fieldset>

            <DateFieldRenderer
              field={{
                values: form.technicalTitleDate,
                setter: (value) =>
                  setForm((prev) => ({ ...prev, technicalTitleDate: value })),
                validator: () => ({ isValid: true, message: "" }),
              }}
              legend="Fecha de emisión del título (Opcional)"
            />

            <ImageUploader
              uploader={{
                image: form.technicalTitlePhoto,
                setImage: (image) =>
                  setForm((prev) => ({ ...prev, technicalTitlePhoto: image })),
              }}
              content={{
                id: "mechanic-technical-title-photo",
                legend: "Foto del título técnico",
                imageInCircle: false,
              }}
            />
          </div>

          <div className="form-sub-container | margin-top-25">
            <h2 className="text | medium-big bold">Experiencia (Opcional)</h2>
            <fieldset className="form-section margin-top-10">
              <textarea
                className="form-section-input"
                value={form.mechanicExperience.value}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    mechanicExperience: {
                      ...prev.mechanicExperience,
                      value: e.target.value,
                      message: null,
                    },
                  }))
                }
                placeholder={
                  focusState.experience
                    ? "Ejemplo: Tengo 6 años de experiencia en auxilio mecánico, diagnóstico básico y cambio de llantas en ruta."
                    : ""
                }
                rows={4}
                onFocus={() =>
                  setFocusState((prev) => ({ ...prev, experience: true }))
                }
                onBlur={() =>
                  setFocusState((prev) => ({ ...prev, experience: false }))
                }
              />
              <legend className="form-section-legend">
                Cuéntanos tu experiencia
              </legend>
            </fieldset>
          </div>

          {!isUpdateRequest && (
            <SelfieSection
              image={form.selfie}
              setImage={(d) => setForm((prev) => ({ ...prev, selfie: d }))}
            />
          )}

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

export default NewMechanicForm;

const DEFAULT_FORM: Form = {
  personalData: DEFAULT_PERSONAL_DATA,
  mechanicTools: DEFAUL_TEXT_FIELD,
  mechanicSubServices: [],
  mechanicExperience: DEFAUL_TEXT_FIELD,
  technicalTitleName: DEFAUL_TEXT_FIELD,
  technicalTitleDate: DEFAUL_DATE_FIELD,
  technicalTitlePhoto: DEFAUL_ATTACHMENT_FIELD,
  selfie: DEFAUL_ATTACHMENT_FIELD,
  termsCheck: false,
};

function areValidToolEvidences(tools: ToolEvidenceForm[]): boolean {
  return (
    tools.length > 0 &&
    tools.every(
      (tool) =>
        isValidTextField(tool.name) && isValidAttachmentField(tool.photo),
    )
  );
}

function isValidForm(
  form: Form,
  tools: ToolEvidenceForm[],
  isUpdateRequest: boolean,
): boolean {
  const baseValid =
    isValidTextField(form.mechanicTools) &&
    form.mechanicSubServices.length > 0 &&
    areValidToolEvidences(tools) &&
    form.termsCheck;

  if (!baseValid) {
    return false;
  }

  const titleDataIsValid =
    (isValidTextField(form.technicalTitleName) &&
      isValidAttachmentField(form.technicalTitlePhoto)) ||
    (!isValidTextField(form.technicalTitleName) &&
      !isValidAttachmentField(form.technicalTitlePhoto));

  if (!titleDataIsValid) {
    return false;
  }

  if (
    form.technicalTitleDate.value &&
    !isValidDateField(form.technicalTitleDate)
  ) {
    return false;
  }

  if (isUpdateRequest) {
    return true;
  }

  return (
    isValidPersonalData(form.personalData) &&
    isValidAttachmentField(form.selfie) &&
    form.termsCheck
  );
}
