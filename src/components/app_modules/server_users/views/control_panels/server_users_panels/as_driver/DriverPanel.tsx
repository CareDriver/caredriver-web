"use client";
import { AuthContext } from "@/context/AuthContext";
import CarSide from "@/icons/CarSide";
import Motorcycle from "@/icons/Motorcycle";
import { ServiceReqState } from "@/interfaces/Services";
import { useContext, useState } from "react";
import "@/styles/modules/popup.css";
import PageLoading from "@/components/loaders/PageLoading";
import { MissingTransmissionAdder } from "@/components/app_modules/server_users/api/MissingTransmissionAdder";
import RegisteredVehicleRenderer from "../../../data_renderers/for_vehicles/RegisteredVehicleRenderer";
import UserAssociatedEnterpriseRenderer from "../../../data_renderers/UserAssociatedEnterpriseRenderer";
import RedirectorToTheAppAsServerUser from "../RedirectorToTheAppAsServerUser";
import DriverInstructionsForNewVehicle from "./DriverInstructionsForNewVehicle";
import Image from "next/image";

const DriverPanel = () => {
  const { user, checkingUserAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const transmisionAdder = new MissingTransmissionAdder(
    user,
    loading,
    setLoading,
  );

  if (checkingUserAuth) {
    return <PageLoading />;
  }

  return (
    user && (
      <div className="service-form-wrapper">
        <h1 className="text | big bold green">Tu solicitud fue aprobada!</h1>
        <RedirectorToTheAppAsServerUser serviceType="driver" />
        <img
          className="request-aproved-image"
          src="/images/image5.png"
          alt=""
        />
        <UserAssociatedEnterpriseRenderer
          typeOfEnterprise="driver"
          user={user}
        />

        {user.serviceVehicles?.car && (
          <RegisteredVehicleRenderer
            legend="Automóvil"
            transmisionAdder={transmisionAdder}
            vehicle={user.serviceVehicles.car}
            vehicleType="car"
          />
        )}

        {user.serviceVehicles?.motorcycle && (
          <RegisteredVehicleRenderer
            legend="Motocicleta"
            transmisionAdder={transmisionAdder}
            vehicle={user.serviceVehicles.motorcycle}
            vehicleType="motorcycle"
          />
        )}

        {(!user.serviceVehicles?.car || !user.serviceVehicles?.motorcycle) &&
          renderMissingVehicleSection()}
      </div>
    )
  );

  function renderMissingVehicleSection() {
    return (
      user && (
        <div className="margin-top-50">
          <h2 className="text icon-wrapper | medium-big bold lb">
            {user.serviceVehicles && !user.serviceVehicles.motorcycle ? (
              <Motorcycle />
            ) : (
              <CarSide />
            )}
            {user.serviceVehicles && !user.serviceVehicles.motorcycle
              ? "Motocicleta"
              : "Automóvil"}
          </h2>
          {user.serviceRequests?.driveCar?.state ===
            ServiceReqState.Reviewing ||
          user.serviceRequests?.driveMotorcycle?.state ===
            ServiceReqState.Reviewing ? (
            <>
              <h3 className="text | medium-big gray gray-dark bold margin-top-5">
                Tu solicitud esta siendo revisada
              </h3>
              <h4 className="text | gray gray-dark bold">
                Espera a que uno de nuestros administradores apruebe tu
                solicitud.
              </h4>
            </>
          ) : (
            <div data-state={loading && "loading"}>
              <DriverInstructionsForNewVehicle />
            </div>
          )}
        </div>
      )
    );
  }
};

export default DriverPanel;
