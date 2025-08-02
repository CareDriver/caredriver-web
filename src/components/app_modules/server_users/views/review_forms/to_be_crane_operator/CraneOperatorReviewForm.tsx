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

  const wasReviewed = (): boolean => {
    return reviewState.reviewed || !serviceReq.active;
  };

  const saveReviewHistory = async (wasApproved: boolean) => {
    try {
      if (adminUser && adminUser.id) {
        const isLimitToReviews: boolean =
          serviceReq.reviewedByHistory !== undefined &&
          serviceReq.reviewedByHistory.length + 1 === MIN_NUM_OF_APPROVALS;
        await saveReview(
          serviceReq,
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
              serviceReq.newProfilePhotoImgUrl as RefAttachment;
            userToUpdate.addressPhoto =
              serviceReq.addressPhoto as RefAttachment;
            userToUpdate.homeAddress = serviceReq.homeAddress;
            userToUpdate.bloodType = serviceReq.bloodType ?? "";

            if (wasApproved) {
              userToUpdate = await setFirstService(
                requesterUser,
                userToUpdate,
                adminUser.id,
              );
            }

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
    if (serviceReq.vehicles) {
      const vehicles = serviceReq.vehicles.filter(
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
      await deleteImagesIfLimitOfApproves(serviceReq);
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
      <h1 className="text | big bold">Solicitud para ser Operador de Grúa</h1>
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
          location={serviceReq.location}
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
