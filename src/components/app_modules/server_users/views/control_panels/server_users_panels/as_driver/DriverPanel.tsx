"use client";
import { AuthContext } from "@/context/AuthContext";
import CarSide from "@/icons/CarSide";
import Motorcycle from "@/icons/Motorcycle";
import SackDollar from "@/icons/SackDollar";
import { ServiceReqState } from "@/interfaces/Services";
import { useContext, useState } from "react";
import DriverInstrucctions from "./DriverInstrucctions";
import "@/styles/modules/popup.css";
import PageLoading from "@/components/loaders/PageLoading";
import ReviewEnterpriseAsPopup from "@/components/app_modules/enterprises/views/review_forms/ReviewEnterpriseAsPopup";
import { MissingTransmissionAdder } from "@/components/app_modules/server_users/api/MissingTransmissionAdder";
import RegisteredVehicleRenderer from "../../../form_reviews/vehicle_reviews/RegisteredVehicleRenderer";

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
            <div className="service-form-wrapper | max-height-100">
                <h1 className="text | big bolder green">
                    Tu solicitud fue aprobada!
                </h1>
                <p className="text icon-wrapper | green-icon green bolder lb medium margin-top-15">
                    <SackDollar />
                    Ya eres chofer, ve a nuestra Aplicación Móvil y empieza a
                    Ofrecer tu servicio!
                </p>
                <ReviewEnterpriseAsPopup enterpriseId={user.driverEnterpriseId} />

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

                {(!user.serviceVehicles?.car ||
                    !user.serviceVehicles?.motorcycle) &&
                    renderMissingVehicleSection()}

                <span className="circles-right-bottomv2 green"></span>
            </div>
        )
    );

    function renderMissingVehicleSection() {
        return (
            user && (
                <div className="margin-top-50">
                    <h2 className="text icon-wrapper | medium-big bold lb">
                        {user.serviceVehicles &&
                        !user.serviceVehicles.motorcycle ? (
                            <Motorcycle />
                        ) : (
                            <CarSide />
                        )}
                        {user.serviceVehicles &&
                        !user.serviceVehicles.motorcycle
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
                                Espera a que uno de nuestros administradores
                                apruebe tu solicitud.
                            </h4>
                        </>
                    ) : (
                        <div data-state={loading && "loading"}>
                            <h3 className="text | gray gray-dark bold margin-top-5">
                                Agrega este vehículo a tu perfil
                            </h3>
                            <DriverInstrucctions user={user} />
                        </div>
                    )}
                </div>
            )
        );
    }
};

export default DriverPanel;
