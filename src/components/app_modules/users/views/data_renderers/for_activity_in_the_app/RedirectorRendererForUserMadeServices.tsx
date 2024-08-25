"use client";
import Eye from "@/icons/Eye";
import HelmetSafety from "@/icons/HelmetSafety";
import { ServiceReqState, Services } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import {
    differenceOnDays,
    timestampDateInSpanish,
} from "@/utils/helpers/DateHelper";
import Link from "next/link";
import { useState } from "react";
import VehicleRenderer from "../../../../server_users/views/data_renderers/for_vehicles/VehicleRenderer";
import Popup from "@/components/modules/Popup";
import { Enterprise } from "@/interfaces/Enterprise";
import { getEnterpriseById } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import EnterpriseRendererWithLoader from "@/components/app_modules/enterprises/views/data_renderers/EnterpriseRendererWithLoader";
import { routeToServicesServedByUser } from "@/utils/route_builders/as_admin/RouteBuilderForServiceAsAdmin";
import { routeToNoFound } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";

interface ViewControl {
    isOpen: boolean;
}

interface ViewControlWithEnterprise extends ViewControl {
    enterprise: Enterprise | null | undefined;
}

const defaultViewControl: ViewControl = {
    isOpen: false,
};

const defaultViewControlWithEnter: ViewControlWithEnterprise = {
    isOpen: false,
    enterprise: null,
};

