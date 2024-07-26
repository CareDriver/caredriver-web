"use client";
import Eye from "@/icons/Eye";
import HelmetSafety from "@/icons/HelmetSafety";
import { ServiceReqState, Services } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import { differenceOnDays, getFormatDate } from "@/utils/parser/ForDate";
import Link from "next/link";
import { useState } from "react";
import UserVehicleDetails from "../../requests/data_renderer/vehicle/UserVehicleDetails";
import Popup from "@/components/form/Popup";
import { Enterprise } from "@/interfaces/Enterprise";
import { getEnterpriseById } from "@/utils/requests/enterprise/EnterpriseRequester";
import WorkshopRenderer from "@/components/requests/data_renderer/enterprise/WorkshopRenderer";
import TowRenderer from "@/components/requests/data_renderer/enterprise/TowRenderer";
import LaundryRenderer from "@/components/requests/data_renderer/enterprise/LaundryRenderer";
import EnterpriseFetcher from "@/components/requests/data_renderer/enterprise/EnterpriseFetcher";

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
    const [isViewMechanic, setViewMechanic] = useState<ViewControlWithEnterprise>(
        defaultViewControlWithEnter,
    );
    const [isViewTow, setViewTow] = useState<ViewControlWithEnterprise>(
        defaultViewControlWithEnter,
    );
    const [isViewLaundry, setViewLaundry] = useState<ViewControlWithEnterprise>(
        defaultViewControlWithEnter,
    );

    const openMechanic = async () => {
        if (user.mechanicalWorkShopId && isViewMechanic.enterprise === null) {
            const enterprise = await getEnterpriseById(user.mechanicalWorkShopId);
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

    const openTow = async () => {
        if (user.towEnterpriteId && isViewTow.enterprise === null) {
            const enterprise = await getEnterpriseById(user.towEnterpriteId);
            setViewTow({
                enterprise,
                isOpen: true,
            });
        } else if (user.towEnterpriteId === undefined) {
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
        if (user.laundryEnterpriteId && isViewLaundry.enterprise === null) {
            setViewLaundry({
                ...isViewLaundry,
                isOpen: true,
            });
            await fetchLaundry(user.laundryEnterpriteId);
        } else if (user.laundryEnterpriteId === undefined) {
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
            (user.serviceRequests?.driveCar?.state === ServiceReqState.Approved ||
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
                                {getFormatDate(
                                    user.serviceVehicles?.car.license.expiredDateLicense.toDate(),
                                )}
                                {differenceOnDays(
                                    user.serviceVehicles?.car.license.expiredDateLicense.toDate(),
                                ) <= 0 && (
                                    <span className="text | bolder red"> - Expiro</span>
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
                                    <UserVehicleDetails
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
                                {getFormatDate(
                                    user.serviceVehicles?.motorcycle.license.expiredDateLicense.toDate(),
                                )}
                                {differenceOnDays(
                                    user.serviceVehicles?.motorcycle.license.expiredDateLicense.toDate(),
                                ) <= 0 && (
                                    <span className="text | bolder red"> - Expiro</span>
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
                                        Detalles del usuario como chofer de motocicleta
                                    </h2>
                                    <UserVehicleDetails
                                        vehicle={user.serviceVehicles.motorcycle}
                                        type="motorcycle"
                                    />
                                </div>
                            </Popup>
                        </>
                    ) : (
                        <span>Moto - No agregado</span>
                    )}
                    <Link
                        className="icon-wrapper text  | underline gray-icon gray-dark | margin-top-15"
                        href={`/admin/users/${user.id}/services/driver`}
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
            user.serviceRequests?.mechanic?.state === ServiceReqState.Approved ? (
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
                                    <EnterpriseFetcher
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
                                        type="mechanic"
                                    />
                                </div>
                            </Popup>
                        </>
                    ) : (
                        <span>Sin taller mecánico registrado</span>
                    )}

                    <Link
                        href={`/admin/users/${user.id}/services/mechanic`}
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
                    <h3 className="text | medium-big bolder">Operador de Grúa</h3>
                    {user.serviceVehicles?.tow ? (
                        <>
                            <button className="service-user-option" onClick={openTow}>
                                Licencia valida hasta{" "}
                                {getFormatDate(
                                    user.serviceVehicles?.tow.license.expiredDateLicense.toDate(),
                                )}
                                {differenceOnDays(
                                    user.serviceVehicles?.tow.license.expiredDateLicense.toDate(),
                                ) <= 0 && (
                                    <span className="text | bolder red"> - Expiro</span>
                                )}
                            </button>
                            <Popup
                                isOpen={isViewTow.isOpen}
                                close={() => setViewTow({ ...isViewTow, isOpen: false })}
                            >
                                <div>
                                    <h2 className="text | bolder big-medium">
                                        Detalles del usuario como operador de grúa
                                    </h2>
                                    <UserVehicleDetails
                                        vehicle={user.serviceVehicles.tow}
                                        type="tow"
                                    />
                                    <EnterpriseFetcher
                                        enterprise={isViewTow.enterprise}
                                        setEnterprise={(
                                            enterpise: Enterprise | undefined,
                                        ) =>
                                            setViewTow({
                                                ...isViewTow,
                                                enterprise: enterpise,
                                            })
                                        }
                                        enterpriseId={user.towEnterpriteId}
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
                        href={`/admin/users/${user.id}/services/tow`}
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
            user.serviceRequests?.laundry?.state === ServiceReqState.Approved ? (
                <div className="service-user-wrapper  | with-data">
                    <>
                        <h3 className="text | medium-big bolder">Lavadero</h3>
                        <button className="service-user-option" onClick={openLaundry}>
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
                                <EnterpriseFetcher
                                    enterprise={isViewLaundry.enterprise}
                                    setEnterprise={(enterpise: Enterprise | undefined) =>
                                        setViewLaundry({
                                            ...isViewLaundry,
                                            enterprise: enterpise,
                                        })
                                    }
                                    enterpriseId={user.laundryEnterpriteId}
                                    type="laundry"
                                />
                            </div>
                        </Popup>
                    </>
                    <Link
                        href={`/admin/users/${user.id}/services/laundry`}
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
