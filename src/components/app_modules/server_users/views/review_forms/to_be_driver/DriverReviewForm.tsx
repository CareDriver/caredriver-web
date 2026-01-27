"use client";
import { UserRequest, Vehicle } from "@/interfaces/UserRequest";
import {
  deleteImagesIfLimitOfApproves,
  MIN_NUM_OF_APPROVALS,
  saveReview,
  setFirstService,
} from "@/components/app_modules/server_users/api/ServicesRequester";
import PersonalDataRenderer from "../../../../users/views/data_renderers/for_user_data/PersonalDataRenderer";
import SelfieRenderer from "../../../../../form/view/field_renderers/SelfieRenderer";
import VehiclesWithCategoryRenderer from "../../data_renderers/for_vehicles/VehiclesWithCategoryRenderer";
import { useContext, useEffect, useState } from "react";
import {
  driveReqCollection,
  saveDriveReq,
} from "@/components/app_modules/server_users/api/DriveRequester";
import { AuthContext } from "@/context/AuthContext";
import {
  getUserById,
  updateUser,
} from "@/components/app_modules/users/api/UserRequester";
import {
  flatPhone,
  PhoneNumber,
  ServiceRequestsInterface,
  ServiceVehicles,
  UserInterface,
} from "@/interfaces/UserInterface";
import { Locations, locationList } from "@/interfaces/Locations";
import { VehicleType } from "@/interfaces/VehicleInterface";
import { ServiceReqState, Services } from "@/interfaces/Services";
import { toast } from "react-toastify";
import ApprovalsRenderer from "../../data_renderers/ApprovalsRenderer";
import UserContactsRendererForForm from "../../../../users/views/data_renderers/for_user_data/UserContactsRendererForForm";
import UserStateWithMessageRenderer from "../../../../users/views/data_renderers/for_user_data/UserStateWithMessageRenderer";
import IdCardRenderer from "../../../../users/views/data_renderers/for_user_data/IdCardRenderer";
import { addUserServerToEnterprise } from "@/components/app_modules/enterprises/api/EnterpriseUserAdder";
import { Enterprise } from "@/interfaces/Enterprise";
import DriverEnterpriseRenderer from "../../../../enterprises/views/data_renderers/DriverEnterpriseRenderer";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import BaseFormWithTwoButtons from "@/components/form/view/forms/BaseFormWithTwoButtons";
import {
  DEFAULT_REVIEW_STATE,
  ReviewState,
} from "@/components/form/models/Reviews";
import { getIdSaved } from "@/utils/generators/IdGenerator";
import UserStateRenderer from "@/components/app_modules/users/views/data_renderers/for_user_data/UserStateRenderer";
import { DRIVER } from "@/models/Business";
import { notifyRequestApprovalUser } from "../../../api/UserServerNotifier";
import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";
import { RefAttachment } from "@/components/form/models/RefAttachment";
import { BloodTypes } from "@/interfaces/BloodTypes";
import PDFRenderer from "@/components/form/view/field_renderers/PDFRenderer";
import { Timestamp } from "firebase/firestore";
import ImageRenderer from "@/components/form/view/field_renderers/ImageRenderer";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { generateKeywords } from "@/utils/helpers/StringHelper";

