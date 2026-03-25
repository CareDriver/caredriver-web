"use client";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import "@/styles/modules/popup.css";
import PageLoading from "@/components/loaders/PageLoading";
import UserAssociatedEnterpriseRenderer from "../../../data_renderers/UserAssociatedEnterpriseRenderer";
import RedirectorToTheAppAsServerUser from "../RedirectorToTheAppAsServerUser";
import Image from "next/image";
import { useState } from "react";
import NewMechanicForm from "../../../request_forms/requests_to_be_servers/for_mechanic/NewMechanicForm";

const MechanicPanel = () => {
  const { user, checkingUserAuth } = useContext(AuthContext);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  if (checkingUserAuth) {
    return <PageLoading />;
  }

  return (
    user && (
      <div className="service-form-wrapper">
        <h1 className="text | big bold green">Tu solicitud fue aprobada!</h1>
        <RedirectorToTheAppAsServerUser serviceType="mechanical" />
        <img
          className="request-aproved-image"
          src="/images/image4.png"
          alt=""
        />
        <UserAssociatedEnterpriseRenderer
          typeOfEnterprise="mechanical"
          user={user}
        />

        <div className="form-sub-container | margin-top-25">
          <h2 className="text | medium-big bold">Actualizar herramientas</h2>
          <p className="text | light margin-top-10">
            Si cambiaste tus herramientas o certificaciones, envía una
            actualización para revisión del equipo admin.
          </p>
          <button
            type="button"
            className="small-general-button text | bold margin-top-15"
            onClick={() => setShowUpdateForm((prev) => !prev)}
          >
            {showUpdateForm
              ? "Ocultar formulario de actualización"
              : "Solicitar actualización"}
          </button>
        </div>

        {showUpdateForm && (
          <div className="margin-top-25">
            <NewMechanicForm baseUser={user} isUpdateRequest />
          </div>
        )}
      </div>
    )
  );
};

export default MechanicPanel;
