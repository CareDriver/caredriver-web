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
import { AuthContext } from "@/context/AuthContext";
import {
  getUserById,
  updateUser,
} from "@/components/app_modules/users/api/UserRequester";
import {
  flatPhone,
  ServiceRequestsInterface,
  ServiceVehicles,
  UserInterface,
} from "@/interfaces/UserInterface";
import { VehicleType } from "@/interfaces/VehicleInterface";
import { ServiceReqState, Services } from "@/interfaces/Services";
import { toast } from "react-toastify";
import ApprovalsRenderer from "../../data_renderers/ApprovalsRenderer";
import { towReqCollection } from "@/components/app_modules/server_users/api/TowRequester";
import { Enterprise } from "@/interfaces/Enterprise";
import FieldDeleted from "../../../../../form/view/field_renderers/FieldDeleted";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import UserContactsRendererForForm from "../../../../users/views/data_renderers/for_user_data/UserContactsRendererForForm";
import CraneEnterpriseRenderer from "../../../../enterprises/views/data_renderers/CraneEnterpriseRenderer";
import UserStateWithMessageRenderer from "../../../../users/views/data_renderers/for_user_data/UserStateWithMessageRenderer";
import IdCardRenderer from "../../../../users/views/data_renderers/for_user_data/IdCardRenderer";
import { addUserServerToEnterprise } from "@/components/app_modules/enterprises/api/EnterpriseUserAdder";
import BaseFormWithTwoButtons from "@/components/form/view/forms/BaseFormWithTwoButtons";
import {
  DEFAULT_REVIEW_STATE,
  ReviewState,
} from "@/components/form/models/Reviews";
import { getIdSaved } from "@/utils/generators/IdGenerator";
import UserStateRenderer from "@/components/app_modules/users/views/data_renderers/for_user_data/UserStateRenderer";
import { notifyRequestApprovalUser } from "../../../api/UserServerNotifier";
import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";
import { RefAttachment } from "@/components/form/models/RefAttachment";
import { BloodTypes } from "@/interfaces/BloodTypes";
import { Locations, locationList } from "@/interfaces/Locations";
import { saveTowReq } from "@/components/app_modules/server_users/api/TowRequester";