const DriverReviewForm = ({ serviceReq }: { serviceReq: UserRequest }) => {
  const { user: adminUser } = useContext(AuthContext);
  const [reviewState, setReviewState] =
    useState<ReviewState>(DEFAULT_REVIEW_STATE);
  const [requesterUser, setRequesterUser] = useState<
    UserInterface | null | undefined
  >(null);
  const [enterprise, setEnterpise] = useState<Enterprise | null | undefined>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false);
  const [editPhoto, setEditPhoto] = useState<string | RefAttachment>(
    serviceReq.newProfilePhotoImgUrl ?? "",
  );
  const [editValues, setEditValues] = useState({
    newFullName: serviceReq.newFullName ?? "",
    homeAddress: serviceReq.homeAddress ?? "",
    location: serviceReq.location ?? Locations.CochabambaBolivia,
  });

  const currentReq: UserRequest = {
    ...serviceReq,
    newFullName: editValues.newFullName,
    homeAddress: editValues.homeAddress,
    location: editValues.location,
    newProfilePhotoImgUrl: editPhoto,
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const resetEdits = () => {
    setEditValues({
      newFullName: serviceReq.newFullName ?? "",
      homeAddress: serviceReq.homeAddress ?? "",
      location: serviceReq.location ?? Locations.CochabambaBolivia,
    });
    setEditPhoto(serviceReq.newProfilePhotoImgUrl ?? "");
  };

  const wasReviewed = (): boolean => {
    return reviewState.reviewed || !currentReq.active;
  };

  const saveReviewHistory = async (req: UserRequest, wasApproved: boolean) => {
    try {
      if (adminUser && adminUser.id) {
        const isLimitToReviews: boolean =
          req.reviewedByHistory !== undefined &&
          req.reviewedByHistory.length + 1 === MIN_NUM_OF_APPROVALS;
        await saveReview(req, adminUser.id, wasApproved, driveReqCollection);

        if (isLimitToReviews) {
          var car = getVehicle(VehicleType.CAR);
          var motorcycle = getVehicle(VehicleType.MOTORCYCLE);

          if (requesterUser) {
            var vehicles: ServiceVehicles =
              requesterUser.serviceVehicles !== undefined
                ? { ...requesterUser.serviceVehicles }
                : {};
            var newReqState: ServiceRequestsInterface =
              requesterUser.serviceRequests !== undefined
                ? { ...requesterUser.serviceRequests }
                : {};

            const serviceReqState = {
              id: req.id,
              state: wasApproved
                ? ServiceReqState.Approved
                : ServiceReqState.Refused,
            };

            if (car) {
              car = {
                ...car,
                license: {
                  frontImgUrl: car.license.frontImgUrl,
                  backImgUrl: car.license.backImgUrl,
                  expiredDateLicense: car.license.expiredDateLicense,
                  licenseNumber: car.license.licenseNumber,
                  category: car.license.category,
                  requireGlasses: car.license.requireGlasses,
                  requireHeadphones: car.license.requireHeadphones,
                },
              };
            }
            if (motorcycle) {
              motorcycle = {
                ...motorcycle,
                license: {
                  frontImgUrl: motorcycle.license.frontImgUrl,
                  backImgUrl: motorcycle.license.backImgUrl,
                  expiredDateLicense: motorcycle.license.expiredDateLicense,
                  licenseNumber: motorcycle.license.licenseNumber,
                  category: motorcycle.license.category,
                  requireGlasses: motorcycle.license.requireGlasses,
                  requireHeadphones: motorcycle.license.requireHeadphones,
                },
              };
            }

            if (wasApproved) {
              if (car && motorcycle) {
                vehicles = { ...vehicles, car, motorcycle };
              } else if (car && !motorcycle) {
                vehicles = { ...vehicles, car };
              } else if (!car && motorcycle) {
                vehicles = { ...vehicles, motorcycle };
              }
            }

            if (car && motorcycle) {
              newReqState = {
                ...newReqState,
                driveCar: serviceReqState,
                driveMotorcycle: serviceReqState,
              };
            } else if (car && !motorcycle) {
              newReqState = {
                ...newReqState,
                driveCar: serviceReqState,
              };
            } else if (!car && motorcycle) {
              newReqState = {
                ...newReqState,
                driveMotorcycle: serviceReqState,
              };
            }

            var userToUpdate: Partial<UserInterface> = {};
            if (
              wasApproved &&
              !requesterUser.services.includes(Services.Driver)
            ) {
              const currentDate = new Date();
              const cutoffDate = new Date(2026, 3, 2); // 1 de febrero de 2026 (mes 1 = febrero)
              cutoffDate.setHours(23, 59, 59, 999); // Hasta las 23:59:59 del día 1 de febrero

              // Solo agregar saldo con expiración si la fecha actual es menor o igual al 1 de febrero de 2026
              if (currentDate <= cutoffDate) {
                // 1. Definimos la fecha límite: 6 de Febrero de 2026
                const currentYear = new Date().getFullYear();
                const deadline = new Date(currentYear, 1, 6); // (Año, Mes 0-index, Día) -> 1 es Febrero
                const now = new Date();

                let expirationDate: Date;

                if (now < deadline) {
                  // Si es ANTES del 6 de feb: sumar 3 meses al 6 de feb
                  expirationDate = new Date(deadline);
                  expirationDate.setMonth(expirationDate.getMonth() + 3);
                } else {
                  // Si ya es 6 de feb o después: sumar 3 meses desde hoy
                  expirationDate = new Date(now);
                  expirationDate.setMonth(expirationDate.getMonth() + 3);
                }

                // 2. Actualizamos el objeto
                userToUpdate = {
                  ...userToUpdate,
                  services: [...requesterUser.services, Services.Driver],
                  balanceWithExpiration: {
                    balance: {
                      currency: "Bs. (BOB)",
                      amount: 200,
                    },
                    expirationDate: Timestamp.fromDate(expirationDate),
                  },
                };
              } else {
                userToUpdate = {
                  ...userToUpdate,
                  services: [...requesterUser.services, Services.Driver],
                };
              }
            }

            if (req.driverEnterprise) {
              userToUpdate = {
                ...userToUpdate,
                driverEnterpriseId: req.driverEnterprise,
              };
            }

            if (vehicles && newReqState) {
              userToUpdate = {
                ...userToUpdate,
                serviceVehicles: vehicles,
                serviceRequests: newReqState,
              };
            } else {
              userToUpdate = {
                ...userToUpdate,
                serviceRequests: newReqState,
              };
            }

            if (wasApproved) {
              userToUpdate = await setFirstService(
                requesterUser,
                userToUpdate,
                adminUser.id,
              );
            }

            userToUpdate.fullName = req.newFullName;
            userToUpdate.fullNameArrayLower = generateKeywords(req.newFullName);
            userToUpdate.photoUrl = req.newProfilePhotoImgUrl as RefAttachment;
            userToUpdate.addressPhoto = req.addressPhoto as RefAttachment;
            userToUpdate.homeAddress = req.homeAddress;
            userToUpdate.bloodType = req.bloodType ?? BloodTypes.OPositive;

            await updateUser(serviceReq.userId, userToUpdate);
            if (enterprise && wasApproved) {
              await toast.promise(
                addUserServerToEnterprise(
                  enterprise,
                  serviceReq.userId,
                  getIdSaved(requesterUser.fakeId),
                ),
                {
                  pending:
                    "Agregando al usuario al servicio como proveedor de servicios",
                  success: "Usuario agregado al servicio",
                  error: "Error al agregar al usuario al servicio",
                },
              );
            }

            if (wasApproved) {
              await notifyRequestApprovalUser(requesterUser, "driver");
            }
          } else {
            toast.error("El usuario no fue encontrado");
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getVehicle = (type: VehicleType): Vehicle | null => {
    if (currentReq.vehicles) {
      const vehicles = currentReq.vehicles.filter(
        (veh) => veh.type.type === type,
      );
      if (vehicles.length > 0) {
        return vehicles[0];
      }
    }

    return null;
  };

  const review = async (wasApproved: boolean) => {
    setReviewState({
      ...reviewState,
      loading: true,
    });
    try {
      await deleteImagesIfLimitOfApproves(currentReq);
      await toast.promise(saveReviewHistory(currentReq, wasApproved), {
        pending: "Registrando revision, por favor espera",
        success: "Revision registrada",
        error: "Error al registrar revision, vuelve a intentarlo por favor",
      });
      setReviewState({
        loading: false,
        reviewed: true,
      });
    } catch (e) {
      setReviewState({
        loading: false,
        reviewed: false,
      });
    }
  };

  const approve = async () => {
    if (!reviewState.loading) {
      await review(true);
    }
  };

  const decline = async () => {
    if (!reviewState.loading) {
      await review(false);
    }
  };

  useEffect(() => {
    getUserById(serviceReq.userId).then((res) => {
      if (res) {
        setRequesterUser(res);
      } else {
        setRequesterUser(undefined);
      }
    });
  }, [serviceReq.userId]);

  useEffect(() => {
    setEditValues({
      newFullName: serviceReq.newFullName ?? "",
      homeAddress: serviceReq.homeAddress ?? "",
      location: serviceReq.location ?? Locations.CochabambaBolivia,
    });
    setEditPhoto(serviceReq.newProfilePhotoImgUrl ?? "");
  }, [serviceReq]);

  useEffect(() => {
    const fetchDriverEnterprise = async () => {
      if (serviceReq.driverEnterprise) {
        try {
          const data = await getEnterpriseById(serviceReq.driverEnterprise);
          setEnterpise(data);
        } catch (e) {
          setEnterpise(undefined);
        }
      } else {
        setEnterpise(undefined);
      }
    };
    fetchDriverEnterprise();
  }, [serviceReq.driverEnterprise]);

  return (
    <div className="service-form-wrapper | max-width-60">
      <div className="row-wrapper | between items-center">
        <h1 className="text | big bold">Solicitud para ser {DRIVER}</h1>
        <div className="row-wrapper | gap-8">
          <button
            className="general-button gray"
            onClick={() => {
              if (isEditing) {
                resetEdits();
              }
              setIsEditing((s) => !s);
            }}
            type="button"
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
          {isEditing && (
            <button
              className="general-button green"
              onClick={async () => {
                setEditLoading(true);
                try {
                  const updatedReq: UserRequest = {
                    ...serviceReq,
                    newFullName: editValues.newFullName,
                    homeAddress: editValues.homeAddress,
                    location: editValues.location,
                    newProfilePhotoImgUrl: editPhoto,
                  };
                  await saveDriveReq(serviceReq.id, updatedReq);
                  toast.success("Cambios guardados en la solicitud");
                  setIsEditing(false);
                } catch (e) {
                  console.error(e);
                  toast.error("Error al guardar los cambios");
                } finally {
                  setEditLoading(false);
                }
              }}
              type="button"
              disabled={editLoading || photoUploadLoading}
            >
              {editLoading ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="form-sub-container | card padded gap-16 margin-bottom-20">
          <h2 className="text | medium bold">Editar datos de la solicitud</h2>

          <div className="row-wrapper | gap-16 wrap items-center">
            <ImageRenderer
              content={{
                image: editPhoto,
                legend: "Foto de perfil",
                noFoundReason: "No se encontró la foto de perfil",
              }}
              imageInCircle={true}
            />
            <label
              className="general-button white bordered"
              style={{ cursor: "pointer" }}
            >
              {photoUploadLoading ? "Subiendo..." : "Cambiar foto"}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={photoUploadLoading}
                onChange={async (e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  if (!file) return;
                  setPhotoUploadLoading(true);
                  try {
                    const base64 = await toBase64(file);
                    const uploaded = await uploadFileBase64(
                      DirectoryPath.TempProfilePhotos,
                      base64,
                    );
                    setEditPhoto(uploaded);
                    toast.success("Nueva foto cargada");
                  } catch (err) {
                    console.error(err);
                    toast.error("No se pudo cargar la foto");
                  } finally {
                    setPhotoUploadLoading(false);
                    e.target.value = "";
                  }
                }}
              />
            </label>
          </div>

          <fieldset className="form-section">
            <input
              className="form-section-input"
              value={editValues.newFullName}
              onChange={(e) =>
                setEditValues((prev) => ({
                  ...prev,
                  newFullName: e.target.value,
                }))
              }
              placeholder="Ej: Juan Pérez Gómez"
              autoComplete="off"
              type="text"
            />
            <legend className="form-section-legend">Nombre completo</legend>
            <small className="text | light">
              Corrige typos o ajusta el orden de apellidos.
            </small>
          </fieldset>

          <fieldset className="form-section">
            <input
              className="form-section-input"
              value={editValues.homeAddress}
              onChange={(e) =>
                setEditValues((prev) => ({
                  ...prev,
                  homeAddress: e.target.value,
                }))
              }
              placeholder="Calle, número y zona"
              autoComplete="off"
              type="text"
            />
            <legend className="form-section-legend">Dirección</legend>
            <small className="text | light">
              Usa la dirección de cobro o domicilio principal.
            </small>
          </fieldset>

          <fieldset className="form-section | select-item">
            <select
              className="form-section-input"
              value={editValues.location}
              onChange={(e) =>
                setEditValues((prev) => ({
                  ...prev,
                  location: e.target.value as Locations,
                }))
              }
            >
              {locationList.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <legend className="form-section-legend">Ciudad</legend>
            <small className="text | light">
              Elige la ciudad de operación del conductor.
            </small>
          </fieldset>
        </div>
      )}
      <div className="row-wrapper | gap-20">
        <ApprovalsRenderer
          serviceReq={serviceReq}
          reviewed={reviewState.reviewed}
        />
        <UserStateWithMessageRenderer userData={requesterUser} />
      </div>
      {requesterUser && <UserStateRenderer user={requesterUser} />}

      <BaseFormWithTwoButtons
        content={{
          firstButton: {
            content: {
              legend: "Rechazar",
              buttonClassStyle: wasReviewed()
                ? "hidden"
                : "general-button gray",
              loaderClassStyle: "loader-gray",
            },
            behavior: {
              loading: reviewState.loading,
              setLoading: (l) =>
                setReviewState((prev) => ({
                  ...prev,
                  loading: l,
                })),
              isValid: !wasReviewed(),
              action: decline,
            },
          },
          secondButton: {
            content: {
              legend: "Aprobar",
              buttonClassStyle:
                wasReviewed() || requesterUser?.deleted || enterprise?.deleted
                  ? "hidden"
                  : undefined,
            },
            behavior: {
              loading: reviewState.loading,
              setLoading: (l) =>
                setReviewState((prev) => ({
                  ...prev,
                  loading: l,
                })),
              isValid: !wasReviewed(),
              action: approve,
            },
          },
        }}
        behavior={{
          loading: reviewState.loading,
        }}
      >
        <PersonalDataRenderer
          location={currentReq.location}
          homeAddress={currentReq.homeAddress}
          addressPhoto={currentReq.addressPhoto}
          name={currentReq.newFullName}
          photo={currentReq.newProfilePhotoImgUrl}
          bloodType={requesterUser?.bloodType}
          alternativePhoneNumber={
            requesterUser?.alternativePhoneNumber
              ? parseBoliviaPhone(
                  (requesterUser?.alternativePhoneNumber?.countryCode ?? "") +
                    (requesterUser?.alternativePhoneNumber?.number ?? ""),
                ).number
              : ""
          }
          alternativePhoneNumberName={
            requesterUser?.alternativePhoneNumberName ?? ""
          }
        />

        {requesterUser ? (
          <IdCardRenderer idCard={requesterUser.identityCard} />
        ) : (
          <span className="row-wrapper text | bold gray-medium">
            <span className="loader-gray-medium | small-loader"></span> Cargando
            carnet de identidad
          </span>
        )}

        <SelfieRenderer image={serviceReq.realTimePhotoImgUrl} />
        {currentReq.vehicles && (
          <VehiclesWithCategoryRenderer vehicles={currentReq.vehicles} />
        )}

        <PDFRenderer
          pdf={{
            ref: currentReq.policeRecordsPdf?.ref ?? "",
            url: currentReq.policeRecordsPdf?.url ?? "",
          }}
          legend="Antecedentes policiales"
        />

        {enterprise === null ? (
          <span className="loader-green"></span>
        ) : (
          <DriverEnterpriseRenderer driverEnterprise={enterprise} />
        )}

        {requesterUser ? (
          <UserContactsRendererForForm
            email={requesterUser.email}
            phoneNumber={flatPhone(requesterUser.phoneNumber)}
            alternativePhoneNumber={flatPhone(
              requesterUser.alternativePhoneNumber,
            )}
          />
        ) : (
          <span className="row-wrapper text | bold gray-medium">
            <span className="loader-gray-medium | small-loader"></span> Cargando
            formas de contacto con el usuario
          </span>
        )}

        {requesterUser && (
          <UserStateWithMessageRenderer userData={requesterUser} />
        )}
      </BaseFormWithTwoButtons>
    </div>
  );
};

export default DriverReviewForm;
