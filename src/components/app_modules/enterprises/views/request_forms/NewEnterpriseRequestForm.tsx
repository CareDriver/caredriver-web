"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { ServiceType } from "@/interfaces/Services";
import {
  buildEnterpriseRequest,
  CarWashServiceMode,
  CarWashServiceModeRender,
  collaboratorRequiresReview,
  EnterpriseMember,
} from "@/interfaces/Enterprise";
import {
  MechanicSubService,
  MECHANIC_SUB_SERVICES,
  MechanicToolEvidence,
} from "@/interfaces/UserRequest";
import {
  EMPTY_REF_ATTACHMENT,
  RefAttachment,
} from "@/components/form/models/RefAttachment";
import { uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { Timestamp } from "firebase/firestore";
import { isImageBase64 } from "@/validators/ImageValidator";
import { saveEnterpriseRequest } from "@/components/app_modules/enterprises/api/EnterpriseRequestRequester";
import { getUserNoDeletedByEmail } from "@/components/app_modules/users/api/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import PageLoading from "@/components/loaders/PageLoading";
import BaseForm from "@/components/form/view/forms/BaseForm";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import PrivacyTermsSection from "@/components/form/view/sections/PrivacyTermsSection";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import {
  AttachmentField,
  CheckField,
  DateField as DateFieldType,
  EntityDataFieldMandatory,
  TextField,
} from "@/components/form/models/FormFields";
import {
  DEFAUL_ATTACHMENT_FIELD,
  DEFAUL_DATE_FIELD,
  DEFAUL_TEXT_FIELD,
  DEFAULT_CHECK_FIELD,
  createEntityDataFieldMandatory,
} from "@/components/form/models/DefaultFields";
import {
  isValidAttachmentField,
  isValidTextField,
} from "@/components/form/validators/FieldValidators";
import { generateKeywords } from "@/utils/helpers/StringHelper";
import { Locations } from "@/interfaces/Locations";
import SelfieSection from "@/components/form/view/sections/SelfieSection";
import DateField from "@/components/form/view/fields/DateField";
import LicenseCategoryField from "@/components/form/view/fields/LicenseCategoryField";
import LicenceNumberField from "@/components/form/view/fields/LicenceNumberField";
import {
  isValidLicenseNumber,
  isValidLicenseDate,
} from "@/components/app_modules/server_users/validators/for_data/DriveValidator";
import { LicenseCategories } from "@/interfaces/LicenseCategories";
import {
  VehicleType,
  VehicleTransmission,
} from "@/interfaces/VehicleInterface";
import TransmissionField from "@/components/form/view/fields/TransmissionField";
import CCheckField from "@/components/form/view/fields/CheckField";
import ChevronDown from "@/icons/ChevronDown";
import Car from "@/icons/Car";
import AddressCar from "@/icons/AddressCar";
import {
  VEHICLE_CATEGORY_TO_SPANISH,
  VEHICLE_CATEGORIES,
} from "@/components/app_modules/server_users/models/VehicleFields";

// ─── Self admin personal data (the user registering the enterprise) ─────────
interface SelfAdminData {
  identityCardFront: AttachmentField;
  identityCardBack: AttachmentField;
  isAlsoCollaborator: boolean;
  experience: TextField;
  // Vehicle fields (driver enterprises only)
  vehicleType: VehicleType;
  vehicleTransmissions: VehicleTransmission[];
  // License fields (full, matching existing forms)
  licenseFront: AttachmentField;
  licenseBack: AttachmentField;
  licenseNumber: TextField;
  licenseExpirationDate: DateFieldType;
  licenseCategory: EntityDataFieldMandatory<LicenseCategories>;
  licenseRequireGlasses: CheckField;
  licenseRequireHeadphones: CheckField;
  // Police records optional
  policeRecord: AttachmentField;
}

// ─── Additional member to register ──────────────────────────────────────────
interface MemberFormData {
  id: string;
  role: "admin" | "collaborator";
  isAlsoCollaborator: boolean; // Only for admins
  // Email-first lookup
  userEmail: TextField;
  fullName: TextField;
  profilePhoto: AttachmentField;
  identityCardFront: AttachmentField;
  identityCardBack: AttachmentField;
  experience: TextField;
  // Vehicle fields (driver enterprises only)
  vehicleType: VehicleType;
  vehicleTransmissions: VehicleTransmission[];
  // License fields (full)
  licenseFront: AttachmentField;
  licenseBack: AttachmentField;
  licenseNumber: TextField;
  licenseExpirationDate: DateFieldType;
  licenseCategory: EntityDataFieldMandatory<LicenseCategories>;
  licenseRequireGlasses: CheckField;
  licenseRequireHeadphones: CheckField;
  policeRecord: AttachmentField;
  // For mechanic
  technicalTitlePhoto: AttachmentField;
  technicalTitleName: TextField;
  // Vehicle photos for tow
  vehiclePhoto: AttachmentField;
}

// ─── Tool evidence for mechanic enterprises ─────────────────────────────────
interface ToolForm {
  id: string;
  name: TextField;
  photo: AttachmentField;
}

// ─── Main form state ────────────────────────────────────────────────────────
interface EnterpriseFormState {
  name: TextField;
  logo: AttachmentField;
  description: TextField;
  latitude: TextField;
  longitude: TextField;
  // Mechanic
  mechanicTools: TextField;
  mechanicSubServices: MechanicSubService[];
  // Car wash
  carWashServiceMode: CarWashServiceMode | null;
  // Tow fleet photos
  towVehiclePhotos: AttachmentField[];
  // Self admin data
  selfAdmin: SelfAdminData;
  selfAdminSelfie: AttachmentField;
  // Additional members
  members: MemberFormData[];
  // Terms
  termsCheck: boolean;
}

interface Props {
  type: ServiceType;
}

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  driver: "Empresa de Conductores",
  mechanical: "Taller Mecánico / Empresa Mecánica",
  tow: "Empresa de Remolque",
  laundry: "Lavadero",
};

