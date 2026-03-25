import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { Services, ServiceType } from "@/interfaces/Services";
import { timestampDateInSpanishWithHour } from "@/utils/helpers/DateHelper";
import { flatPhone } from "@/interfaces/UserInterface";
import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { routeToServicePerformed } from "@/utils/route_builders/for_services/RouteBuilderForServices";
import Link from "next/link";
import LocationDot from "@/icons/LocationDot";
import Clock from "@/icons/Clock";
import UserIcon from "@/icons/UserIcon";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

interface ProposalUserInfo {
  name?: string;
  fullName?: string;
  photoUrl?: string;
  phoneNumber?: string | { codeCountry?: string; phone?: string };
}

interface ProposalCardData {
  id: string;
  userServiceInfo?: ProposalUserInfo;
  offeredPrice?: {
    amount?: number;
    price?: number;
    currency?: string;
  };
  createdAt?: { toDate: () => Date };
}

interface TimestampItem {
  key: string;
  label: string;
  timestamp?: { toDate: () => Date };
}

type TimestampLike =
  | { toDate: () => Date }
  | { seconds?: number; nanoseconds?: number }
  | Date
  | string
  | number
  | undefined;

const normalizeTimestamp = (timestamp: TimestampLike) => {
  if (!timestamp) return undefined;

  if (typeof (timestamp as { toDate?: () => Date }).toDate === "function") {
    return timestamp as { toDate: () => Date };
  }

  if (timestamp instanceof Date) {
    return { toDate: () => timestamp };
  }

  if (typeof timestamp === "string" || typeof timestamp === "number") {
    const parsedDate = new Date(timestamp);
    if (!Number.isNaN(parsedDate.getTime())) {
      return { toDate: () => parsedDate };
    }
    return undefined;
  }

  const timestampAsObject = timestamp as {
    seconds?: number;
    nanoseconds?: number;
  };
  if (typeof timestampAsObject.seconds === "number") {
    const milliseconds =
      timestampAsObject.seconds * 1000 +
      (timestampAsObject.nanoseconds || 0) / 1000000;
    return { toDate: () => new Date(milliseconds) };
  }

  return undefined;
};

const getComputedServiceFlags = (service: ServiceRequestInterface) => {
  const dynamicCanceledAt = (
    service as ServiceRequestInterface & {
      canceledAt?: TimestampLike;
    }
  ).canceledAt;
  const dynamicStartedAt = (
    service as ServiceRequestInterface & {
      startAt?: TimestampLike;
      started_at?: TimestampLike;
    }
  ).startAt;

  const startedAtTimestamp =
    normalizeTimestamp(service.startedAt as TimestampLike) ||
    normalizeTimestamp(dynamicStartedAt) ||
    normalizeTimestamp(
      (service as ServiceRequestInterface & { started_at?: TimestampLike })
        .started_at,
    );
  const acceptedAtTimestamp = normalizeTimestamp(
    service.acceptedAt as TimestampLike,
  );
  const finishedAtTimestamp = normalizeTimestamp(
    service.finishedAt as TimestampLike,
  );
  const canceledAtTimestamp = normalizeTimestamp(dynamicCanceledAt);

  return {
    started: Boolean(service.started) || Boolean(startedAtTimestamp),
    accepted: Boolean(service.accepted) || Boolean(acceptedAtTimestamp),
    finished: Boolean(service.finished) || Boolean(finishedAtTimestamp),
    canceled: Boolean(service.canceled) || Boolean(canceledAtTimestamp),
    startedAtTimestamp,
    acceptedAtTimestamp,
    finishedAtTimestamp,
    canceledAtTimestamp,
  };
};

const getServiceStatusColor = (service: ServiceRequestInterface): string => {
  const { finished, canceled, started, accepted } =
    getComputedServiceFlags(service);
  if (finished) return "status-finished";
  if (canceled) return "status-canceled";
  if (started) return "status-started";
  if (accepted) return "status-accepted";
  return "status-pending";
};

