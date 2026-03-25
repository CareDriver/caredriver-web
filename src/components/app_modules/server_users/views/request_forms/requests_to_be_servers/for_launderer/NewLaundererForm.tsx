"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { UserInterface } from "@/interfaces/UserInterface";
import Soap from "@/icons/Soap";
import PageLoading from "@/components/loaders/PageLoading";
import ServiceStateRenderer from "../ServiceStateRenderer";
import { LaundererStatusHandler } from "@/components/app_modules/server_users/api/requests_status_handler/LaundererStatusHandler";
import Link from "next/link";
import { routeToAllEnterprisesAsUser } from "@/utils/route_builders/as_user/RouteBuilderForEnterpriseAsUser";

interface Props {
  baseUser?: UserInterface;
}

const NewLaundererForm: React.FC<Props> = ({ baseUser }) => {
  const { user, checkingUserAuth } = useContext(AuthContext);
  const requesterUser = baseUser ?? user;

  if (checkingUserAuth) {
    return <PageLoading />;
  }

  return (
    requesterUser && (
      <div className="service-form-wrapper">
        <ServiceStateRenderer
          statusHandler={new LaundererStatusHandler(requesterUser)}
        />
        <div className="form-sub-container | card padded max-width-60">
          <h2 className="text icon-wrapper | medium-big bold margin-bottom-10">
            <Soap />
            Registro de Lavadero
          </h2>
          <p className="text | light">
            El servicio de lavadero funciona como empresa. Para ofrecer este
            servicio, debes registrar tu lavadero desde la sección de{" "}
            <b>Registros &gt; Lavaderos</b>.
          </p>
          <p className="text | light margin-top-10">
            Al registrar tu empresa de lavadero, tu cuenta se convertirá
            automáticamente en <b>administrador</b> de la empresa. Desde ahí
            podrás agregar colaboradores que atiendan los servicios.
          </p>
          <p className="text | light margin-top-10">
            <b>Importante:</b> Seleccionarás si tu lavadero ofrece lavado móvil
            (en la ubicación del cliente), recojo y devolución del vehículo, o
            ambos.
          </p>

          <Link
            href={routeToAllEnterprisesAsUser("laundry")}
            className="small-general-button text | bold margin-top-15"
          >
            Registrar mi Lavadero
          </Link>
        </div>
      </div>
    )
  );
};

export default NewLaundererForm;
