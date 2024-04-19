"use client";
import PageLoader from "@/components/PageLoader";
import { AuthContext } from "@/context/AuthContext";
import AddressCar from "@/icons/AddressCar";
import Plus from "@/icons/Plus";
import SackDollar from "@/icons/SackDollar";
import { ServiceReqState } from "@/interfaces/Services";
import Link from "next/link";
import { useContext } from "react";

const DrivePanel = () => {
    const { user, loadingUser } = useContext(AuthContext);

    const getFormatDate = (fecha: Date): string => {
        const day: number = fecha.getDate();
        const mothn: number = fecha.getMonth() + 1;
        const year: number = fecha.getFullYear();

        const formatDay: string = day < 10 ? "0" + day : day.toString();
        const formatMoth: string = mothn < 10 ? "0" + mothn : mothn.toString();

        return `${formatDay}/${formatMoth}/${year}`;
    };

    const differenceOnDays = (fecha: Date): number => {
        const fechaActual: Date = new Date();
        const fechaActualTimestamp: number = fechaActual.getTime();
        const fechaTimestamp: number = fecha.getTime();
        const diferenciaEnMilisegundos: number = fechaTimestamp - fechaActualTimestamp;
        const unDiaEnMilisegundos: number = 1000 * 60 * 60 * 24;
        const diferenciaEnDias: number = Math.round(
            diferenciaEnMilisegundos / unDiaEnMilisegundos,
        );

        return diferenciaEnDias;
    };

    const getColorButtonLicense = (date: Date) => {
        var difference = differenceOnDays(date);
        if (difference <= 0) return "red";
        if (difference <= 7) return "yellow";
        return "green";
    };

    return loadingUser ? (
        <PageLoader />
    ) : user.data ? (
        <div className="service-form-wrapper">
            <h1 className="text | big bolder green">Tu solicitud fue aprobada!</h1>
            <p className="text icon-wrapper | green-icon green bolder lb medium margin-top-15">
                <SackDollar />
                Ve a nuestra Aplicacion Móvil y empieza a Ofrecer tu servicio!
            </p>
            {user.data.serviceVehicles && user.data.serviceVehicles.car && (
                <div className="margin-top-50">
                    <h2 className="text icon-wrapper | medium-big bold lb">
                        <AddressCar />
                        Licencia | Automovil
                    </h2>
                    <h3 className="text | gray gray-dark bold margin-top-5">
                        Valido hasta el{" "}
                        {getFormatDate(
                            user.data.serviceVehicles.car.license.expiredDateLicense.toDate(),
                        )}
                    </h3>
                    <Link
                        className={`small-general-button text | medium bolder margin-top-25 touchable 
                        ${getColorButtonLicense(
                            user.data.serviceVehicles.car.license.expiredDateLicense.toDate(),
                        )}`}
                        href={`/services/license/update/car`}
                    >
                        Actualizar Licencia
                    </Link>
                </div>
            )}
            {user.data.serviceVehicles && user.data.serviceVehicles.motorcycle && (
                <div className="margin-top-50">
                    <h2 className="text icon-wrapper | medium-big bold lb">
                        <AddressCar />
                        Licencia | Motocicleta
                    </h2>
                    <h3 className="text | gray gray-dark bold margin-top-5">
                        Valido hasta el{" "}
                        {getFormatDate(
                            user.data.serviceVehicles.motorcycle.license.expiredDateLicense.toDate(),
                        )}
                    </h3>
                    <Link
                        className={`small-general-button text | medium bolder margin-top-25 touchable 
                        ${getColorButtonLicense(
                            user.data.serviceVehicles.motorcycle.license.expiredDateLicense.toDate(),
                        )}`}
                        href={`/services/license/update/motorcycle`}
                    >
                        Actualizar Licencia
                    </Link>
                </div>
            )}
            {(!user.data.serviceVehicles?.car ||
                !user.data.serviceVehicles?.motorcycle) && (
                <div className="margin-top-50">
                    <h2 className="text icon-wrapper | medium-big bold lb">
                        <AddressCar />
                        {user.data.serviceVehicles &&
                        !user.data.serviceVehicles.motorcycle
                            ? "Motocicleta"
                            : "Automovil"}
                    </h2>
                    {user.data.serviceRequests.driveCar.state ===
                        ServiceReqState.Reviewing ||
                    user.data.serviceRequests.driveMotorcycle.state ===
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
                        <>
                            <h3 className="text | gray gray-dark bold margin-top-5">
                                Agrega este vehiculo para poder ofrecer tu servicio usando
                                este vehiculo.
                            </h3>
                            <Link
                                className="icon-wrapper small-general-button text | gray gray-icon medium bolder lb margin-top-25 touchable"
                                href={`/services/drive/addnew/${
                                    user.data.serviceVehicles &&
                                    !user.data.serviceVehicles.motorcycle
                                        ? "motorcycle"
                                        : "car"
                                }`}
                            >
                                <Plus />
                                Agregar Vehiculo
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    ) : (
        <h2>Usuario no encontrado</h2>
    );
};

export default DrivePanel;
