"use client";

import EnterpriseListForUserServer from "../../list_of_cards/EnterpriseListForUserServer";
import "@/styles/components/enterprise.css";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import PageLoading from "@/components/loaders/PageLoading";
import EnterpriseListForSupportUser from "../../list_of_cards/EnterpriseListForSupportUser";
import { ServiceType } from "@/interfaces/Services";
import Plus from "@/icons/Plus";
import Link from "next/link";
import Image from "next/image";
import { routeToRegisterEnterpriseAsUser } from "@/utils/route_builders/as_user/RouteBuilderForEnterpriseAsUser";

const ENTERPRISE_INFO: Record<
  ServiceType,
  { title: string; description: string; imagePath: string }
> = {
  driver: {
    title: "Empresa de Conductores Designados",
    description:
      "Registra tu empresa para ofrecer el servicio de conductores designados. Tus conductores podrán ofertar a viajes disponibles y el usuario elige según precio, reputación y tiempo de llegada.",
    imagePath: "/images/character/Driver.png",
  },
  mechanical: {
    title: "Taller Mecánico",
    description:
      "Registra tu taller mecánico para ofrecer servicios de auxilio mecánico. Tus mecánicos podrán atender emergencias vehiculares directamente desde la plataforma.",
    imagePath: "/images/character/Mechanic.png",
  },
  laundry: {
    title: "Lavadero de Vehículos",
    description:
      "Registra tu lavadero para ofrecer servicios de lavado a domicilio, recojo y devolución del vehículo, o ambos. Tu equipo podrá atender los servicios solicitados por los usuarios.",
    imagePath: "/images/character/CarWash.png",
  },
  tow: {
    title: "Empresa de Grúa",
    description:
      "Registra tu empresa de grúa para ofrecer servicios de remolque. Tus operadores podrán ofertar a servicios disponibles según precio y tiempo estimado de llegada.",
    imagePath: "/images/character/Tow.png",
  },
};

interface Props {
  typeOfEnterprise: ServiceType;
}

const EnterprisesPanelForServerUsers: React.FC<Props> = ({
  typeOfEnterprise,
}) => {
  const { user, checkingUserAuth } = useContext(AuthContext);
  const info = ENTERPRISE_INFO[typeOfEnterprise];

  if (checkingUserAuth) {
    return <PageLoading />;
  }

  return (
    user && (
      <section className="enterprise-main-wrapper">
        <h1 className="text | big bold margin-bottom-15">{info.title}</h1>

        <div
          className="form-sub-container | card padded margin-bottom-25"
          style={{
            display: "flex",
            gap: "1.111111111rem",
            alignItems: "center",
            border: "0.0625rem solid var(--gray-medium)",
            borderRadius: "0.833333333rem",
            background: "var(--white-medium)",
            padding: "1.111111111rem",
          }}
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
              src={info.imagePath}
              alt={info.title}
              width={200}
              height={200}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <p className="text | light">{info.description}</p>
            <Link
              href={routeToRegisterEnterpriseAsUser(typeOfEnterprise)}
              className="small-general-button text | bold icon-wrapper margin-top-15"
              style={{ display: "inline-flex" }}
            >
              <Plus /> Registrar nueva empresa
            </Link>
          </div>
        </div>

        <EnterpriseListForUserServer
          user={user}
          typeOfEnterprise={typeOfEnterprise}
        />
        <div className="separator-horizontal"></div>

        <EnterpriseListForSupportUser
          user={user}
          typeOfEnterprise={typeOfEnterprise}
        />
      </section>
    )
  );
};

export default EnterprisesPanelForServerUsers;