const ServiceServedByUser = ({ user }: { user: UserInterface }) => {
    const [isViewAuto, setViewAuto] = useState<ViewControl>(defaultViewControl);
    const [isViewMoto, setViewMoto] = useState<ViewControl>(defaultViewControl);
    const [isViewDriver, setViewDriver] = useState<ViewControlWithEnterprise>(
        defaultViewControlWithEnter,
    );
    const [isViewMechanic, setViewMechanic] =
        useState<ViewControlWithEnterprise>(defaultViewControlWithEnter);
    const [isViewTow, setViewTow] = useState<ViewControlWithEnterprise>(
        defaultViewControlWithEnter,
    );
    const [isViewLaundry, setViewLaundry] = useState<ViewControlWithEnterprise>(
        defaultViewControlWithEnter,
    );

    const openMechanic = async () => {
        if (user.mechanicalWorkShopId && isViewMechanic.enterprise === null) {
            const enterprise = await getEnterpriseById(
                user.mechanicalWorkShopId,
            );
            setViewMechanic({
                enterprise,
                isOpen: true,
            });
        } else if (user.mechanicalWorkShopId === undefined) {
            setViewMechanic({
                enterprise: undefined,
                isOpen: true,
            });
        } else {
            setViewMechanic({
                ...isViewMechanic,
                isOpen: true,
            });
        }
    };

    const openDriverEnterprise = async () => {
        if (user.driverEnterpriseId && isViewDriver.enterprise === null) {
            const enterprise = await getEnterpriseById(user.driverEnterpriseId);
            setViewDriver({
                enterprise,
                isOpen: true,
            });
        } else if (user.driverEnterpriseId === undefined) {
            setViewDriver({
                enterprise: undefined,
                isOpen: true,
            });
        } else {
            setViewDriver({
                ...isViewDriver,
                isOpen: true,
            });
        }
    };

    const openTow = async () => {
        if (user.towEnterpriseId && isViewTow.enterprise === null) {
            const enterprise = await getEnterpriseById(user.towEnterpriseId);
            setViewTow({
                enterprise,
                isOpen: true,
            });
        } else if (user.towEnterpriseId === undefined) {
            setViewTow({
                enterprise: undefined,
                isOpen: true,
            });
        } else {
            setViewTow({
                ...isViewMechanic,
                isOpen: true,
            });
        }
    };

    const fetchLaundry = async (id: string) => {
        const enterprise = await getEnterpriseById(id);
        setViewLaundry({
            ...isViewLaundry,
            enterprise: enterprise,
        });
    };

    const openLaundry = async () => {
        if (user.laundryEnterpriseId && isViewLaundry.enterprise === null) {
            setViewLaundry({
                ...isViewLaundry,
                isOpen: true,
            });
            await fetchLaundry(user.laundryEnterpriseId);
        } else if (user.laundryEnterpriseId === undefined) {
            setViewLaundry({
                enterprise: undefined,
                isOpen: true,
            });
        } else {
            setViewLaundry({
                ...isViewMechanic,
                isOpen: true,
            });
        }
    };

    return (
        <div className="form-sub-container | margin-top-25 margin-bottom-25 max-width-60">
            <h2 className="icon-wrapper profile-subtitle | bold mb">
                <HelmetSafety />
                Servicios
            </h2>
            <p className="text | light">
                Puedes administrar los servicios que este usuario ofrece
            </p>
            {user.services.includes(Services.Driver) &&
            (user.serviceRequests?.driveCar?.state ===
                ServiceReqState.Approved ||
                user.serviceRequests?.driveMotorcycle?.state ===
                    ServiceReqState.Approved) ? (
                <div className="service-user-wrapper | with-data">
                    <h3 className="text | medium-big bolder">Chofer</h3>
                    {user.serviceVehicles?.car ? (
                        <>
                            <button
                                className="service-user-option"
                                onClick={() =>
                                    setViewAuto({
                                        ...isViewAuto,
                                        isOpen: true,
                                    })
                                }
                            >
                                Auto - Licencia valida hasta{" "}
                                {timestampDateInSpanish(
                                    user.serviceVehicles?.car.license
                                        .expiredDateLicense,
                                )}
                                {differenceOnDays(
                                    user.serviceVehicles?.car.license.expiredDateLicense.toDate(),
                                ) <= 0 && (
                                    <span className="text | bolder red">
                                        {" "}
                                        - Expiro
                                    </span>
                                )}
                            </button>
                            <Popup
                                isOpen={isViewAuto.isOpen}
                                close={() =>
                                    setViewAuto({
                                        ...isViewAuto,
                                        isOpen: false,
                                    })
                                }
                            >
                                <div>
                                    <h2 className="text | bolder big-medium">
                                        Detalles del usuario como chofer de auto
                                    </h2>
                                    <VehicleRenderer
                                        vehicle={user.serviceVehicles.car}
                                        type="car"
                                    />
                                </div>
                            </Popup>
                        </>
                    ) : (
                        <span>Auto - No registrado</span>
                    )}
                    {user.serviceVehicles?.motorcycle ? (
                        <>
                            <button
                                className="service-user-option"
                                onClick={() =>
                                    setViewMoto({
                                        ...isViewMoto,
                                        isOpen: true,
                                    })
                                }
                            >
                                Moto - Licencia valida hasta{" "}
                                {timestampDateInSpanish(
                                    user.serviceVehicles?.motorcycle.license
                                        .expiredDateLicense,
                                )}
                                {differenceOnDays(
                                    user.serviceVehicles?.motorcycle.license.expiredDateLicense.toDate(),
                                ) <= 0 && (
                                    <span className="text | bolder red">
                                        {" "}
                                        - Expiro
                                    </span>
                                )}
                            </button>
                            <Popup
                                isOpen={isViewMoto.isOpen}
                                close={() =>
                                    setViewMoto({
                                        ...isViewMoto,
                                        isOpen: false,
                                    })
                                }
                            >
                                <div>
                                    <h2 className="text | bolder big-medium">
                                        Detalles del usuario como chofer de
                                        motocicleta
                                    </h2>
                                    <VehicleRenderer
                                        vehicle={
                                            user.serviceVehicles.motorcycle
                                        }
                                        type="motorcycle"
                                    />
                                </div>
                            </Popup>
                        </>
                    ) : (
                        <span>Moto - No agregado</span>
                    )}
                    {user.driverEnterpriseId ? (
                        <>
                            <button
                                className="service-user-option"
                                onClick={openDriverEnterprise}
                            >
                                Empresa de chofer registrado
                            </button>
                            <Popup
                                isOpen={isViewDriver.isOpen}
                                close={() =>
                                    setViewDriver({
                                        ...isViewDriver,
                                        isOpen: false,
                                    })
                                }
                            >
                                <div>
                                    <h2 className="text | bolder big-medium">
                                        Detalles del usuario como chofer
                                    </h2>
                                    <EnterpriseRendererWithLoader
                                        enterprise={isViewDriver.enterprise}
                                        setEnterprise={(
                                            enterpise: Enterprise | undefined,
                                        ) =>
                                            setViewDriver({
                                                ...isViewDriver,
                                                enterprise: enterpise,
                                            })
                                        }
                                        enterpriseId={user.driverEnterpriseId}
                                        type="driver"
                                    />
                                </div>
                            </Popup>
                        </>
                    ) : (
                        <span>Sin empresa de chofer registrado</span>
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
                        Ver los servicios hechos como chofer
                    </Link>
                </div>
            ) : (
                <h3 className="service-user-wrapper text | medium-big bolder">
                    Chofer - No registrado
                </h3>
            )}
            {user.services.includes(Services.Mechanic) &&
            user.serviceRequests?.mechanic?.state ===
                ServiceReqState.Approved ? (
                <div className="service-user-wrapper  | with-data">
                    <h3 className="text | medium-big bolder">Mecánico</h3>
                    {user.mechanicalWorkShopId ? (
                        <>
                            <button
                                className="service-user-option"
                                onClick={openMechanic}
                            >
                                Taller mecánico registrado
                            </button>
                            <Popup
                                isOpen={isViewMechanic.isOpen}
                                close={() =>
                                    setViewMechanic({
                                        ...isViewMechanic,
                                        isOpen: false,
                                    })
                                }
                            >
                                <div>
                                    <h2 className="text | bolder big-medium">
                                        Detalles del usuario como mecánico
                                    </h2>
                                    <EnterpriseRendererWithLoader
                                        enterprise={isViewMechanic.enterprise}
                                        setEnterprise={(
                                            enterpise: Enterprise | undefined,
                                        ) =>
                                            setViewMechanic({
                                                ...isViewMechanic,
                                                enterprise: enterpise,
                                            })
                                        }
                                        enterpriseId={user.mechanicalWorkShopId}
                                        type="mechanical"
                                    />
                                </div>
                            </Popup>
                        </>
                    ) : (
                        <span>Sin taller mecánico registrado</span>
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
                        Ver los servicios hechos como mecánico
                    </Link>
                </div>
            ) : (
                <h3 className="service-user-wrapper text | medium-big bolder">
                    Mecánico - No registrado
                </h3>
            )}
            {user.services.includes(Services.Tow) &&
            user.serviceRequests?.tow?.state === ServiceReqState.Approved ? (
                <div className="service-user-wrapper  | with-data">
                    <h3 className="text | medium-big bolder">
                        Operador de Grúa
                    </h3>
                    {user.serviceVehicles?.tow ? (
                        <>
                            <button
                                className="service-user-option"
                                onClick={openTow}
                            >
                                Licencia valida hasta{" "}
                                {timestampDateInSpanish(
                                    user.serviceVehicles?.tow.license
                                        .expiredDateLicense,
                                )}
                                {differenceOnDays(
                                    user.serviceVehicles?.tow.license.expiredDateLicense.toDate(),
                                ) <= 0 && (
                                    <span className="text | bolder red">
                                        {" "}
                                        - Expiro
                                    </span>
                                )}
                            </button>
                            <Popup
                                isOpen={isViewTow.isOpen}
                                close={() =>
                                    setViewTow({ ...isViewTow, isOpen: false })
                                }
                            >
                                <div>
                                    <h2 className="text | bolder big-medium">
                                        Detalles del usuario como operador de
                                        grúa
                                    </h2>
                                    <VehicleRenderer
                                        vehicle={user.serviceVehicles.tow}
                                        type="tow"
                                    />
                                    <EnterpriseRendererWithLoader
                                        enterprise={isViewTow.enterprise}
                                        setEnterprise={(
                                            enterpise: Enterprise | undefined,
                                        ) =>
                                            setViewTow({
                                                ...isViewTow,
                                                enterprise: enterpise,
                                            })
                                        }
                                        enterpriseId={user.towEnterpriseId}
                                        type="tow"
                                    />
                                </div>
                            </Popup>
                        </>
                    ) : (
                        <span>No agregado</span>
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
                        Ver servicios hechos como operador de grúa
                    </Link>
                </div>
            ) : (
                <h3 className="service-user-wrapper text | medium-big bolder">
                    Operador de Grúa - No registrado
                </h3>
            )}
            {user.services.includes(Services.Laundry) &&
            user.serviceRequests?.laundry?.state ===
                ServiceReqState.Approved ? (
                <div className="service-user-wrapper  | with-data">
                    <>
                        <h3 className="text | medium-big bolder">Lavadero</h3>
                        <button
                            className="service-user-option"
                            onClick={openLaundry}
                        >
                            Lavadero registrado
                        </button>
                        <Popup
                            isOpen={isViewLaundry.isOpen}
                            close={() =>
                                setViewLaundry({
                                    ...isViewLaundry,
                                    isOpen: false,
                                })
                            }
                        >
                            <div>
                                <h2 className="text | bolder big-medium">
                                    Detalles del usuario como lavadero
                                </h2>
                                <EnterpriseRendererWithLoader
                                    enterprise={isViewLaundry.enterprise}
                                    setEnterprise={(
                                        enterpise: Enterprise | undefined,
                                    ) =>
                                        setViewLaundry({
                                            ...isViewLaundry,
                                            enterprise: enterpise,
                                        })
                                    }
                                    enterpriseId={user.laundryEnterpriseId}
                                    type="laundry"
                                />
                            </div>
                        </Popup>
                    </>
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
            ) : (
                <h3 className="service-user-wrapper text | medium-big bolder">
                    Lavadero - No registrado
                </h3>
            )}
        </div>
    );
};

export default ServiceServedByUser;