const CraneOperatorReviewForm = ({
  serviceReq,
}: {
  serviceReq: UserRequest;
}) => {
  const { user: adminUser } = useContext(AuthContext);
  const [reviewState, setReviewState] =
    useState<ReviewState>(DEFAULT_REVIEW_STATE);
  const [enterprise, setEnterpise] = useState<Enterprise | null | undefined>(
    null,
  );
  const [requesterUser, setRequesterUser] = useState<
    UserInterface | null | undefined
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editValues, setEditValues] = useState({
    location: serviceReq.location ?? Locations.CochabambaBolivia,
  });

  const currentReq: UserRequest = {
    ...serviceReq,
    location: editValues.location,
  };

  const resetEdits = () => {
    setEditValues({
      location: serviceReq.location ?? Locations.CochabambaBolivia,
    });
  };

  const wasReviewed = (): boolean => {
    return reviewState.reviewed || !currentReq.active;
  };

  const saveReviewHistory = async (wasApproved: boolean) => {
    try {
      if (adminUser && adminUser.id) {
        const isLimitToReviews: boolean =
          currentReq.reviewedByHistory !== undefined &&
          currentReq.reviewedByHistory.length + 1 === MIN_NUM_OF_APPROVALS;
        await saveReview(
          currentReq,
          adminUser.id,
          wasApproved,
          towReqCollection,
        );

        if (isLimitToReviews) {
          var tow = getVehicle(VehicleType.CAR);
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
              id: serviceReq.id,
              state: wasApproved
                ? ServiceReqState.Approved
                : ServiceReqState.Refused,
            };

            if (tow) {
              tow = {
                ...tow,
                license: {
                  frontImgUrl: tow.license.frontImgUrl,
                  backImgUrl: tow.license.backImgUrl,
                  expiredDateLicense: tow.license.expiredDateLicense,
                  licenseNumber: tow.license.licenseNumber,
                  category: tow.license.category,
                  requireGlasses: tow.license.requireGlasses,
                  requireHeadphones: tow.license.requireHeadphones,
                },
              };
            }

            if (wasApproved && tow) {
              vehicles = { ...vehicles, tow };
            }

            if (tow) {
              newReqState = {
                ...newReqState,
                tow: serviceReqState,
              };
            }

            var userToUpdate: Partial<UserInterface> = {};

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

            if (wasApproved && serviceReq.towEnterprite) {
              userToUpdate = {
                ...userToUpdate,

                towEnterpriseId: serviceReq.towEnterprite,
              };
              if (!requesterUser.services.includes(Services.Tow)) {
                userToUpdate = {
                  ...userToUpdate,
                  services: [...requesterUser.services, Services.Tow],
                };
              }
            }

            userToUpdate.photoUrl =
              currentReq.newProfilePhotoImgUrl as RefAttachment;
            userToUpdate.addressPhoto =
              currentReq.addressPhoto as RefAttachment;
            userToUpdate.homeAddress = currentReq.homeAddress;
            userToUpdate.bloodType =
              currentReq.bloodType ?? BloodTypes.OPositive;

            if (wasApproved) {
              userToUpdate = await setFirstService(
                requesterUser,
                userToUpdate,
                adminUser.id,
              );
            }

            await updateUser(currentReq.userId, userToUpdate);
            if (enterprise && wasApproved) {
              await toast.promise(
                addUserServerToEnterprise(
                  enterprise,
                  currentReq.userId,
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
              await notifyRequestApprovalUser(requesterUser, "tow");
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
      await toast.promise(saveReviewHistory(wasApproved), {
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
    const fetchWorkshop = async () => {
      if (serviceReq.towEnterprite) {
        try {
          const data = await getEnterpriseById(serviceReq.towEnterprite);
          setEnterpise(data);
        } catch (e) {
          setEnterpise(undefined);
          console.log(e);
        }
      } else {
        setEnterpise(undefined);
      }
    };

    fetchWorkshop();
  }, [serviceReq.towEnterprite]);

  useEffect(() => {
    setEditValues({
      location: serviceReq.location ?? Locations.CochabambaBolivia,
    });
  }, [serviceReq]);

  useEffect(() => {
    getUserById(serviceReq.userId).then((res) => {
      if (res) {
        setRequesterUser(res);
      } else {
        setRequesterUser(undefined);
      }
    });
  }, [serviceReq.userId]);

  return (
    <div className="service-form-wrapper | max-width-60">
      <div className="row-wrapper | between items-center">
        <h1 className="text | big bold">Solicitud para ser Operador de Grúa</h1>
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
                    location: editValues.location,
                  };
                  await saveTowReq(serviceReq.id, updatedReq);
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
              disabled={editLoading}
            >
              {editLoading ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="form-sub-container | card padded gap-16 margin-bottom-20">
          <h2 className="text | medium bold">Editar datos de la solicitud</h2>

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
              Elige la ciudad de operación del operador de grúa.
            </small>
          </fieldset>
        </div>
      )}

      <div className="row-wrapper | gap-20">
        <ApprovalsRenderer
          serviceReq={currentReq}
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
          homeAddress={serviceReq.homeAddress}
          addressPhoto={serviceReq.addressPhoto}
          name={serviceReq.newFullName}
          photo={serviceReq.newProfilePhotoImgUrl}
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
        {serviceReq.vehicles && (
          <VehiclesWithCategoryRenderer vehicles={serviceReq.vehicles} />
        )}
        {enterprise === null ? (
          <span className="loader-green"></span>
        ) : enterprise === undefined ? (
          <FieldDeleted description="No se encontró la Empresa Operadora de Grúa, es posible que fue eliminada" />
        ) : (
          <CraneEnterpriseRenderer crane={enterprise} />
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

export default CraneOperatorReviewForm;
