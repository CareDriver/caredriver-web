"use client";
import { AuthContext } from "@/context/AuthContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserInterface } from "@/interfaces/UserInterface";
import {
  getUserById,
  updateUser,
} from "@/components/app_modules/users/api/UserRequester";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteFile } from "@/utils/requesters/FileUploader";
import { ChangePhotoReqInterface } from "@/interfaces/ChangePhotoReq";
import {
  deleteChangePhotoReq,
  getUpPhotoReqById,
} from "@/components/app_modules/users/api/ChangePhotoRequester";
import ImageRenderer from "../../../../../form/view/field_renderers/ImageRenderer";
import UserStateRenderer from "../../data_renderers/for_user_data/UserStateRenderer";
import UserStateWithMessageRenderer from "../../data_renderers/for_user_data/UserStateWithMessageRenderer";
import Camera from "@/icons/Camera";
import PersonalDataRenderer from "@/components/app_modules/users/views/data_renderers/for_user_data/PersonalDataRenderer";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import PageLoading from "@/components/loaders/PageLoading";
import BaseFormWithTwoButtons from "@/components/form/view/forms/BaseFormWithTwoButtons";
import { isNull } from "@/validators/NullDataValidator";
import { routeToUserRequestsToRenewPhotoAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import { Unsubscribe } from "firebase/firestore";
import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";

const ReviewFormToRenewUserPhoto = ({ reqId }: { reqId: string }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [req, setReq] = useState<ChangePhotoReqInterface | null>(null);
  const [userReq, setUserReq] = useState<UserInterface | null>(null);
  const router = useRouter();

  const faildRedirect = useCallback(
    (reason: string) => {
      toast.error(reason);
      router.push(routeToUserRequestsToRenewPhotoAsAdmin());
    },
    [router],
  );

  const fetchUserReq = useCallback(async () => {
    if (req) {
      try {
        const userRes = await getUserById(req.userId);
        if (userRes) {
          setUserReq(userRes);
        } else {
          faildRedirect("No se encontró al usuario");
        }
      } catch (e) {
        faildRedirect("Petición no encontrada");
      }
    }
  }, [setUserReq, faildRedirect, req]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    getUpPhotoReqById(reqId, {
      onFound: setReq,
      onNotFound: () => {
        faildRedirect("Petición no encontrada");
      },
    })
      .then((u) => {
        unsubscribe = u;
      })
      .catch(() => faildRedirect("Petición no encontrada"));

    return () => unsubscribe && unsubscribe();
  }, [faildRedirect, reqId]);

  useEffect(() => {
    fetchUserReq();
  }, [req, fetchUserReq]);

  const review = async (wasApproved: boolean) => {
    if (user && req && userReq && userReq.id) {
      setLoading(true);
      try {
        if (wasApproved) {
          await updateUser(userReq.id, {
            photoUrl: req.newPhoto,
          });
        } else if (req.newPhoto.ref !== "") {
          await deleteFile(req.newPhoto.ref);
        }
        await deleteChangePhotoReq(req.id);
        router.push(routeToUserRequestsToRenewPhotoAsAdmin());
      } catch (e) {
        setLoading(false);
      }
    }
  };

  const approve = async () => {
    if (!loading) {
      await toast.promise(review(true), {
        pending: "Cambiando foto de perfil del usuario",
        success: "Foto cambiada",
        error: "Error al cambiar foto, inténtalo de nuevo por favor",
      });
    }
  };

  const decline = async () => {
    if (!loading) {
      /* await toast.promise(review(false), {
                pending: "Eliminando la foto de perfil",
                success: "Foto eliminada",
                error: "Error al eliminar la foto de perfil, inténtalo de nuevo por favor",
            }); */
    }
  };

  if (!req) {
    return <PageLoading />;
  }

  return (
    <div className="service-form-wrapper | max-width-60">
      <h1 className="text | big bold">
        Solicitud para actualizar foto de perfil
      </h1>

      <UserStateWithMessageRenderer userData={userReq} />

      <BaseFormWithTwoButtons
        content={{
          firstButton: {
            content: {
              legend: "Rechazar",
              buttonClassStyle: !req.active ? "hidden" : "general-button gray",
              loaderClassStyle: "loader-gray",
            },
            behavior: {
              loading: loading || isNull(userReq),
              isValid: !req.active && !isNull(userReq),
              setLoading: (l) => setLoading(l),
              action: decline,
            },
          },
          secondButton: {
            content: {
              legend: "Aprobar",
              buttonClassStyle:
                !req.active || userReq?.deleted ? "hidden" : undefined,
            },
            behavior: {
              loading: loading || isNull(userReq),
              isValid: !req.active && !isNull(userReq),
              setLoading: (l) => setLoading(l),
              action: approve,
            },
          },
        }}
        behavior={{
          loading: loading,
        }}
      >
        {userReq && <UserStateRenderer user={userReq} />}

        {userReq ? (
          <PersonalDataRenderer
            location={userReq.location}
            name={userReq.fullName}
            photo={userReq.photoUrl}
            homeAddress={userReq.homeAddress}
            addressPhoto={userReq.addressPhoto}
            alternativePhoneNumber={
              userReq?.alternativePhoneNumber
                ? parseBoliviaPhone(
                    (userReq?.alternativePhoneNumber?.countryCode ?? "") +
                      (userReq?.alternativePhoneNumber?.number ?? ""),
                  ).number
                : ""
            }
          >
            <TextFieldRenderer
              content={userReq.services.toString().replaceAll(",", " - ")}
              legend="Servicios del usuario"
            />
          </PersonalDataRenderer>
        ) : (
          <span className="loader-green"></span>
        )}

        <div>
          <h2 className="text icon-wrapper | medium-big bold margin-top-25 margin-bottom-25">
            <Camera />
            Nueva Foto de Perfil
          </h2>
          <ImageRenderer
            content={{
              image: req.newPhoto,
              legend: "Foto de Perfil",
              noFoundReason: "No se ha encontrado la nueva foto de perfil",
            }}
            imageInCircle={true}
          />
        </div>

        {/* <p className="text | light margin-top-25">
                    La nueva foto sera eliminada si se rechaza la solicitud
                </p> */}
      </BaseFormWithTwoButtons>
    </div>
  );
};

export default ReviewFormToRenewUserPhoto;