const getServiceStatusLabel = (service: ServiceRequestInterface): string => {
  const { finished, canceled, started, accepted } =
    getComputedServiceFlags(service);
  if (finished) return "Finalizado";
  if (canceled) return "Cancelado";
  if (started) return "En curso";
  if (accepted) return "Aceptado";
  return "Esperando propuesta";
};

const getCancelationInfo = (
  service: ServiceRequestInterface,
): string | null => {
  const { canceled, accepted } = getComputedServiceFlags(service);
  if (!canceled) return null;

  // Si no hay proveedor asignado, fue cancelado por el usuario
  if (!service.serviceUserId || service.serviceUserId === "") {
    return "Cancelado por el usuario";
  }

  // Si hay proveedor pero no se aceptó, también fue cancelado por el usuario
  if (!accepted) {
    return "Cancelado por el usuario";
  }

  // Si ya fue aceptado y hay proveedor, asumimos que fue cancelado por el proveedor
  // (esto es una suposición basada en la lógica del negocio)
  return "Cancelado por el proveedor";
};

const AdminServiceCard = ({
  service,
  serviceType,
}: {
  service: ServiceRequestInterface;
  serviceType: Services;
}) => {
  const [proposals, setProposals] = useState<ProposalCardData[]>([]);
  const [showProposalsModal, setShowProposalsModal] = useState(false);

  const getServiceTypeRoute = (): ServiceType => {
    switch (serviceType) {
      case Services.Driver:
        return "driver";
      case Services.Mechanic:
        return "mechanical";
      case Services.Tow:
        return "tow";
      case Services.Laundry:
        return "laundry";
      default:
        return "driver";
    }
  };

  const getProposalCollectionName = (): string => {
    switch (serviceType) {
      case Services.Driver:
        return Collections.ProposalsDriver;
      case Services.Mechanic:
        return Collections.ProposalsMechanic;
      case Services.Tow:
        return Collections.ProposalTow;
      case Services.Laundry:
        return Collections.ProposalCarWash;
      default:
        return Collections.Proposals;
    }
  };

  const getServiceTypeSpanish = (): string => {
    switch (serviceType) {
      case Services.Driver:
        return "Conductor";
      case Services.Mechanic:
        return "Mecánico";
      case Services.Tow:
        return "Grúa";
      case Services.Laundry:
        return "Lavadero";
      default:
        return "Servicio";
    }
  };

  const formatDateTime = () => {
    if (!service.createdAt) return "Sin fecha";

    return timestampDateInSpanishWithHour(service.createdAt as any);
  };

  const formatAnyTimestamp = (timestamp?: { toDate: () => Date }) => {
    if (!timestamp) return "";
    return timestampDateInSpanishWithHour(timestamp as any);
  };

  const servicePrice = service.price?.amount ?? service.price?.price ?? 0;
  const hasPriceRange =
    typeof service.priceRange?.min === "number" &&
    typeof service.priceRange?.max === "number";

  const uniqueProposals = useMemo(() => {
    const proposalsMap = new Map<string, ProposalCardData>();
    proposals.forEach((proposal) => proposalsMap.set(proposal.id, proposal));
    return Array.from(proposalsMap.values());
  }, [proposals]);

  const timelineItems = useMemo<TimestampItem[]>(() => {
    const {
      acceptedAtTimestamp,
      startedAtTimestamp,
      finishedAtTimestamp,
      canceledAtTimestamp,
    } = getComputedServiceFlags(service);

    const allItems: TimestampItem[] = [
      {
        key: "createdAt",
        label: "Solicitado",
        timestamp: normalizeTimestamp(service.createdAt as TimestampLike),
      },
      {
        key: "acceptedAt",
        label: "Aceptado",
        timestamp: acceptedAtTimestamp,
      },
      {
        key: "startedAt",
        label: "Iniciado",
        timestamp: startedAtTimestamp,
      },
      {
        key: "finishedAt",
        label: "Finalizado",
        timestamp: finishedAtTimestamp,
      },
      {
        key: "canceledAt",
        label: "Cancelado",
        timestamp: canceledAtTimestamp,
      },
      {
        key: "dateTime",
        label: "Hora programada",
        timestamp: normalizeTimestamp(service.dateTime as TimestampLike),
      },
    ];

    return allItems.filter((item) => !!item.timestamp);
  }, [service]);

  useEffect(() => {
    if (!showProposalsModal || !service.id) return;

    const proposalCollectionName = getProposalCollectionName();
    if (!proposalCollectionName || proposalCollectionName.trim().length === 0) {
      setProposals([]);
      return;
    }

    const proposalCollection = collection(firestore, proposalCollectionName);

    const byServiceIdQuery = query(
      proposalCollection,
      where("serviceId", "==", service.id),
      orderBy("createdAt", "desc"),
    );

    const byTripIdQuery = query(
      proposalCollection,
      where("tripId", "==", service.id),
      orderBy("createdAt", "desc"),
    );

    let serviceIdResults: ProposalCardData[] = [];
    let tripIdResults: ProposalCardData[] = [];

    const mergeResults = () => {
      setProposals([...serviceIdResults, ...tripIdResults]);
    };

    const unsubscribeByServiceId = onSnapshot(byServiceIdQuery, (snapshot) => {
      serviceIdResults = snapshot.docs.map((doc) => ({
        ...(doc.data() as ProposalCardData),
        id: doc.id,
      }));
      mergeResults();
    });

    const unsubscribeByTripId = onSnapshot(byTripIdQuery, (snapshot) => {
      tripIdResults = snapshot.docs.map((doc) => ({
        ...(doc.data() as ProposalCardData),
        id: doc.id,
      }));
      mergeResults();
    });

    return () => {
      unsubscribeByServiceId();
      unsubscribeByTripId();
    };
  }, [service.id, serviceType, showProposalsModal]);

  return (
    <div className="admin-service-card">
      {/* Header con Estado */}
      <div className="admin-service-card-header">
        <span
          className={`service-status-chip ${getServiceStatusColor(service)}`}
        >
          {getServiceStatusLabel(service)}
        </span>
        <span className="service-type-badge">{getServiceTypeSpanish()}</span>
      </div>

      {/* Usuario Solicitante */}
      <div className="admin-service-user-section">
        <div className="admin-service-user-avatar">
          {service.requestUserData?.photoUrl ? (
            <Image
              src={service.requestUserData.photoUrl}
              alt={service.requestUserData?.fullName || "Usuario"}
              width={56}
              height={56}
              className="user-avatar-img"
            />
          ) : (
            <div className="user-avatar-placeholder">
              <UserIcon />
            </div>
          )}
        </div>
        <div className="admin-service-user-info">
          <h4 className="user-name">
            {service.requestUserData?.fullName || "Usuario desconocido"}
          </h4>
          {service.requestUserData?.phoneNumber && (
            <p className="user-phone">
              {typeof service.requestUserData.phoneNumber === "string"
                ? service.requestUserData.phoneNumber
                : flatPhone(service.requestUserData.phoneNumber)}
            </p>
          )}
        </div>
      </div>

      {/* Ubicaciones */}
      <div className="admin-service-locations">
        <div className="location-item">
          <LocationDot />
          <span>
            {service.pickupLocation?.locationName || "Ubicación de recogida"}
          </span>
        </div>
        {service.deliveryLocation && (
          <div className="location-item delivery">
            <LocationDot />
            <span>{service.deliveryLocation?.locationName}</span>
          </div>
        )}
      </div>

      {/* Proveedor de Servicio */}
      {service.serviceUserData && service.serviceUserId ? (
        <div className="admin-service-provider">
          <div className="provider-avatar">
            {service.serviceUserData?.photoUrl ? (
              <Image
                src={service.serviceUserData.photoUrl}
                alt={service.serviceUserData?.fullName || "Proveedor"}
                width={40}
                height={40}
                className="provider-avatar-img"
              />
            ) : (
              <div className="provider-avatar-placeholder">
                <UserIcon />
              </div>
            )}
          </div>
          <div className="provider-info">
            <span className="provider-label">Proveedor</span>
            <span className="provider-name">
              {service.serviceUserData.fullName}
            </span>
            {service.serviceUserData.phoneNumber && (
              <span className="provider-phone">
                {typeof service.serviceUserData.phoneNumber === "string"
                  ? service.serviceUserData.phoneNumber
                  : flatPhone(service.serviceUserData.phoneNumber)}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="admin-service-no-provider">
          <UserIcon />
          <span>Sin proveedor asignado</span>
        </div>
      )}

      {/* Información Adicional */}
      <div className="admin-service-details">
        <div className="detail-row">
          <Clock />
          <span>{formatDateTime()}</span>
        </div>
        {servicePrice > 0 && (
          <div className="detail-row price">
            <span className="price-label">Precio:</span>
            <span className="price-value">Bs. {servicePrice}</span>
          </div>
        )}
        {hasPriceRange && (
          <div className="detail-row price">
            <span className="price-label">Rango:</span>
            <span className="price-value">
              Bs. {service.priceRange?.min} - Bs. {service.priceRange?.max}
            </span>
          </div>
        )}
      </div>

      {timelineItems.length > 0 && (
        <div className="admin-service-timeline">
          <p className="admin-service-timeline-title">Historial de tiempos</p>
          <div className="admin-service-timeline-list">
            {timelineItems.map((item) => (
              <div key={item.key} className="admin-service-timeline-item">
                <span className="timeline-label">{item.label}</span>
                <span className="timeline-value">
                  {formatAnyTimestamp(item.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Razón del servicio */}
      {service.requestReason && (
        <div className="admin-service-reason">
          <span className="reason-label">Razón:</span>
          <p className="reason-text">{service.requestReason}</p>
        </div>
      )}

      {/* Información de cancelación */}
      {service.canceled && getCancelationInfo(service) && (
        <div className="admin-service-cancelation">
          <span className="cancelation-icon">⚠️</span>
          <span className="cancelation-text">
            {getCancelationInfo(service)}
          </span>
        </div>
      )}

      <button
        className="admin-service-proposals-button"
        onClick={() => setShowProposalsModal(true)}
      >
        Ver propuestas en tiempo real
      </button>

      {/* Link al Detalle */}
      <Link
        href={routeToServicePerformed(
          getServiceTypeRoute(),
          service.fakedId || service.id || "",
        )}
        className="admin-service-link"
      >
        Ver Detalle Completo
      </Link>

      {showProposalsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowProposalsModal(false)}
        >
          <div
            className="modal-container admin-proposals-modal-container"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="text | bold">Propuestas del servicio</h2>
              <p className="text | light">Actualización en tiempo real</p>
            </div>
            <div className="modal-content">
              <div className="admin-service-proposals-list">
                {uniqueProposals.length === 0 ? (
                  <p className="admin-service-proposals-empty">
                    Aún no hay propuestas para este servicio.
                  </p>
                ) : (
                  uniqueProposals.map((proposal) => {
                    const proposalProviderName =
                      proposal.userServiceInfo?.name ||
                      proposal.userServiceInfo?.fullName ||
                      "Proveedor";

                    const offeredAmount =
                      proposal.offeredPrice?.amount ??
                      proposal.offeredPrice?.price;

                    return (
                      <div
                        key={proposal.id}
                        className="admin-service-proposal-item"
                      >
                        <div className="proposal-provider-avatar-wrap">
                          {proposal.userServiceInfo?.photoUrl ? (
                            <Image
                              src={proposal.userServiceInfo.photoUrl}
                              alt={proposalProviderName}
                              width={36}
                              height={36}
                              className="proposal-provider-avatar"
                            />
                          ) : (
                            <div className="proposal-provider-avatar-placeholder">
                              <UserIcon />
                            </div>
                          )}
                        </div>
                        <div className="proposal-provider-content">
                          <p className="proposal-provider-name">
                            {proposalProviderName}
                          </p>
                        </div>
                        <div className="proposal-offer-price">
                          {offeredAmount && offeredAmount > 0
                            ? `Bs. ${offeredAmount}`
                            : "Sin oferta"}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="general-button gray modal-button-secondary"
                onClick={() => setShowProposalsModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServiceCard;
