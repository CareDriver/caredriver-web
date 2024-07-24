"use client";

import PageLoader from "@/components/PageLoader";
import { AuthContext } from "@/context/AuthContext";
import Plus from "@/icons/Plus";
import SackDollar from "@/icons/SackDollar";
import Truck from "@/icons/Truck";
import { ServiceVehicles, UserInterface } from "@/interfaces/UserInterface";
import { vehicleModeRenderV2, VehicleTransmission } from "@/interfaces/VehicleInterface";
import { updateUser } from "@/utils/requests/UserRequester";
import Link from "next/link";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const TowPanel = () => {
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
                    error: "Error al agregar la nueva transmisión, inténtalo de nuevo por favor",
                });
                setAddingNew(false);
                window.location.reload();
            } catch (e) {
                setAddingNew(false);
                window.location.reload();
            }
        }
    };

    const addNewTowTransmition = async () => {
        if (user.data?.serviceVehicles && user.data?.serviceVehicles.tow) {
            addNewTransmition({
                ...user.data.serviceVehicles,
                tow: {
                    ...user.data.serviceVehicles.tow,
                    type: {
                        ...user.data.serviceVehicles.tow.type,
                        mode: [
                            ...user.data.serviceVehicles.tow.type.mode,
                            getMissMode(user.data.serviceVehicles.tow.type.mode),
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
        <div className="service-form-wrapper | max-height-100">
            <h1 className="text | big bolder green">Tu solicitud fue aprobada!</h1>
            <p className="text icon-wrapper | green-icon green bolder lb medium margin-top-15">
                <SackDollar />
                Ve a nuestra Aplicación Móvil y empieza a Ofrecer tu servicio!
            </p>
            {user.data.serviceVehicles && user.data.serviceVehicles.tow && (
                <div className="margin-top-50">
                    <h2 className="text icon-wrapper | medium-big bold lb">
                        <Truck />
                        Operador de Grúa
                    </h2>
                    <h3 className="text | gray gray-dark bold margin-top-5">
                        Valido hasta el{" "}
                        {getFormatDate(
                            user.data.serviceVehicles.tow.license.expiredDateLicense.toDate(),
                        )}
                    </h3>
                    <h3 className="text | gray gray-dark bold margin-top-5">
                        Transmisión{" "}
                        {getModes(user.data.serviceVehicles.tow.type.mode)
                            .toString()
                            .replaceAll(",", " | ")}
                    </h3>
                    <div
                        className="row-wrapper | gap-20"
                        data-state={addingNew && "loading"}
                    >
                        {user.data.serviceVehicles.tow.type.mode.length === 1 && (
                            <button
                                className="icon-wrapper small-general-button text | gray gray-icon medium bolder lb margin-top-25 touchable"
                                onClick={addNewTowTransmition}
                            >
                                <Plus />
                                Agregar transmisión{" "}
                                {
                                    vehicleModeRenderV2[
                                        getMissMode(
                                            user.data.serviceVehicles.tow.type.mode,
                                        )
                                    ]
                                }
                            </button>
                        )}
                        <Link
                            className={`small-general-button text | medium bolder margin-top-25 touchable 
                        ${getColorButtonLicense(
                            user.data.serviceVehicles.tow.license.expiredDateLicense.toDate(),
                        )}`}
                            href={`/services/license/update/tow`}
                        >
                            Actualizar Licencia
                        </Link>
                    </div>
                </div>
            )}
            <span className="circles-right-bottomv2 green"></span>
        </div>
    ) : (
        <h2>Usuario no encontrado</h2>
    );
};

export default TowPanel;
