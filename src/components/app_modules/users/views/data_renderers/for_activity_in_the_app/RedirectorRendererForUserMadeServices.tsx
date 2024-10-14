"use client";
import Eye from "@/icons/Eye";
import HelmetSafety from "@/icons/HelmetSafety";
import { ServiceReqState, Services } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import Link from "next/link";
import { routeToServicesServedByUser } from "@/utils/route_builders/for_services/RouteBuilderForServices";
import { routeToNoFound } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";
import EnterpriseRendererAsPopup from "@/components/app_modules/enterprises/views/data_renderers/EnterpriseRendererAsPopup";
import UserVehicleRendererAsPopup from "../for_user_data/UserVehicleRendererAsPopup";
import UserServerRatingRenderer from "./UserServerRatingRenderer";
import { DRIVER, DRIVER_PLURAL } from "@/models/Business";

const ServiceServedByUser = ({ user }: { user: UserInterface }) => {
    const IS_DRIVER: boolean =
        user.services.includes(Services.Driver) &&
        (user.serviceRequests?.driveCar?.state === ServiceReqState.Approved ||
            user.serviceRequests?.driveMotorcycle?.state ===
                ServiceReqState.Approved);
    const IS_MECHANIC: boolean =
        user.services.includes(Services.Mechanic) &&
        user.serviceRequests?.mechanic?.state === ServiceReqState.Approved;
    const IS_CRANE_OPERATOR: boolean =
        user.services.includes(Services.Tow) &&
        user.serviceRequests?.tow?.state === ServiceReqState.Approved;
    const IS_LAUNDERER: boolean =
        user.services.includes(Services.Laundry) &&
        user.serviceRequests?.laundry?.state === ServiceReqState.Approved;

    return (
        <div className="form-sub-container | margin-top-25 margin-bottom-25 max-width-60">
            <h2 className="icon-wrapper lb | text medium-big bolder">
                <HelmetSafety />
                Servicios
            </h2>
            <p className="text | light">
                Puedes administrar los servicios que este usuario ofrece
            </p>
            {IS_DRIVER && (
                <div className="service-user-wrapper | with-data">
                    <h3 className="text | medium-big capitalize bolder">{DRIVER}</h3>
                    <UserServerRatingRenderer
                        serviceData={user.servicesData.Conductor}
                    />
                    <UserVehicleRendererAsPopup
                        vehicle={{
                            data: user.serviceVehicles?.car,
                            type: "car",
                        }}
                        content={{
                            legend: `Detalles del usuario como ${DRIVER} de auto`,
                        }}
                    />
                    <UserVehicleRendererAsPopup
                        vehicle={{
                            data: user.serviceVehicles?.motorcycle,
                            type: "motorcycle",
                        }}
                        content={{
                            legend: `Detalles del usuario como ${DRIVER} de motocicleta`,
                        }}
                    />

                    {user.driverEnterpriseId ? (
                        <EnterpriseRendererAsPopup
                            enterprise={{
                                id: user.driverEnterpriseId,
                                type: "driver",
                            }}
                            button={{
                                styleClass: "service-user-option",
                                legend: `Ver empresa de ${DRIVER_PLURAL} asociado`,
                            }}
                        />
                    ) : (
                        <i className="text | bolder red">
                            Sin asociación a una empresa de {DRIVER_PLURAL}
                        </i>
                    )}
                    <Link
                        className="icon-wrapper text  | underline gray-icon gray-dark | margin-top-15"
                        href={
                            user.fakeId
                                ? routeToServicesServedByUser(
                                      "driver",
                                      user.fakeId,
                                  )
                                : routeToNoFound()
                        }
                    >
                        <Eye />
                        <i>Ver los servicios hechos como {DRIVER}</i>
                    </Link>
                </div>
            )}
            {IS_MECHANIC && (
                <div className="service-user-wrapper  | with-data">
                    <h3 className="text | medium-big capitalize bolder">Mecánico</h3>
                    <UserServerRatingRenderer
                        serviceData={user.servicesData.Mecánico}
                    />
                    {user.mechanicalWorkShopId ? (
                        <EnterpriseRendererAsPopup
                            enterprise={{
                                id: user.mechanicalWorkShopId,
                                type: "mechanical",
                            }}
                            button={{
                                styleClass: "service-user-option",
                                legend: "Ver taller mecánico asociado",
                            }}
                        />
                    ) : (
                        <i className="text | bolder red">
                            Sin asociación a un taller mecánico registrado
                        </i>
                    )}

                    <Link
                        href={
                            user.fakeId
                                ? routeToServicesServedByUser(
                                      "mechanical",
                                      user.fakeId,
                                  )
                                : routeToNoFound()
                        }
                        className="icon-wrapper text  | underline gray-icon gray-dark | margin-top-15"
                    >
                        <Eye />
                        <i>Ver los servicios hechos como mecánico</i>
                    </Link>
                </div>
            )}
            {IS_CRANE_OPERATOR && (
                <div className="service-user-wrapper  | with-data">
                    <h3 className="text | medium-big capitalize bolder">
                        Operador de Grúa
                    </h3>
                    <UserServerRatingRenderer
                        serviceData={user.servicesData.Remolque}
                    />

                    <UserVehicleRendererAsPopup
                        vehicle={{
                            data: user.serviceVehicles?.tow,
                            type: "tow",
                        }}
                        content={{
                            legend: "Detalles del usuario como operador de grúa",
                        }}
                    />
                    {user.towEnterpriseId ? (
                        <EnterpriseRendererAsPopup
                            enterprise={{
                                id: user.towEnterpriseId,
                                type: "tow",
                            }}
                            button={{
                                styleClass: "service-user-option",
                                legend: "Ver empresa operadora de grúa asociada",
                            }}
                        />
                    ) : (
                        <i className="text | bolder red">
                            Sin asociación a una empresa operadora de grúa
                        </i>
                    )}
                    <Link
                        className="icon-wrapper text  | underline gray-icon gray-dark | margin-top-15"
                        href={
                            user.fakeId
                                ? routeToServicesServedByUser(
                                      "tow",
                                      user.fakeId,
                                  )
                                : routeToNoFound()
                        }
                    >
                        <Eye />
                        <i>Ver servicios hechos como operador de grúa</i>
                    </Link>
                </div>
            )}
            {IS_LAUNDERER && (
                <div className="service-user-wrapper  | with-data">
                    <h3 className="text | medium-big capitalize bolder">Lavadero</h3>
                    <UserServerRatingRenderer
                        serviceData={user.servicesData.Lavadero}
                    />

                    <EnterpriseRendererAsPopup
                        enterprise={{
                            id: user.laundryEnterpriseId,
                            type: "laundry",
                        }}
                        button={{
                            styleClass: "service-user-option",
                            legend: "Ver lavadero asociado",
                        }}
                    />
                    <Link
                        href={
                            user.fakeId
                                ? routeToServicesServedByUser(
                                      "laundry",
                                      user.fakeId,
                                  )
                                : routeToNoFound()
                        }
                        className="icon-wrapper text  | underline gray-icon gray-dark | margin-top-15"
                    >
                        <Eye />
                        Ver servicios hechos como lavadero
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ServiceServedByUser;