const NewEnterpriseRequestForm: React.FC<Props> = ({ type }) => {
  const { user, checkingUserAuth } = useContext(AuthContext);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [form, setForm] = useState<EnterpriseFormState>(
    createDefaultForm(type),
  );
  const [toolEvidences, setToolEvidences] = useState<ToolForm[]>([
    { id: nanoid(), name: DEFAUL_TEXT_FIELD, photo: DEFAUL_ATTACHMENT_FIELD },
  ]);
  const [invalidFormMessage, setInvalidFormMessage] = useState("");
  const [focusState, setFocusState] = useState<Record<string, boolean>>({});
  // Email-lookup state for members
  const [memberLookedUpUsers, setMemberLookedUpUsers] = useState<
    Record<string, UserInterface | null>
  >({});
  const [memberSearchLoading, setMemberSearchLoading] = useState<
    Record<string, boolean>
  >({});

  const isFocused = (key: string) => focusState[key] ?? false;
  const setFocus = (key: string, val: boolean) =>
    setFocusState((prev) => ({ ...prev, [key]: val }));

  const needsLicense =
    type === "driver" ||
    type === "tow" ||
    (type === "laundry" &&
      form.carWashServiceMode !== CarWashServiceMode.MobileOnly &&
      form.carWashServiceMode !== null);

  // ─── Email lookup for members ─────────────────────────────────────────
  const lookupMemberUser = async (memberId: string, email: string) => {
    const lower = email.trim().toLowerCase();
    if (!lower) return;
    setMemberSearchLoading((prev) => ({ ...prev, [memberId]: true }));
    try {
      const found = await getUserNoDeletedByEmail(lower);
      if (found) {
        setMemberLookedUpUsers((prev) => ({ ...prev, [memberId]: found }));
        updateMember(memberId, {
          fullName: { ...DEFAUL_TEXT_FIELD, value: found.fullName },
          profilePhoto: found.photoUrl?.url
            ? { value: found.photoUrl.url, message: null }
            : DEFAUL_ATTACHMENT_FIELD,
          identityCardFront: found.identityCard?.frontCard?.url
            ? { value: found.identityCard.frontCard.url, message: null }
            : DEFAUL_ATTACHMENT_FIELD,
          identityCardBack: found.identityCard?.backCard?.url
            ? { value: found.identityCard.backCard.url, message: null }
            : DEFAUL_ATTACHMENT_FIELD,
        });
      } else {
        setMemberLookedUpUsers((prev) => ({ ...prev, [memberId]: null }));
        toast.warning(
          "No se encontró ningún usuario con ese correo electrónico.",
        );
      }
    } catch {
      toast.error("Error al buscar el usuario.");
    } finally {
      setMemberSearchLoading((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  // ─── Validation ─────────────────────────────────────────────────────────
  function getInvalidFormMessage(): string {
    if (!isValidTextField(form.name)) return "Ingresa el nombre de tu empresa.";
    if (!isValidAttachmentField(form.logo))
      return "Sube el logo o foto de tu empresa.";
    if (type === "mechanical" && form.mechanicSubServices.length === 0)
      return "Selecciona al menos un subservicio mecánico.";
    if (type === "mechanical" && !isValidTextField(form.mechanicTools))
      return "Describe las herramientas de tu empresa.";
    if (
      type === "mechanical" &&
      !toolEvidences.every(
        (t) => isValidTextField(t.name) && isValidAttachmentField(t.photo),
      )
    )
      return "Cada herramienta requiere nombre y foto.";
    if (type === "laundry" && !form.carWashServiceMode)
      return "Selecciona la modalidad de servicio de tu lavadero.";
    // Self admin data
    if (!isValidAttachmentField(form.selfAdmin.identityCardFront))
      return "Sube la foto frontal de tu carnet de identidad.";
    if (!isValidAttachmentField(form.selfAdmin.identityCardBack))
      return "Sube la foto trasera de tu carnet de identidad.";
    if (!isValidAttachmentField(form.selfAdminSelfie))
      return "Tómate una selfie para verificar tu identidad.";
    if (needsLicense && form.selfAdmin.isAlsoCollaborator) {
      if (!isValidAttachmentField(form.selfAdmin.licenseFront))
        return "Sube la foto frontal de tu licencia de conducir.";
      if (!isValidAttachmentField(form.selfAdmin.licenseBack))
        return "Sube la foto trasera de tu licencia de conducir.";
    }
    // Additional members
    for (let i = 0; i < form.members.length; i++) {
      const m = form.members[i];
      const label =
        m.role === "admin" ? `Administrador ${i + 1}` : `Colaborador ${i + 1}`;
      if (!isValidTextField(m.userEmail))
        return `Ingresa el email del ${label}.`;
      if (memberLookedUpUsers[m.id] === undefined)
        return `Busca al usuario por email del ${label} antes de continuar.`;
      if (memberLookedUpUsers[m.id] === null)
        return `No se encontró ningún usuario con el email del ${label}.`;
    }
    if (!form.termsCheck) return "Debes aceptar los términos y condiciones.";
    return "";
  }

  function isValidForm(): boolean {
    return getInvalidFormMessage() === "";
  }

  // ─── Upload logic ───────────────────────────────────────────────────────
  const uploadImage = async (
    field: AttachmentField,
    dir: DirectoryPath,
  ): Promise<RefAttachment> => {
    if (field.value && isImageBase64(field.value)) {
      return await uploadFileBase64(dir, field.value);
    }
    return EMPTY_REF_ATTACHMENT;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const msg = getInvalidFormMessage();
    setInvalidFormMessage(msg);
    if (formState.loading || msg) {
      if (msg) toast.error(msg);
      return;
    }
    setFormState({ loading: true, isValid: true });

    if (!user || !user.id || !user.fakeId) {
      toast.error("Debes iniciar sesión para registrar una empresa.");
      setFormState({ loading: false, isValid: false });
      return;
    }

    try {
      // Upload logo
      const logoRef = await toast.promise(
        uploadImage(form.logo, DirectoryPath.Enterprises),
        {
          pending: "Subiendo logo...",
          success: "Logo subido",
          error: "Error al subir el logo",
        },
      );

      // Upload self admin docs
      const selfIdFront = await uploadImage(
        form.selfAdmin.identityCardFront,
        DirectoryPath.IdCards,
      );
      const selfIdBack = await uploadImage(
        form.selfAdmin.identityCardBack,
        DirectoryPath.IdCards,
      );
      const selfSelfie = await uploadImage(
        form.selfAdminSelfie,
        DirectoryPath.Selfies,
      );

      let selfLicenseFront: RefAttachment | undefined;
      let selfLicenseBack: RefAttachment | undefined;
      let selfPoliceRecord: RefAttachment | undefined;

      if (needsLicense && form.selfAdmin.isAlsoCollaborator) {
        selfLicenseFront = await uploadImage(
          form.selfAdmin.licenseFront,
          DirectoryPath.Licenses,
        );
        selfLicenseBack = await uploadImage(
          form.selfAdmin.licenseBack,
          DirectoryPath.Licenses,
        );
        if (form.selfAdmin.policeRecord.value) {
          selfPoliceRecord = await uploadImage(
            form.selfAdmin.policeRecord,
            DirectoryPath.Documents,
          );
        }
      }

      // Upload tool evidences for mechanic
      let uploadedToolEvidences: MechanicToolEvidence[] | undefined;
      if (type === "mechanical") {
        uploadedToolEvidences = [];
        for (const tool of toolEvidences) {
          if (
            isValidTextField(tool.name) &&
            isValidAttachmentField(tool.photo)
          ) {
            const photo = await uploadImage(
              tool.photo,
              DirectoryPath.EnterpriseTools,
            );
            uploadedToolEvidences.push({ name: tool.name.value.trim(), photo });
          }
        }
      }

      // Upload tow vehicle photos
      let towVehiclePhotosUploaded: RefAttachment[] | undefined;
      if (type === "tow" && form.towVehiclePhotos.length > 0) {
        towVehiclePhotosUploaded = [];
        for (const vp of form.towVehiclePhotos) {
          if (vp.value) {
            const ref = await uploadImage(vp, DirectoryPath.EnterpriseVehicles);
            towVehiclePhotosUploaded.push(ref);
          }
        }
      }

      // Upload additional member docs
      const uploadedMembers: EnterpriseMember[] = [];

      // Build self admin member
      const selfMember: EnterpriseMember = {
        userId: user.id,
        fakeUserId: user.fakeId,
        role: "admin",
        isAlsoCollaborator: form.selfAdmin.isAlsoCollaborator,
        accepted: true, // self-registrant is auto-accepted
        requiresAdminReview: false,
        fullName: user.fullName,
        profilePhoto: selfSelfie,
        identityCardFront: selfIdFront,
        identityCardBack: selfIdBack,
        experience: isValidTextField(form.selfAdmin.experience)
          ? form.selfAdmin.experience.value.trim()
          : undefined,
        vehicleType:
          type === "driver" && needsLicense && form.selfAdmin.isAlsoCollaborator
            ? form.selfAdmin.vehicleType
            : undefined,
        vehicleTransmissions:
          type === "driver" && needsLicense && form.selfAdmin.isAlsoCollaborator
            ? form.selfAdmin.vehicleTransmissions
            : undefined,
        license:
          needsLicense && form.selfAdmin.isAlsoCollaborator
            ? {
                licenseNumber: form.selfAdmin.licenseNumber.value.trim(),
                expiredDateLicense: form.selfAdmin.licenseExpirationDate.value
                  ? Timestamp.fromDate(
                      form.selfAdmin.licenseExpirationDate.value,
                    )
                  : new Timestamp(0, 0),
                frontImgUrl: selfLicenseFront,
                backImgUrl: selfLicenseBack,
                category: form.selfAdmin.licenseCategory.value,
                requireGlasses: form.selfAdmin.licenseRequireGlasses.value,
                requireHeadphones:
                  form.selfAdmin.licenseRequireHeadphones.value,
              }
            : undefined,
        policeRecordsPdf: selfPoliceRecord,
      };
      uploadedMembers.push(selfMember);

      // Upload additional members
      for (const m of form.members) {
        let mProfilePhoto = EMPTY_REF_ATTACHMENT;
        let mIdFront = EMPTY_REF_ATTACHMENT;
        let mIdBack = EMPTY_REF_ATTACHMENT;
        let mLicenseFront: RefAttachment | undefined;
        let mLicenseBack: RefAttachment | undefined;
        let mPoliceRecord: RefAttachment | undefined;
        let mTechPhoto: RefAttachment | undefined;
        let mVehiclePhoto: RefAttachment | undefined;

        const lu = memberLookedUpUsers[m.id] ?? null;

        // Profile photo: may be a URL (pre-filled) or base64 (newly uploaded)
        if (m.profilePhoto.value) {
          if (isImageBase64(m.profilePhoto.value)) {
            mProfilePhoto = await uploadImage(
              m.profilePhoto,
              DirectoryPath.EnterpriseMembers,
            );
          } else if (lu?.photoUrl?.url) {
            mProfilePhoto = lu.photoUrl;
          }
        }
        // Identity card: may be URL (pre-filled) or base64 (newly uploaded)
        if (m.identityCardFront.value) {
          if (isImageBase64(m.identityCardFront.value)) {
            mIdFront = await uploadImage(
              m.identityCardFront,
              DirectoryPath.IdCards,
            );
          } else if (lu?.identityCard?.frontCard?.url) {
            mIdFront = lu.identityCard.frontCard;
          }
        }
        if (m.identityCardBack.value) {
          if (isImageBase64(m.identityCardBack.value)) {
            mIdBack = await uploadImage(
              m.identityCardBack,
              DirectoryPath.IdCards,
            );
          } else if (lu?.identityCard?.backCard?.url) {
            mIdBack = lu.identityCard.backCard;
          }
        }

        const memberIsCollaborator =
          m.role === "collaborator" || m.isAlsoCollaborator;

        if (needsLicense && memberIsCollaborator) {
          if (m.licenseFront.value)
            mLicenseFront = await uploadImage(
              m.licenseFront,
              DirectoryPath.Licenses,
            );
          if (m.licenseBack.value)
            mLicenseBack = await uploadImage(
              m.licenseBack,
              DirectoryPath.Licenses,
            );
          if (m.policeRecord.value)
            mPoliceRecord = await uploadImage(
              m.policeRecord,
              DirectoryPath.Documents,
            );
        }
        if (type === "mechanical" && m.technicalTitlePhoto.value) {
          mTechPhoto = await uploadImage(
            m.technicalTitlePhoto,
            DirectoryPath.Documents,
          );
        }
        if (type === "tow" && m.vehiclePhoto.value) {
          mVehiclePhoto = await uploadImage(
            m.vehiclePhoto,
            DirectoryPath.EnterpriseVehicles,
          );
        }

        const memberNeedsReview =
          memberIsCollaborator &&
          collaboratorRequiresReview(
            type,
            form.carWashServiceMode ?? undefined,
          );

        const member: EnterpriseMember = {
          userId: lu?.id ?? "",
          fakeUserId: lu?.fakeId ?? nanoid(8),
          role: m.role,
          isAlsoCollaborator:
            m.role === "admin" ? m.isAlsoCollaborator : undefined,
          accepted: false, // must accept from hub
          requiresAdminReview: memberNeedsReview,
          fullName: m.fullName.value.trim(),
          profilePhoto: mProfilePhoto,
          identityCardFront: mIdFront,
          identityCardBack: mIdBack,
          experience: isValidTextField(m.experience)
            ? m.experience.value.trim()
            : undefined,
          vehicleType:
            type === "driver" && needsLicense && memberIsCollaborator
              ? m.vehicleType
              : undefined,
          vehicleTransmissions:
            type === "driver" && needsLicense && memberIsCollaborator
              ? m.vehicleTransmissions
              : undefined,
          license:
            needsLicense && memberIsCollaborator && mLicenseFront
              ? {
                  licenseNumber: m.licenseNumber.value.trim(),
                  expiredDateLicense: m.licenseExpirationDate.value
                    ? Timestamp.fromDate(m.licenseExpirationDate.value)
                    : new Timestamp(0, 0),
                  frontImgUrl: mLicenseFront,
                  backImgUrl: mLicenseBack,
                  category: m.licenseCategory.value,
                  requireGlasses: m.licenseRequireGlasses.value,
                  requireHeadphones: m.licenseRequireHeadphones.value,
                }
              : undefined,
          policeRecordsPdf: mPoliceRecord,
          technicalTitle:
            type === "mechanical" && mTechPhoto
              ? {
                  titleName: m.technicalTitleName.value.trim(),
                  photo: mTechPhoto,
                }
              : undefined,
          vehiclePhotos: mVehiclePhoto ? [mVehiclePhoto] : undefined,
        };
        uploadedMembers.push(member);
      }

      const requestId = nanoid(30);
      const request = buildEnterpriseRequest(
        requestId,
        type,
        form.name.value.trim(),
        logoRef,
        user.id,
        user.fakeId,
        uploadedMembers,
        {
          description: isValidTextField(form.description)
            ? form.description.value.trim()
            : undefined,
          latitude: isValidTextField(form.latitude)
            ? parseFloat(form.latitude.value)
            : undefined,
          longitude: isValidTextField(form.longitude)
            ? parseFloat(form.longitude.value)
            : undefined,
          location: user.location ?? Locations.CochabambaBolivia,
          mechanicSubServices:
            type === "mechanical" ? form.mechanicSubServices : undefined,
          mechanicTools:
            type === "mechanical" ? form.mechanicTools.value.trim() : undefined,
          mechanicToolEvidences:
            type === "mechanical" ? uploadedToolEvidences : undefined,
          carWashServiceMode:
            type === "laundry"
              ? (form.carWashServiceMode ?? undefined)
              : undefined,
          towVehiclePhotos:
            type === "tow" ? towVehiclePhotosUploaded : undefined,
        },
      );
      request.nameArrayLower = generateKeywords(form.name.value.trim());

      await toast.promise(saveEnterpriseRequest(requestId, request), {
        pending: "Enviando solicitud de empresa...",
        success: "Solicitud de empresa enviada correctamente",
        error: "Error al enviar la solicitud",
      });

      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error("Ocurrió un error al procesar la solicitud.");
      setFormState({ loading: false, isValid: false });
    }
  };

  useEffect(() => {
    setFormState((prev) => ({ ...prev, isValid: isValidForm() }));
  }, [form, toolEvidences]);

  if (checkingUserAuth || !user) {
    return <PageLoading />;
  }

  // ─── Mechanic subservices catalog ───────────────────────────────────────
  const mechanicSubServicesCatalog =
    Array.isArray(MECHANIC_SUB_SERVICES) && MECHANIC_SUB_SERVICES.length > 0
      ? MECHANIC_SUB_SERVICES
      : [];

  // ─── Helper: add/remove member ──────────────────────────────────────────
  const addMember = (role: "admin" | "collaborator") => {
    setForm((prev) => ({
      ...prev,
      members: [...prev.members, createDefaultMember(role)],
    }));
  };

  const removeMember = (id: string) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
    }));
    setMemberLookedUpUsers((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
    setMemberSearchLoading((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  };

  const updateMember = (id: string, patch: Partial<MemberFormData>) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  };

  return (
    <div className="service-form-wrapper">
      <BaseForm
        content={{
          button: {
            content: { legend: "Enviar Solicitud de Empresa" },
            behavior: { isValid: true, loading: formState.loading },
          },
          styleClasses: "max-width-80",
        }}
        behavior={{ loading: formState.loading, onSummit: handleSubmit }}
      >
        {/* ── Header info ─────────────────────────────────────────── */}
        <div className="form-sub-container">
          <h2 className="text | medium-big bold">
            Registrar {SERVICE_TYPE_LABELS[type]}
          </h2>
          <div
            className="card padded margin-top-15"
            style={{ backgroundColor: "#f0f7ff", border: "1px solid #b3d4fc" }}
          >
            <p className="text | light">
              <b>Importante:</b> Al enviar esta solicitud, tu cuenta se
              convertirá automáticamente en <b>Administrador</b> de esta
              empresa. Como administrador podrás:
            </p>
            <ul
              className="text | light margin-top-10"
              style={{ paddingLeft: "1.5rem" }}
            >
              {type !== "laundry" && (
                <li>
                  Postular a nombre de la empresa a servicios y asignar
                  colaboradores para atenderlos.
                </li>
              )}
              {type === "laundry" && (
                <li>
                  Asignar colaboradores para atender los servicios que los
                  usuarios reserven directamente.
                </li>
              )}
              <li>Agregar otros administradores y colaboradores.</li>
              <li>Gestionar los datos y el perfil de la empresa.</li>
            </ul>
            <p className="text | light margin-top-10">
              <b>Todos los administradores</b> deben tener sus datos personales
              registrados (carnet de identidad). Si no los tienen, puedes
              adjuntarlos aquí por cada uno.
            </p>
            <p className="text | light margin-top-10">
              Los <b>colaboradores</b> son las personas que irán a prestar el
              servicio directamente. La empresa es responsable de gestionar los
              datos y la confianza de sus trabajadores. Cada colaborador debe
              confirmar/aceptar su membresía desde su cuenta de CareDriver.
            </p>
          </div>
        </div>

        {/* ── Enterprise core fields ─────────────────────────────── */}
        <div className="form-sub-container | margin-top-25">
          <h2 className="text | medium-big bold">Datos de la Empresa</h2>

          <fieldset className="form-section margin-top-10">
            <input
              type="text"
              className="form-section-input"
              value={form.name.value}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: { ...prev.name, value: e.target.value, message: null },
                }))
              }
              placeholder={isFocused("name") ? "Ej: AutoServicios Rápidos" : ""}
              onFocus={() => setFocus("name", true)}
              onBlur={() => setFocus("name", false)}
            />
            <legend className="form-section-legend">
              Nombre de la empresa *
            </legend>
          </fieldset>

          <ImageUploader
            uploader={{
              image: form.logo,
              setImage: (d) => setForm((prev) => ({ ...prev, logo: d })),
            }}
            content={{
              id: "enterprise-logo",
              legend: "Logo o foto de la empresa *",
              imageInCircle: false,
            }}
          />

          <fieldset className="form-section margin-top-10">
            <textarea
              className="form-section-input"
              value={form.description.value}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: {
                    ...prev.description,
                    value: e.target.value,
                    message: null,
                  },
                }))
              }
              placeholder={
                isFocused("description")
                  ? "Puedes incluir tu NIT, horarios, servicios especiales, etc."
                  : ""
              }
              rows={3}
              onFocus={() => setFocus("description", true)}
              onBlur={() => setFocus("description", false)}
            />
            <legend className="form-section-legend">
              Descripción (Opcional)
            </legend>
          </fieldset>

          <div className="row-wrapper | gap-10 margin-top-10">
            <fieldset className="form-section" style={{ flex: 1 }}>
              <input
                type="text"
                className="form-section-input"
                value={form.latitude.value}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    latitude: {
                      ...prev.latitude,
                      value: e.target.value,
                      message: null,
                    },
                  }))
                }
                placeholder={isFocused("lat") ? "Ej: -17.3935" : ""}
                onFocus={() => setFocus("lat", true)}
                onBlur={() => setFocus("lat", false)}
              />
              <legend className="form-section-legend">
                Latitud (Opcional)
              </legend>
            </fieldset>
            <fieldset className="form-section" style={{ flex: 1 }}>
              <input
                type="text"
                className="form-section-input"
                value={form.longitude.value}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    longitude: {
                      ...prev.longitude,
                      value: e.target.value,
                      message: null,
                    },
                  }))
                }
                placeholder={isFocused("lng") ? "Ej: -66.1570" : ""}
                onFocus={() => setFocus("lng", true)}
                onBlur={() => setFocus("lng", false)}
              />
              <legend className="form-section-legend">
                Longitud (Opcional)
              </legend>
            </fieldset>
          </div>
        </div>

        {/* ── Car wash service mode ──────────────────────────────── */}
        {type === "laundry" && (
          <div className="form-sub-container | margin-top-25">
            <h2 className="text | medium-big bold">Modalidad de Servicio *</h2>
            <p className="text | light margin-top-10">
              Selecciona cómo ofrecerás tu servicio de lavado:
            </p>
            <div className="margin-top-10">
              {Object.values(CarWashServiceMode).map((mode) => (
                <label
                  key={mode}
                  className="row-wrapper | gap-10 margin-top-10 touchable"
                  style={{ alignItems: "flex-start" }}
                >
                  <input
                    type="radio"
                    name="carWashMode"
                    checked={form.carWashServiceMode === mode}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        carWashServiceMode: mode,
                      }))
                    }
                  />
                  <span className="text">
                    <b>{CarWashServiceModeRender[mode]}</b>
                  </span>
                </label>
              ))}
            </div>
            {form.carWashServiceMode !== CarWashServiceMode.MobileOnly &&
              form.carWashServiceMode !== null && (
                <p className="text | light margin-top-10">
                  <b>Nota:</b> Al ofrecer recojo del vehículo, tus colaboradores
                  necesitarán licencia de conducir y podrán adjuntar
                  antecedentes policiales opcionalmente.
                </p>
              )}
          </div>
        )}

        {/* ── Mechanic-specific: subservices + tools ─────────────── */}
        {type === "mechanical" && (
          <>
            <div className="form-sub-container | margin-top-25">
              <h2 className="text | medium-big bold">
                Subservicios que ofrece la empresa
              </h2>
              <p className="text | light margin-top-10">
                Marca los servicios que tu empresa puede ofrecer actualmente:
              </p>
              <div className="margin-top-10">
                {mechanicSubServicesCatalog.map((sub) => (
                  <label
                    key={sub.key}
                    className="row-wrapper | gap-10 margin-top-10 touchable"
                    style={{ alignItems: "flex-start" }}
                  >
                    <input
                      type="checkbox"
                      checked={form.mechanicSubServices.includes(sub.key)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...form.mechanicSubServices, sub.key]
                          : form.mechanicSubServices.filter(
                              (v) => v !== sub.key,
                            );
                        setForm((prev) => ({
                          ...prev,
                          mechanicSubServices: next,
                        }));
                      }}
                    />
                    <span className="text">
                      <b>{sub.key}</b>
                      <br />
                      <span className="light">{sub.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-sub-container | margin-top-25">
              <h2 className="text | medium-big bold">
                Herramientas de la empresa *
              </h2>
              <fieldset className="form-section margin-top-10">
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
                    isFocused("tools")
                      ? "Ej: Escáner OBD, gato hidráulico, compresor, etc."
                      : ""
                  }
                  onFocus={() => setFocus("tools", true)}
                  onBlur={() => setFocus("tools", false)}
                />
                <legend className="form-section-legend">
                  Resumen de herramientas
                </legend>
              </fieldset>

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
                          prev.map((t) =>
                            t.id === tool.id
                              ? {
                                  ...t,
                                  name: {
                                    ...t.name,
                                    value: e.target.value,
                                    message: null,
                                  },
                                }
                              : t,
                          ),
                        )
                      }
                    />
                    <legend className="form-section-legend">Nombre</legend>
                  </fieldset>
                  <ImageUploader
                    uploader={{
                      image: tool.photo,
                      setImage: (image) =>
                        setToolEvidences((prev) =>
                          prev.map((t) =>
                            t.id === tool.id ? { ...t, photo: image } : t,
                          ),
                        ),
                    }}
                    content={{
                      id: `ent-tool-${tool.id}`,
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
                          prev.filter((t) => t.id !== tool.id),
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
          </>
        )}

        {/* ── Tow fleet photos ───────────────────────────────────── */}
        {type === "tow" && (
          <div className="form-sub-container | margin-top-25">
            <h2 className="text | medium-big bold">
              Fotos de vehículos de la empresa (Opcional)
            </h2>
            <p className="text | light margin-top-10">
              Sube fotos de los vehículos de remolque de tu empresa.
            </p>
            {form.towVehiclePhotos.map((photo, idx) => (
              <div key={idx} className="margin-top-10">
                <ImageUploader
                  uploader={{
                    image: photo,
                    setImage: (d) =>
                      setForm((prev) => ({
                        ...prev,
                        towVehiclePhotos: prev.towVehiclePhotos.map((p, i) =>
                          i === idx ? d : p,
                        ),
                      })),
                  }}
                  content={{
                    id: `tow-vehicle-${idx}`,
                    legend: `Vehículo ${idx + 1}`,
                    imageInCircle: false,
                  }}
                />
                {form.towVehiclePhotos.length > 1 && (
                  <button
                    type="button"
                    className="small-general-button text | bold gray margin-top-5"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        towVehiclePhotos: prev.towVehiclePhotos.filter(
                          (_, i) => i !== idx,
                        ),
                      }))
                    }
                  >
                    Quitar foto
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="small-general-button text | bold margin-top-10"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  towVehiclePhotos: [
                    ...prev.towVehiclePhotos,
                    DEFAUL_ATTACHMENT_FIELD,
                  ],
                }))
              }
            >
              Agregar foto de vehículo
            </button>
          </div>
        )}

        {/* ── Self admin personal data ───────────────────────────── */}
        <div className="form-sub-container | margin-top-25">
          <h2 className="text | medium-big bold">
            Tus datos como Administrador
          </h2>
          <p className="text | light margin-top-10">
            Como el que registra la empresa, tus datos son obligatorios.
          </p>

          <p className="text | light margin-top-10">
            <b>Carnet de identidad:</b> Necesitamos tu carnet para validar tu
            identidad y verificar que tu foto de perfil y nombre coincidan.
          </p>

          <ImageUploader
            uploader={{
              image: form.selfAdmin.identityCardFront,
              setImage: (d) =>
                setForm((prev) => ({
                  ...prev,
                  selfAdmin: { ...prev.selfAdmin, identityCardFront: d },
                })),
            }}
            content={{
              id: "self-id-front",
              legend: "Carnet de identidad (Frente) *",
              imageInCircle: false,
            }}
          />
          <ImageUploader
            uploader={{
              image: form.selfAdmin.identityCardBack,
              setImage: (d) =>
                setForm((prev) => ({
                  ...prev,
                  selfAdmin: { ...prev.selfAdmin, identityCardBack: d },
                })),
            }}
            content={{
              id: "self-id-back",
              legend: "Carnet de identidad (Reverso) *",
              imageInCircle: false,
            }}
          />

          <label className="row-wrapper | gap-10 margin-top-15 touchable">
            <input
              type="checkbox"
              checked={form.selfAdmin.isAlsoCollaborator}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  selfAdmin: {
                    ...prev.selfAdmin,
                    isAlsoCollaborator: e.target.checked,
                  },
                }))
              }
            />
            <span className="text">
              <b>También quiero ser colaborador</b> (iré personalmente a prestar
              servicios)
            </span>
          </label>

          {form.selfAdmin.isAlsoCollaborator && (
            <div className="card padded margin-top-10">
              <p className="text | light">
                Datos adicionales como colaborador:
              </p>
              <fieldset className="form-section margin-top-10">
                <textarea
                  className="form-section-input"
                  value={form.selfAdmin.experience.value}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      selfAdmin: {
                        ...prev.selfAdmin,
                        experience: {
                          ...prev.selfAdmin.experience,
                          value: e.target.value,
                          message: null,
                        },
                      },
                    }))
                  }
                  placeholder={
                    isFocused("selfExp")
                      ? "Describe tu experiencia en este tipo de servicio"
                      : ""
                  }
                  rows={3}
                  onFocus={() => setFocus("selfExp", true)}
                  onBlur={() => setFocus("selfExp", false)}
                />
                <legend className="form-section-legend">
                  Experiencia (Opcional)
                </legend>
              </fieldset>

              {needsLicense && (
                <>
                  {type === "driver" && (
                    <>
                      <h3 className="text icon-wrapper | bold margin-top-15">
                        <Car /> Tipo de vehículo que conduces
                      </h3>
                      <fieldset className="form-section | select-item">
                        <ChevronDown />
                        <select
                          value={form.selfAdmin.vehicleType}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              selfAdmin: {
                                ...prev.selfAdmin,
                                vehicleType: e.target.value as VehicleType,
                                vehicleTransmissions: [
                                  VehicleTransmission.AUTOMATIC,
                                ],
                              },
                            }))
                          }
                          className="form-section-input"
                        >
                          {VEHICLE_CATEGORIES.map((vt) => (
                            <option key={vt} value={vt}>
                              {VEHICLE_CATEGORY_TO_SPANISH[vt]}
                            </option>
                          ))}
                        </select>
                        <legend className="form-section-legend">
                          Categoría
                        </legend>
                      </fieldset>
                      <TransmissionField
                        transmission={form.selfAdmin.vehicleTransmissions[0]}
                        setter={(d) =>
                          setForm((prev) => ({
                            ...prev,
                            selfAdmin: {
                              ...prev.selfAdmin,
                              vehicleTransmissions: [d],
                            },
                          }))
                        }
                      />
                    </>
                  )}

                  <h3 className="text icon-wrapper | bold margin-top-15">
                    <AddressCar /> Licencia de Conducir
                  </h3>
                  <br />
                  <br />
                  <LicenceNumberField
                    field={{
                      values: form.selfAdmin.licenseNumber,
                      setter: (d) =>
                        setForm((prev) => ({
                          ...prev,
                          selfAdmin: { ...prev.selfAdmin, licenseNumber: d },
                        })),
                      validator: isValidLicenseNumber,
                    }}
                  />
                  <LicenseCategoryField
                    location={form.selfAdmin.licenseCategory.value}
                    setter={(d) =>
                      setForm((prev) => ({
                        ...prev,
                        selfAdmin: {
                          ...prev.selfAdmin,
                          licenseCategory: {
                            ...prev.selfAdmin.licenseCategory,
                            value: d,
                          },
                        },
                      }))
                    }
                  />
                  <DateField
                    field={{
                      values: form.selfAdmin.licenseExpirationDate,
                      setter: (d) =>
                        setForm((prev) => ({
                          ...prev,
                          selfAdmin: {
                            ...prev.selfAdmin,
                            licenseExpirationDate: d,
                          },
                        })),
                      validator: isValidLicenseDate,
                    }}
                    legend="Fecha de expiración"
                  />

                  <CCheckField
                    marker={{
                      isCheck: form.selfAdmin.licenseRequireGlasses.value,
                      setCheck: (s) =>
                        setForm((prev) => ({
                          ...prev,
                          selfAdmin: {
                            ...prev.selfAdmin,
                            licenseRequireGlasses: {
                              ...prev.selfAdmin.licenseRequireGlasses,
                              value: s,
                            },
                          },
                        })),
                    }}
                    content={{
                      checkDescription: (
                        <p>Marca si requiere usar lentes para conducir</p>
                      ),
                    }}
                  />
                  <CCheckField
                    marker={{
                      isCheck: form.selfAdmin.licenseRequireHeadphones.value,
                      setCheck: (s) =>
                        setForm((prev) => ({
                          ...prev,
                          selfAdmin: {
                            ...prev.selfAdmin,
                            licenseRequireHeadphones: {
                              ...prev.selfAdmin.licenseRequireHeadphones,
                              value: s,
                            },
                          },
                        })),
                    }}
                    content={{
                      checkDescription: (
                        <p>Marca si requiere usar audífonos para conducir</p>
                      ),
                    }}
                  />

                  <ImageUploader
                    uploader={{
                      image: form.selfAdmin.licenseFront,
                      setImage: (d) =>
                        setForm((prev) => ({
                          ...prev,
                          selfAdmin: { ...prev.selfAdmin, licenseFront: d },
                        })),
                    }}
                    content={{
                      id: "self-license-front",
                      legend: "Parte frontal de la licencia *",
                      imageInCircle: false,
                    }}
                  />
                  <ImageUploader
                    uploader={{
                      image: form.selfAdmin.licenseBack,
                      setImage: (d) =>
                        setForm((prev) => ({
                          ...prev,
                          selfAdmin: { ...prev.selfAdmin, licenseBack: d },
                        })),
                    }}
                    content={{
                      id: "self-license-back",
                      legend: "Parte posterior de la licencia *",
                      imageInCircle: false,
                    }}
                  />

                  <ImageUploader
                    uploader={{
                      image: form.selfAdmin.policeRecord,
                      setImage: (d) =>
                        setForm((prev) => ({
                          ...prev,
                          selfAdmin: { ...prev.selfAdmin, policeRecord: d },
                        })),
                    }}
                    content={{
                      id: "self-police-record",
                      legend: "Antecedentes policiales (Opcional)",
                      imageInCircle: false,
                    }}
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Selfie ──────────────────────────────────────────────── */}
        <SelfieSection
          image={form.selfAdminSelfie}
          setImage={(d) => setForm((prev) => ({ ...prev, selfAdminSelfie: d }))}
        />

        {/* ── Additional members ──────────────────────────────────── */}
        <div className="form-sub-container | margin-top-25">
          <h2 className="text | medium-big bold">
            Agregar Miembros (Opcional)
          </h2>
          <p className="text | light margin-top-10">
            Puedes agregar administradores y colaboradores ahora o después de
            que tu empresa sea aprobada.
          </p>

          {form.members.map((member, idx) => (
            <div
              key={member.id}
              className="card padded margin-top-15"
              style={{ border: "1px solid #ddd" }}
            >
              <div className="row-wrapper | space-between">
                <h3 className="text | bold">
                  {member.role === "admin"
                    ? `Administrador ${idx + 1}`
                    : `Colaborador ${idx + 1}`}
                </h3>
                <button
                  type="button"
                  className="small-general-button text | bold gray"
                  onClick={() => removeMember(member.id)}
                >
                  Quitar
                </button>
              </div>

              {/* ── Email lookup ── */}
              <fieldset className="form-section margin-top-10">
                <input
                  type="email"
                  className="form-section-input"
                  value={member.userEmail.value}
                  onChange={(e) => {
                    updateMember(member.id, {
                      userEmail: {
                        ...member.userEmail,
                        value: e.target.value,
                        message: null,
                      },
                    });
                    // Clear previous lookup when email changes
                    setMemberLookedUpUsers((prev) => {
                      const n = { ...prev };
                      delete n[member.id];
                      return n;
                    });
                  }}
                  placeholder="correo@ejemplo.com"
                  onFocus={() => setFocus(`email-${member.id}`, true)}
                  onBlur={() => setFocus(`email-${member.id}`, false)}
                />
                <legend className="form-section-legend">
                  Email del usuario en CareDriver *
                </legend>
              </fieldset>
              <button
                type="button"
                className="small-general-button text | bold margin-top-5"
                disabled={
                  memberSearchLoading[member.id] ||
                  !member.userEmail.value.trim()
                }
                onClick={() =>
                  lookupMemberUser(member.id, member.userEmail.value)
                }
              >
                {memberSearchLoading[member.id]
                  ? "Buscando..."
                  : "Buscar usuario"}
              </button>
              {memberLookedUpUsers[member.id] === null && (
                <p
                  className="text | light margin-top-5"
                  style={{ color: "#c0392b" }}
                >
                  No se encontró ningún usuario registrado con ese correo.
                </p>
              )}
              {memberLookedUpUsers[member.id] && (
                <p
                  className="text | light margin-top-5"
                  style={{ color: "#27ae60" }}
                >
                  ✓ Usuario encontrado:{" "}
                  {memberLookedUpUsers[member.id]!.fullName}
                </p>
              )}

              {/* ── Rest of form (only after successful lookup) ── */}
              {memberLookedUpUsers[member.id] && (
                <>
                  <p
                    className="text | light margin-top-15"
                    style={{
                      fontSize: "0.85rem",
                      background: "#fffbe6",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #ffe083",
                    }}
                  >
                    La foto de perfil debe mostrar la cara claramente, con fondo
                    claro y en formato cuadrado. La imagen se recortará
                    automáticamente al subirla.
                  </p>
                  <ImageUploader
                    uploader={{
                      image: member.profilePhoto,
                      setImage: (d) =>
                        updateMember(member.id, { profilePhoto: d }),
                    }}
                    content={{
                      id: `member-photo-${member.id}`,
                      legend: "Foto de perfil",
                      imageInCircle: true,
                    }}
                  />

                  <fieldset className="form-section margin-top-10">
                    <input
                      type="text"
                      className="form-section-input"
                      value={member.fullName.value}
                      onChange={(e) =>
                        updateMember(member.id, {
                          fullName: {
                            ...member.fullName,
                            value: e.target.value,
                            message: null,
                          },
                        })
                      }
                    />
                    <legend className="form-section-legend">
                      Nombre completo *
                    </legend>
                  </fieldset>

                  <p className="text | text-light margin-top-10">
                    <b>Carnet de identidad:</b> Necesitamos verificar que el
                    nombre y la foto de perfil sean correctos.
                    {memberLookedUpUsers[member.id]?.identityCard
                      ? " (Pre-cargado desde el perfil del usuario — puedes reemplazarlo si es necesario.)"
                      : " El usuario aún no tiene carnet guardado en la app."}
                  </p>
                  <ImageUploader
                    uploader={{
                      image: member.identityCardFront,
                      setImage: (d) =>
                        updateMember(member.id, { identityCardFront: d }),
                    }}
                    content={{
                      id: `member-id-front-${member.id}`,
                      legend: "Carnet de identidad (Frente)",
                      imageInCircle: false,
                    }}
                  />
                  <ImageUploader
                    uploader={{
                      image: member.identityCardBack,
                      setImage: (d) =>
                        updateMember(member.id, { identityCardBack: d }),
                    }}
                    content={{
                      id: `member-id-back-${member.id}`,
                      legend: "Carnet de identidad (Reverso)",
                      imageInCircle: false,
                    }}
                  />

                  {member.role === "admin" && (
                    <label className="row-wrapper | gap-10 margin-top-10 touchable">
                      <input
                        type="checkbox"
                        checked={member.isAlsoCollaborator}
                        onChange={(e) =>
                          updateMember(member.id, {
                            isAlsoCollaborator: e.target.checked,
                          })
                        }
                      />
                      <span className="text">
                        También registrar como colaborador
                      </span>
                    </label>
                  )}

                  {(member.role === "collaborator" ||
                    member.isAlsoCollaborator) && (
                    <div className="margin-top-10">
                      <fieldset className="form-section margin-top-10">
                        <textarea
                          className="form-section-input"
                          value={member.experience.value}
                          onChange={(e) =>
                            updateMember(member.id, {
                              experience: {
                                ...member.experience,
                                value: e.target.value,
                                message: null,
                              },
                            })
                          }
                          rows={2}
                        />
                        <legend className="form-section-legend">
                          Experiencia (Opcional)
                        </legend>
                      </fieldset>

                      {needsLicense && (
                        <>
                          {type === "driver" && (
                            <>
                              <h3 className="text icon-wrapper | bold margin-top-15">
                                <Car /> Tipo de vehículo que conduce
                              </h3>
                              <fieldset className="form-section | select-item">
                                <ChevronDown />
                                <select
                                  value={member.vehicleType}
                                  onChange={(e) =>
                                    updateMember(member.id, {
                                      vehicleType: e.target
                                        .value as VehicleType,
                                      vehicleTransmissions: [
                                        VehicleTransmission.AUTOMATIC,
                                      ],
                                    })
                                  }
                                  className="form-section-input"
                                >
                                  {VEHICLE_CATEGORIES.map((vt) => (
                                    <option key={vt} value={vt}>
                                      {VEHICLE_CATEGORY_TO_SPANISH[vt]}
                                    </option>
                                  ))}
                                </select>
                                <legend className="form-section-legend">
                                  Categoría
                                </legend>
                              </fieldset>
                              <TransmissionField
                                transmission={member.vehicleTransmissions[0]}
                                setter={(d) =>
                                  updateMember(member.id, {
                                    vehicleTransmissions: [d],
                                  })
                                }
                              />
                            </>
                          )}

                          <h3 className="text icon-wrapper | bold margin-top-15">
                            <AddressCar /> Licencia de Conducir
                          </h3>
                          <br />
                          <br />

                          <LicenceNumberField
                            field={{
                              values: member.licenseNumber,
                              setter: (d) =>
                                updateMember(member.id, { licenseNumber: d }),
                              validator: isValidLicenseNumber,
                            }}
                          />
                          <LicenseCategoryField
                            location={member.licenseCategory.value}
                            setter={(d) =>
                              updateMember(member.id, {
                                licenseCategory: {
                                  ...member.licenseCategory,
                                  value: d,
                                },
                              })
                            }
                          />
                          <DateField
                            field={{
                              values: member.licenseExpirationDate,
                              setter: (d) =>
                                updateMember(member.id, {
                                  licenseExpirationDate: d,
                                }),
                              validator: isValidLicenseDate,
                            }}
                            legend="Fecha de expiración"
                          />

                          <CCheckField
                            marker={{
                              isCheck: member.licenseRequireGlasses.value,
                              setCheck: (s) =>
                                updateMember(member.id, {
                                  licenseRequireGlasses: {
                                    ...member.licenseRequireGlasses,
                                    value: s,
                                  },
                                }),
                            }}
                            content={{
                              checkDescription: (
                                <p>
                                  Marca si requiere usar lentes para conducir
                                </p>
                              ),
                            }}
                          />
                          <CCheckField
                            marker={{
                              isCheck: member.licenseRequireHeadphones.value,
                              setCheck: (s) =>
                                updateMember(member.id, {
                                  licenseRequireHeadphones: {
                                    ...member.licenseRequireHeadphones,
                                    value: s,
                                  },
                                }),
                            }}
                            content={{
                              checkDescription: (
                                <p>
                                  Marca si requiere usar audífonos para conducir
                                </p>
                              ),
                            }}
                          />

                          <ImageUploader
                            uploader={{
                              image: member.licenseFront,
                              setImage: (d) =>
                                updateMember(member.id, { licenseFront: d }),
                            }}
                            content={{
                              id: `member-lic-front-${member.id}`,
                              legend: "Parte frontal de la licencia",
                              imageInCircle: false,
                            }}
                          />
                          <ImageUploader
                            uploader={{
                              image: member.licenseBack,
                              setImage: (d) =>
                                updateMember(member.id, { licenseBack: d }),
                            }}
                            content={{
                              id: `member-lic-back-${member.id}`,
                              legend: "Parte posterior de la licencia",
                              imageInCircle: false,
                            }}
                          />

                          <ImageUploader
                            uploader={{
                              image: member.policeRecord,
                              setImage: (d) =>
                                updateMember(member.id, { policeRecord: d }),
                            }}
                            content={{
                              id: `member-police-${member.id}`,
                              legend: "Antecedentes policiales (Opcional)",
                              imageInCircle: false,
                            }}
                          />
                        </>
                      )}

                      {type === "mechanical" && (
                        <>
                          <fieldset className="form-section margin-top-10">
                            <input
                              type="text"
                              className="form-section-input"
                              value={member.technicalTitleName.value}
                              onChange={(e) =>
                                updateMember(member.id, {
                                  technicalTitleName: {
                                    ...member.technicalTitleName,
                                    value: e.target.value,
                                    message: null,
                                  },
                                })
                              }
                            />
                            <legend className="form-section-legend">
                              Título técnico (Opcional)
                            </legend>
                          </fieldset>
                          <ImageUploader
                            uploader={{
                              image: member.technicalTitlePhoto,
                              setImage: (d) =>
                                updateMember(member.id, {
                                  technicalTitlePhoto: d,
                                }),
                            }}
                            content={{
                              id: `member-title-${member.id}`,
                              legend: "Foto del título (Opcional)",
                              imageInCircle: false,
                            }}
                          />
                        </>
                      )}

                      {type === "tow" && (
                        <ImageUploader
                          uploader={{
                            image: member.vehiclePhoto,
                            setImage: (d) =>
                              updateMember(member.id, { vehiclePhoto: d }),
                          }}
                          content={{
                            id: `member-vehicle-${member.id}`,
                            legend: "Foto del vehículo (Opcional)",
                            imageInCircle: false,
                          }}
                        />
                      )}
                    </div>
                  )}

                  <div
                    className="card padded margin-top-10"
                    style={{
                      background: "#f0f7ff",
                      border: "1px solid #b3d4fc",
                      fontSize: "0.85rem",
                    }}
                  >
                    <p className="text | light">
                      <b>Aviso:</b> El usuario recibirá una notificación en su
                      aplicación para aceptar o rechazar su membresía en esta
                      empresa, una vez que la solicitud sea aprobada por el
                      administrador de CareDriver.
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}

          <div className="row-wrapper | gap-10 margin-top-15">
            <button
              type="button"
              className="small-general-button text | bold"
              onClick={() => addMember("admin")}
            >
              + Agregar Administrador
            </button>
            <button
              type="button"
              className="small-general-button text | bold"
              onClick={() => addMember("collaborator")}
            >
              + Agregar Colaborador
            </button>
          </div>
        </div>

        {/* ── Terms ───────────────────────────────────────────────── */}
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
  );
};

export default NewEnterpriseRequestForm;

// ─── Default form builders ──────────────────────────────────────────────────

function createDefaultForm(type: ServiceType): EnterpriseFormState {
  return {
    name: DEFAUL_TEXT_FIELD,
    logo: DEFAUL_ATTACHMENT_FIELD,
    description: DEFAUL_TEXT_FIELD,
    latitude: DEFAUL_TEXT_FIELD,
    longitude: DEFAUL_TEXT_FIELD,
    mechanicTools: DEFAUL_TEXT_FIELD,
    mechanicSubServices: [],
    carWashServiceMode: null,
    towVehiclePhotos: [DEFAUL_ATTACHMENT_FIELD],
    selfAdmin: {
      identityCardFront: DEFAUL_ATTACHMENT_FIELD,
      identityCardBack: DEFAUL_ATTACHMENT_FIELD,
      isAlsoCollaborator: false,
      experience: DEFAUL_TEXT_FIELD,
      vehicleType: VehicleType.CAR,
      vehicleTransmissions: [VehicleTransmission.AUTOMATIC],
      licenseFront: DEFAUL_ATTACHMENT_FIELD,
      licenseBack: DEFAUL_ATTACHMENT_FIELD,
      licenseNumber: DEFAUL_TEXT_FIELD,
      licenseExpirationDate: DEFAUL_DATE_FIELD,
      licenseCategory: createEntityDataFieldMandatory(
        LicenseCategories.CategoryP,
      ),
      licenseRequireGlasses: DEFAULT_CHECK_FIELD,
      licenseRequireHeadphones: DEFAULT_CHECK_FIELD,
      policeRecord: DEFAUL_ATTACHMENT_FIELD,
    },
    selfAdminSelfie: DEFAUL_ATTACHMENT_FIELD,
    members: [],
    termsCheck: false,
  };
}

function createDefaultMember(role: "admin" | "collaborator"): MemberFormData {
  return {
    id: nanoid(),
    role,
    isAlsoCollaborator: false,
    userEmail: DEFAUL_TEXT_FIELD,
    fullName: DEFAUL_TEXT_FIELD,
    profilePhoto: DEFAUL_ATTACHMENT_FIELD,
    identityCardFront: DEFAUL_ATTACHMENT_FIELD,
    identityCardBack: DEFAUL_ATTACHMENT_FIELD,
    experience: DEFAUL_TEXT_FIELD,
    vehicleType: VehicleType.CAR,
    vehicleTransmissions: [VehicleTransmission.AUTOMATIC],
    licenseFront: DEFAUL_ATTACHMENT_FIELD,
    licenseBack: DEFAUL_ATTACHMENT_FIELD,
    licenseNumber: DEFAUL_TEXT_FIELD,
    licenseExpirationDate: DEFAUL_DATE_FIELD,
    licenseCategory: createEntityDataFieldMandatory(
      LicenseCategories.CategoryP,
    ),
    licenseRequireGlasses: DEFAULT_CHECK_FIELD,
    licenseRequireHeadphones: DEFAULT_CHECK_FIELD,
    policeRecord: DEFAUL_ATTACHMENT_FIELD,
    technicalTitlePhoto: DEFAUL_ATTACHMENT_FIELD,
    technicalTitleName: DEFAUL_TEXT_FIELD,
    vehiclePhoto: DEFAUL_ATTACHMENT_FIELD,
  };
}
