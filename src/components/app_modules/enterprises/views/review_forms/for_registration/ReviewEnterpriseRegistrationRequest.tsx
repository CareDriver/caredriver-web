"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import {
  buildDefaultEnterprise,
  CarWashServiceModeRender,
  EnterpriseMember,
  EnterpriseMemberRoleRender,
  EnterpriseRequest,
} from "@/interfaces/Enterprise";
import { updateEnterpriseRequest } from "@/components/app_modules/enterprises/api/EnterpriseRequestRequester";
import { sendEnterpriseReq } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import {
  ENTERPRISE_TO_SPANISH_WITH_DEFINITE_ARTICLE,
  ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE,
} from "../../../utils/EnterpriseSpanishTranslator";
import BaseFormWithTwoButtons from "@/components/form/view/forms/BaseFormWithTwoButtons";
import {
  DEFAULT_REVIEW_STATE,
  ReviewState,
} from "@/components/form/models/Reviews";
import { routeToEnterpriseRegistrationRequestsAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import { toast } from "react-toastify";
import { ServiceType } from "@/interfaces/Services";

interface Props {
  request: EnterpriseRequest;
}

const ReviewEnterpriseRegistrationRequest: React.FC<Props> = ({ request }) => {
  const { user } = useContext(AuthContext);
  const [reviewState, setReviewState] =
    useState<ReviewState>(DEFAULT_REVIEW_STATE);
  const router = useRouter();

  const wasReviewed = (): boolean => {
    return reviewState.reviewed || !request.active;
  };

  const approve = async () => {
    if (reviewState.loading || !user?.id) return;
    setReviewState((prev) => ({ ...prev, loading: true }));
    try {
      const enterprise = buildDefaultEnterprise(request, user.id);
      await toast.promise(sendEnterpriseReq(request.id, enterprise), {
        pending: `Aprobando ${ENTERPRISE_TO_SPANISH_WITH_DEFINITE_ARTICLE[request.type]}...`,
        success: "Empresa aprobada y creada correctamente",
        error: "Error al aprobar la empresa",
      });
      await updateEnterpriseRequest(request.id, {
        active: false,
        aproved: true,
        aprovedBy: user.id,
      });
      setReviewState({ loading: false, reviewed: true });
      router.push(routeToEnterpriseRegistrationRequestsAsAdmin(request.type));
    } catch (e) {
      console.error(e);
      setReviewState((prev) => ({ ...prev, loading: false }));
    }
  };

  const decline = async () => {
    if (reviewState.loading || !user?.id) return;
    setReviewState((prev) => ({ ...prev, loading: true }));
    try {
      await toast.promise(
        updateEnterpriseRequest(request.id, {
          active: false,
          aproved: false,
          aprovedBy: user.id,
        }),
        {
          pending: `Rechazando solicitud...`,
          success: "Solicitud rechazada",
          error: "Error al rechazar la solicitud",
        },
      );
      setReviewState({ loading: false, reviewed: true });
      router.push(routeToEnterpriseRegistrationRequestsAsAdmin(request.type));
    } catch (e) {
      console.error(e);
      setReviewState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <section className="service-form-wrapper | max-width-60">
      <h1 className="text | big-medium bold margin-bottom-25 capitalize">
        Solicitud de registro de{" "}
        {ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE[request.type]}
      </h1>

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
                setReviewState((prev) => ({ ...prev, loading: l })),
              isValid: !wasReviewed(),
              action: decline,
            },
          },
          secondButton: {
            content: {
              legend: "Aprobar",
              buttonClassStyle: wasReviewed() ? "hidden" : undefined,
            },
            behavior: {
              loading: reviewState.loading,
              setLoading: (l) =>
                setReviewState((prev) => ({ ...prev, loading: l })),
              isValid: !wasReviewed(),
              action: approve,
            },
          },
        }}
        behavior={{ loading: reviewState.loading }}
      >
        {/* Enterprise data */}
        <div className="card padded margin-bottom-15">
          <h2 className="text | medium-big bold">Datos de la Empresa</h2>
          <div className="margin-top-10">
            <p className="text">
              <b>Nombre:</b> {request.name}
            </p>
            {request.description && (
              <p className="text margin-top-5">
                <b>Descripción:</b> {request.description}
              </p>
            )}
            {request.phone && (
              <p className="text margin-top-5">
                <b>Teléfono:</b>{" "}
                {request.phoneCountryCode ? `${request.phoneCountryCode} ` : ""}
                {request.phone}
              </p>
            )}
            {request.location && (
              <p className="text margin-top-5">
                <b>Ubicación:</b> {request.location}
              </p>
            )}
            {request.latitude != null && request.longitude != null && (
              <p className="text margin-top-5">
                <b>Coordenadas:</b> {request.latitude}, {request.longitude}
              </p>
            )}
          </div>
          {request.logoImgUrl?.url && (
            <div className="margin-top-10">
              <p className="text | bold">Logo:</p>
              <img
                src={request.logoImgUrl.url}
                alt="Logo de empresa"
                style={{
                  maxWidth: 200,
                  maxHeight: 200,
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
            </div>
          )}
        </div>

        {/* Car wash mode */}
        {request.carWashServiceMode && (
          <div className="card padded margin-bottom-15">
            <h3 className="text | bold">Modalidad de Lavado</h3>
            <p className="text margin-top-5">
              {CarWashServiceModeRender[request.carWashServiceMode]}
            </p>
          </div>
        )}

        {/* Mechanic data */}
        {request.mechanicSubServices &&
          request.mechanicSubServices.length > 0 && (
            <div className="card padded margin-bottom-15">
              <h3 className="text | bold">Subservicios Mecánicos</h3>
              <ul className="margin-top-5" style={{ paddingLeft: "1.5rem" }}>
                {request.mechanicSubServices.map((sub, i) => (
                  <li key={i} className="text">
                    {sub}
                  </li>
                ))}
              </ul>
              {request.mechanicTools && (
                <p className="text margin-top-10">
                  <b>Herramientas:</b> {request.mechanicTools}
                </p>
              )}
            </div>
          )}

        {request.mechanicToolEvidences &&
          request.mechanicToolEvidences.length > 0 && (
            <div className="card padded margin-bottom-15">
              <h3 className="text | bold">Evidencia de Herramientas</h3>
              <div className="margin-top-10">
                {request.mechanicToolEvidences.map((tool, i) => (
                  <div key={i} className="margin-bottom-10">
                    <p className="text">
                      <b>{tool.name}</b>
                    </p>
                    {tool.photo?.url && (
                      <img
                        src={tool.photo.url}
                        alt={tool.name}
                        style={{
                          maxWidth: 150,
                          maxHeight: 150,
                          objectFit: "contain",
                          borderRadius: 4,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Tow vehicle photos */}
        {request.towVehiclePhotos && request.towVehiclePhotos.length > 0 && (
          <div className="card padded margin-bottom-15">
            <h3 className="text | bold">Fotos de Vehículos (Remolque)</h3>
            <div
              className="row-wrapper | gap-10 margin-top-10"
              style={{ flexWrap: "wrap" }}
            >
              {request.towVehiclePhotos.map(
                (vp, i) =>
                  vp?.url && (
                    <img
                      key={i}
                      src={vp.url}
                      alt={`Vehículo ${i + 1}`}
                      style={{
                        maxWidth: 150,
                        maxHeight: 150,
                        objectFit: "contain",
                        borderRadius: 4,
                      }}
                    />
                  ),
              )}
            </div>
          </div>
        )}

        {/* Members */}
        <div className="margin-top-25">
          <h2 className="text | medium-big bold margin-bottom-15">
            Miembros ({request.members.length})
          </h2>
          {request.members.map((member, i) => (
            <MemberCard key={i} member={member} index={i} />
          ))}
        </div>

        {/* Admin/collaborator IDs summary */}
        <div className="card padded margin-top-15">
          <p className="text">
            <b>IDs de Admins:</b> {request.adminUserIds.join(", ") || "Ninguno"}
          </p>
          <p className="text margin-top-5">
            <b>IDs de Colaboradores:</b>{" "}
            {request.collaboratorUserIds.join(", ") || "Ninguno"}
          </p>
        </div>

        {!wasReviewed() && (
          <p className="text | light margin-top-25">
            Al <b>aprobar</b>, se creará la empresa con todos sus datos y
            miembros. Al <b>rechazar</b>, se descartará la solicitud.
          </p>
        )}
      </BaseFormWithTwoButtons>
    </section>
  );
};

// ─── Member sub-card ────────────────────────────────────────────────────────

const MemberCard = ({
  member,
  index,
}: {
  member: EnterpriseMember;
  index: number;
}) => {
  return (
    <div
      className="card padded margin-bottom-15"
      style={{ border: "1px solid #ddd" }}
    >
      <h3 className="text | bold">
        {EnterpriseMemberRoleRender[member.role]}
        {member.isAlsoCollaborator && " + Colaborador"} — {member.fullName}
      </h3>
      <p className="text | light margin-top-5">
        ID: {member.fakeUserId} | Aceptado: {member.accepted ? "Sí" : "No"} |
        Requiere revisión: {member.requiresAdminReview ? "Sí" : "No"}
      </p>

      {/* Photos */}
      <div
        className="row-wrapper | gap-10 margin-top-10"
        style={{ flexWrap: "wrap" }}
      >
        {member.profilePhoto?.url && (
          <div>
            <p className="text | light">Foto de perfil</p>
            <img
              src={member.profilePhoto.url}
              alt="Perfil"
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
        )}
        {member.identityCardFront?.url && (
          <div>
            <p className="text | light">Carnet (Frente)</p>
            <img
              src={member.identityCardFront.url}
              alt="CI Frente"
              style={{ maxWidth: 120, borderRadius: 4 }}
            />
          </div>
        )}
        {member.identityCardBack?.url && (
          <div>
            <p className="text | light">Carnet (Reverso)</p>
            <img
              src={member.identityCardBack.url}
              alt="CI Reverso"
              style={{ maxWidth: 120, borderRadius: 4 }}
            />
          </div>
        )}
        {member.addressPhoto?.url && (
          <div>
            <p className="text | light">Factura de luz</p>
            <img
              src={member.addressPhoto.url}
              alt="Dirección"
              style={{ maxWidth: 120, borderRadius: 4 }}
            />
          </div>
        )}
      </div>

      {member.homeAddress && (
        <p className="text margin-top-5">
          <b>Dirección:</b> {member.homeAddress}
        </p>
      )}
      {member.experience && (
        <p className="text margin-top-5">
          <b>Experiencia:</b> {member.experience}
        </p>
      )}

      {/* License */}
      {member.license && (
        <div className="margin-top-10">
          <p className="text | bold">Licencia de Conducir</p>
          {member.license.licenseNumber && (
            <p className="text margin-top-5">
              Nro: {member.license.licenseNumber}
            </p>
          )}
          <div
            className="row-wrapper | gap-10 margin-top-5"
            style={{ flexWrap: "wrap" }}
          >
            {member.license.frontImgUrl?.url && (
              <img
                src={member.license.frontImgUrl.url}
                alt="Licencia Frente"
                style={{ maxWidth: 120, borderRadius: 4 }}
              />
            )}
            {member.license.backImgUrl?.url && (
              <img
                src={member.license.backImgUrl.url}
                alt="Licencia Reverso"
                style={{ maxWidth: 120, borderRadius: 4 }}
              />
            )}
          </div>
        </div>
      )}

      {/* Police records */}
      {member.policeRecordsPdf?.url && (
        <div className="margin-top-10">
          <p className="text | bold">Antecedentes Policiales</p>
          <img
            src={member.policeRecordsPdf.url}
            alt="Antecedentes"
            style={{ maxWidth: 150, borderRadius: 4 }}
          />
        </div>
      )}

      {/* Technical title */}
      {member.technicalTitle && (
        <div className="margin-top-10">
          <p className="text | bold">Título Técnico</p>
          <p className="text">{member.technicalTitle.titleName}</p>
          {member.technicalTitle.photo?.url && (
            <img
              src={member.technicalTitle.photo.url}
              alt="Título"
              style={{ maxWidth: 150, borderRadius: 4 }}
            />
          )}
        </div>
      )}

      {/* Vehicle photos */}
      {member.vehiclePhotos && member.vehiclePhotos.length > 0 && (
        <div className="margin-top-10">
          <p className="text | bold">Fotos de Vehículo</p>
          <div
            className="row-wrapper | gap-10 margin-top-5"
            style={{ flexWrap: "wrap" }}
          >
            {member.vehiclePhotos.map(
              (vp, vi) =>
                vp?.url && (
                  <img
                    key={vi}
                    src={vp.url}
                    alt={`Vehículo ${vi + 1}`}
                    style={{ maxWidth: 120, borderRadius: 4 }}
                  />
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewEnterpriseRegistrationRequest;
