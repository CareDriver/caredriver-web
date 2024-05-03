"use client";
import Eye from "@/icons/Eye";
import HelmetSafety from "@/icons/HelmetSafety";
import { ServiceReqState } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import Link from "next/link";

const ServiceServedByUser = ({ user }: { user: UserInterface }) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <div>
                <h2 className="text icon-wrapper | medium-big bold">
                    <HelmetSafety />
                    Servicios
                </h2>
                <p>Puedes administrar los servicios que este usuario ofrece</p>
                {user.serviceRequests?.driveCar?.state === ServiceReqState.Approved ||
                user.serviceRequests?.driveMotorcycle?.state ===
                    ServiceReqState.Approved ? (
                    <Link href={`/admin/users/${user.id}/services/driver`}>
                        <h3>Chofer</h3>
                        {user.serviceVehicles?.car ? (
                            <span>
                                Auto - Licencia valida hasta{" "}
                                {user.serviceVehicles?.car.license.expiredDateLicense
                                    .toDate()
                                    .toISOString()}
                            </span>
                        ) : (
                            <span>No registrado</span>
                        )}
                        {user.serviceVehicles?.motorcycle ? (
                            <span>
                                Moto - Licencia valida hasta{" "}
                                {user.serviceVehicles?.motorcycle.license.expiredDateLicense
                                    .toDate()
                                    .toISOString()}
                            </span>
                        ) : (
                            <span>No agregado</span>
                        )}
                        <span className="icon-wrapper | gray-icon">
                            <Eye />
                            Click para ver mas informacion
                        </span>
                    </Link>
                ) : (
                    <Link href={`/admin/users/${user.id}/services/driver`}>
                        <h3>Chofer - No registrado</h3>
                    </Link>
                )}
                {user.serviceRequests?.mechanic?.state === ServiceReqState.Approved ? (
                    <Link href={`/admin/users/${user.id}/services/mechanic`}>
                        <h3>Mecanico</h3>
                        <span className="icon-wrapper | gray-icon">
                            <Eye />
                            Click para ver mas informacion
                        </span>
                    </Link>
                ) : (
                    <Link href={`/admin/users/${user.id}/services/mechanic`}>
                        <h3>Mecanico - No registrado</h3>
                    </Link>
                )}
                {user.serviceRequests?.tow?.state === ServiceReqState.Approved ? (
                    <Link href={`/admin/users/${user.id}/services/tow`}>
                        <h3>Operador de Grua</h3>
                        {user.serviceVehicles?.tow ? (
                            <span>
                                Licencia valida hasta{" "}
                                {user.serviceVehicles?.tow.license.expiredDateLicense
                                    .toDate()
                                    .toISOString()}
                            </span>
                        ) : (
                            <span>No agregado</span>
                        )}
                        <span className="icon-wrapper | gray-icon">
                            <Eye />
                            Click para ver mas informacion
                        </span>
                    </Link>
                ) : (
                    <Link href={`/admin/users/${user.id}/services/tow`}>
                        <h3>Operador de Grua - No registrado</h3>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ServiceServedByUser;
