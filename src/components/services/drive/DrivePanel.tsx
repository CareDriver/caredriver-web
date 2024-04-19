"use client";
import PageLoader from "@/components/PageLoader";
import { AuthContext } from "@/context/AuthContext";
import AddressCar from "@/icons/AddressCar";
import CarSide from "@/icons/CarSide";
import Motorcycle from "@/icons/Motorcycle";
import Plus from "@/icons/Plus";
import SackDollar from "@/icons/SackDollar";
import { ServiceReqState } from "@/interfaces/Services";
import { ServiceVehicles, UserInterface } from "@/interfaces/UserInterface";
import {
    vehicleModeRender,
    vehicleModeRenderV2,
    VehicleTransmission,
} from "@/interfaces/VehicleInterface";
import { updateUser } from "@/utils/requests/UserRequester";
import Link from "next/link";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const DrivePanel = () => {
    const { user, loadingUser } = useContext(AuthContext);
    const [addingNew, setAddingNew] = useState(false);

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

    const getModes = (modes: VehicleTransmission[]): string[] => {
        return modes.map((mode) => vehicleModeRenderV2[mode]);
    };

    const addNewTransmition = async (serviceVehicles: ServiceVehicles) => {
        if (!addingNew && user.data && user.data.id) {
            setAddingNew(true);
            var userToUpdate: Partial<UserInterface> = {
                serviceVehicles,
            };
            try {
                await toast.promise(updateUser(user.data?.id, userToUpdate), {
                    pending: "Agregando nueva transmisión, por favor espera",
                    success: "Transmisión agregada",
                    error: "Error al agregar la nueva transmisión, intentalo de nuevo por favor",
                });
                setAddingNew(false);
                window.location.reload();
            } catch (e) {
                setAddingNew(false);
                window.location.reload();
            }
        }
    };

    const addNewCarTransmition = async () => {
        if (user.data?.serviceVehicles && user.data?.serviceVehicles.car) {
            addNewTransmition({
                ...user.data.serviceVehicles,
                car: {
                    ...user.data.serviceVehicles.car,
                    type: {
                        ...user.data.serviceVehicles.car.type,
                        mode: [
                            ...user.data.serviceVehicles.car.type.mode,
                            getMissMode(user.data.serviceVehicles.car.type.mode),
                        ],
                    },
                },
            });
        }
    };

    const addNewMotocycleTransmition = async () => {
        if (user.data?.serviceVehicles && user.data?.serviceVehicles.motorcycle) {
            addNewTransmition({
                ...user.data.serviceVehicles,
                motorcycle: {
                    ...user.data.serviceVehicles.motorcycle,
                    type: {
                        ...user.data.serviceVehicles.motorcycle.type,
                        mode: [
                            ...user.data.serviceVehicles.motorcycle.type.mode,
                            getMissMode(user.data.serviceVehicles.motorcycle.type.mode),
                        ],
                    },
                },
            });
        }
    };

    const getMissMode = (modes: VehicleTransmission[]): VehicleTransmission => {
        return modes[0] === VehicleTransmission.AUTOMATIC
            ? VehicleTransmission.MECHANICAL
            : VehicleTransmission.AUTOMATIC;
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
                        <CarSide />
                        Automovil
                    </h2>
                    <h3 className="text | gray gray-dark bold margin-top-5">
                        Valido hasta el{" "}
                        {getFormatDate(
                            user.data.serviceVehicles.car.license.expiredDateLicense.toDate(),
                        )}
                    </h3>
                    <h3 className="text | gray gray-dark bold margin-top-5">
                        Transmisión{" "}
                        {getModes(user.data.serviceVehicles.car.type.mode)
                            .toString()
                            .replaceAll(",", " | ")}
                    </h3>
                    <div
                        className="row-wrapper | gap-20"
                        data-state={addingNew && "loading"}
                    >
                        {user.data.serviceVehicles.car.type.mode.length === 1 && (
                            <button
                                className="icon-wrapper small-general-button text | gray gray-icon medium bolder lb margin-top-25 touchable"
                                onClick={addNewCarTransmition}
                            >
                                <Plus />
                                Agregar transmisión{" "}
                                {
                                    vehicleModeRenderV2[
                                        getMissMode(
                                            user.data.serviceVehicles.car.type.mode,
                                        )
                                    ]
                                }
                            </button>
                        )}
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
                </div>
            )}
            {user.data.serviceVehicles && user.data.serviceVehicles.motorcycle && (
                <div className="margin-top-50">
                    <h2 className="text icon-wrapper | medium-big bold lb">
                        <Motorcycle />
                        Motocicleta
                    </h2>
                    <h3 className="text | gray gray-dark bold margin-top-5">
                        Valido hasta el{" "}
                        {getFormatDate(
                            user.data.serviceVehicles.motorcycle.license.expiredDateLicense.toDate(),
                        )}
                    </h3>
                    <div
                        className="row-wrapper | gap-20"
                        data-state={addingNew && "loading"}
                    >
                        {user.data.serviceVehicles.motorcycle.type.mode.length === 1 && (
                            <button
                                className="icon-wrapper small-general-button text | gray gray-icon medium bolder lb margin-top-25 touchable"
                                onClick={addNewMotocycleTransmition}
                            >
                                <Plus />
                                Agregar transmisión{" "}
                                {
                                    vehicleModeRenderV2[
                                        getMissMode(
                                            user.data.serviceVehicles.motorcycle.type
                                                .mode,
                                        )
                                    ]
                                }
                            </button>
                        )}
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
                </div>
            )}
            {(!user.data.serviceVehicles?.car ||
                !user.data.serviceVehicles?.motorcycle) && (
                <div className="margin-top-50">
                    <h2 className="text icon-wrapper | medium-big bold lb">
                        {user.data.serviceVehicles &&
                        !user.data.serviceVehicles.motorcycle ? (
                            <Motorcycle />
                        ) : (
                            <CarSide />
                        )}
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
                        <div data-state={addingNew && "loading"}>
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
                        </div>
                    )}
                </div>
            )}
        </div>
    ) : (
        <h2>Usuario no encontrado</h2>
    );
};

export default DrivePanel;
