"use client";

import { AuthContext } from "@/context/AuthContext";
import { ServiceReqState, Services, ServiceType } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import { routeToRequestToBeServerUserAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import { routeToAllEnterprisesAsUser } from "@/utils/route_builders/as_user/RouteBuilderForEnterpriseAsUser";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import PageLoading from "@/components/loaders/PageLoading";
import EnterpriseMembershipBanner from "@/components/app_modules/enterprises/views/membership/EnterpriseMembershipBanner";

interface ServiceCardContent {
  type: ServiceType;
  title: string;
  serviceLabel: string;
  description: string;
  moneyDescription: string;
  imagePath: string;
}

const SERVICES: ServiceCardContent[] = [
  {
    type: "driver",
    title: "Conductores Designados",
    serviceLabel: "Conductor",
    description:
      "Puedes ofertar a servicios disponibles cuando quieras, y el usuario elige al proveedor según precio, reputación y tiempo de llegada.",
    moneyDescription:
      "Cobras directo del usuario al finalizar y CareDriver descuenta su comisión automáticamente en la plataforma.",
    imagePath: "/images/character/Driver.png",
  },
  {
    type: "mechanical",
    title: "Auxilio Mecánico",
    serviceLabel: "Mecánico",
    description:
      "Puedes ofertar a servicios disponibles de auxilio mecánico y el usuario elige la mejor opción para su emergencia.",
    moneyDescription:
      "Cobras directo del usuario al finalizar y CareDriver descuenta su comisión automáticamente en la plataforma.",
    imagePath: "/images/character/Mechanic.png",
  },
  {
    type: "laundry",
    title: "Lavado a Domicilio",
    serviceLabel: "Lavadero",
    description:
      "CareDriver es una plataforma que conecta usuarios con proveedores automotrices verificados para servicios seguros y confiables.",
    moneyDescription:
      "Cobras directo del usuario al finalizar y CareDriver descuenta su comisión automáticamente en la plataforma.",
    imagePath: "/images/character/CarWash.png",
  },
  {
    type: "tow",
    title: "Servicio de Remolque",
    serviceLabel: "Remolque",
    description:
      "Puedes ofertar a servicios disponibles de remolque y el usuario elige al proveedor según precio y tiempo estimado de llegada.",
    moneyDescription:
      "Cobras directo del usuario al finalizar y CareDriver descuenta su comisión automáticamente en la plataforma.",
    imagePath: "/images/character/Tow.png",
  },
];

const ServerServicesHub = () => {
  const { user, checkingUserAuth } = useContext(AuthContext);

  if (checkingUserAuth) {
    return <PageLoading />;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="wrapper">
      <section className="service-form-wrapper">
        <h1 className="text | big bold margin-bottom-25 margin-top-20">
          Bienvenido al panel de servicios de CareDriver
        </h1>
        <p className="text | light margin-bottom-25 max-width-80">
          CareDriver es una plataforma que conecta usuarios con proveedores
          verificados de transporte, auxilio, remolque y lavado, con
          trazabilidad y reputación por calificaciones reales a través de su
          aplicación móvil.
        </p>

        <EnterpriseMembershipBanner />

        <div className="row-wrapper row-responsive | gap-20">
          {SERVICES.map((service) => {
            const isLaundry = service.type === "laundry";
            const status = isLaundry
              ? {
                  badgeText: "REGISTRA TU LAVADERO",
                  actionType: "apply" as ServiceActionType,
                }
              : getServiceStatus(user, service.type);
            const route = isLaundry
              ? routeToAllEnterprisesAsUser("laundry")
              : routeToRequestToBeServerUserAsUser(service.type);
            return (
              <article
                key={service.type}
                className="form-sub-container | card padded"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.833333333rem",
                  minHeight: "21.111111111rem",
                  flex: "1 1 calc(50% - 0.833333333rem)",
                  minWidth: "20.555555556rem",
                  border: "0.0625rem solid var(--gray-medium)",
                  borderRadius: "0.833333333rem",
                  background: "var(--white-medium)",
                  padding: "1.111111111rem",
                }}
              >
                <Link href={route} className="touchable">
                  <div
                    className="row-wrapper | gap-15 margin-bottom-10"
                    style={{ alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: "5.555555556rem",
                        height: "5.555555556rem",
                        borderRadius: "0.777777778rem",
                        overflow: "hidden",
                        background: "var(--gray-lighter)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={service.imagePath}
                        alt={service.title}
                        width={200}
                        height={200}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <h2 className="text | medium-big bold">
                        {service.title}
                      </h2>
                      <p
                        className="text | bold margin-top-5"
                        style={{
                          display: "inline-block",
                          padding: "0.277777778rem 0.555555556rem",
                          borderRadius: "0.555555556rem",
                          border: `0.0625rem solid ${getStatusStyles(status.actionType).borderColor}`,
                          color: getStatusStyles(status.actionType).textColor,
                          backgroundColor: getStatusStyles(status.actionType)
                            .backgroundColor,
                        }}
                      >
                        {status.badgeText}
                      </p>
                    </div>
                  </div>
                </Link>

                <p className="text | light">{service.description}</p>
                <p className="text | light margin-top-10">
                  {service.moneyDescription}
                </p>

                <div
                  className="row-wrapper | margin-top-15"
                  style={{ marginTop: "auto", justifyContent: "flex-end" }}
                >
                  <Link
                    href={route}
                    className="small-general-button text | bold"
                    style={{ minWidth: "11.111111111rem" }}
                  >
                    {isLaundry
                      ? "Registrar mi Lavadero"
                      : getCtaText(service.serviceLabel, status.actionType)}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

type ServiceActionType = "apply" | "pending" | "approved";

function getServiceStatus(
  user: UserInterface,
  type: ServiceType,
): { badgeText: string; actionType: ServiceActionType } {
  if (type === "driver") {
    const isDriver = user.services.includes(Services.Driver);
    if (isDriver) {
      return { badgeText: "YA ERES CONDUCTOR", actionType: "approved" };
    }
    const hasReview =
      user.serviceRequests?.driveCar?.state === ServiceReqState.Reviewing ||
      user.serviceRequests?.driveMotorcycle?.state ===
        ServiceReqState.Reviewing;
    return hasReview
      ? { badgeText: "SOLICITUD EN REVISIÓN", actionType: "pending" }
      : { badgeText: "SOLICITAR SER CONDUCTOR", actionType: "apply" };
  }

  const serviceMap: Record<Exclude<ServiceType, "driver">, Services> = {
    mechanical: Services.Mechanic,
    laundry: Services.Laundry,
    tow: Services.Tow,
  };

  const isAlready = user.services.includes(serviceMap[type]);
  if (isAlready) {
    if (type === "mechanical") {
      return { badgeText: "YA ERES MECÁNICO", actionType: "approved" };
    }
    if (type === "laundry") {
      return { badgeText: "YA ERES LAVADERO", actionType: "approved" };
    }
    return {
      badgeText: "YA ERES PROVEEDOR DE REMOLQUE",
      actionType: "approved",
    };
  }

  const reqState =
    type === "mechanical"
      ? user.serviceRequests?.mechanic?.state
      : type === "laundry"
        ? user.serviceRequests?.laundry?.state
        : user.serviceRequests?.tow?.state;
  return reqState === ServiceReqState.Reviewing
    ? { badgeText: "SOLICITUD EN REVISIÓN", actionType: "pending" }
    : {
        badgeText:
          type === "mechanical"
            ? "SOLICITAR SER MECÁNICO"
            : type === "laundry"
              ? "SOLICITAR SER LAVADERO"
              : "SOLICITAR SER REMOLQUE",
        actionType: "apply",
      };
}

function getCtaText(
  serviceLabel: string,
  actionType: ServiceActionType,
): string {
  switch (actionType) {
    case "pending":
      return "Ver estado de solicitud";
    case "approved":
      return "Ver acciones";
    default:
      return `Solicitar ser ${serviceLabel}`;
  }
}

function getStatusStyles(actionType: ServiceActionType): {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
} {
  switch (actionType) {
    case "approved":
      return {
        backgroundColor: "var(--main-lighter)",
        borderColor: "var(--main-light)",
        textColor: "var(--second-dark)",
      };
    case "pending":
      return {
        backgroundColor: "var(--yellow-opacity)",
        borderColor: "var(--yellow-dark)",
        textColor: "var(--second-dark)",
      };
    default:
      return {
        backgroundColor: "var(--gray-light)",
        borderColor: "var(--gray-medium)",
        textColor: "var(--second-dark)",
      };
  }
}

export default ServerServicesHub;
