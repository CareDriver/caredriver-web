"use client";

import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import UsersOnService from "../UsersOnService";
import Car from "@/icons/Car";
import { getVehicleSizeLabel } from "@/interfaces/VehicleInterface";
import RendererOfPriceOfServicePerf from "../RendererOfPriceOfServicePerf";
import { buildUrlDB } from "@/interfaces/RouteNavigationInterface";
import { UserServices } from "@/interfaces/Services";
import { Locations } from "@/interfaces/Locations";
import RendererOfServiceStatusPerf from "../RendererOfServiceStatusPerf";
import {
    TRANSMITION_TO_SPANISH,
    VEHICLE_CATEGORY_TO_SPANISH,
} from "@/components/app_modules/server_users/models/VehicleFields";
import FieldDeleted from "@/components/form/view/field_renderers/FieldDeleted";
import MapRealTime from "@/components/form/view/field_renderers/MapRealTime";

const DriverServiceView = ({
    service,
}: {
    service: ServiceRequestInterface;
}) => {
    return (
        <section className="render-data-wrapper">
            <h1 className="text | bolder big">
                Servicio{" "}
                {service.createdAt &&
                    `hecho el ${timestampDateInSpanish(service.createdAt)}`}
            </h1>
            <div className="row-wrapper">
                {service.price?.price && service.price?.currency && (
                    <h2>
                        {service.price?.price} {service.price?.currency} -
                    </h2>
                )}
                <RendererOfServiceStatusPerf service={service} />
            </div>
            <p className="text | light">{service.requestReason}</p>

            <UsersOnService service={service} />

            <div className="margin-bottom-50">
                <h2 className="text icon-wrapper | big-medium-v4 bold nb margin-bottom-15">
                    <Car />
                    Vehículo de Transporte -{" "}
                    {service.vehicle?.type &&
                        VEHICLE_CATEGORY_TO_SPANISH[service.vehicle.type]}
                </h2>
                <p className="text | medium gray-dark">
                    <b>Nombre:</b> {service.vehicle?.name}
                </p>
                {service.vehicle?.description &&
                    service.vehicle?.description.trim().length > 0 && (
                        <p className="text | medium gray-dark">
                            <b>Descripcion:</b> {service.vehicle?.description}
                        </p>
                    )}
                <p className="text | medium gray-dark">
                    <b>Veces usadas:</b> {service.vehicle?.usedTimes}
                </p>
                {service.vehicle?.transmission && (
                    <p className="text | medium gray-dark">
                        <b>Transmisión:</b>{" "}
                        {TRANSMITION_TO_SPANISH[service.vehicle?.transmission]}
                    </p>
                )}
                {service.vehicle?.size && (
                    <p className="text | medium gray-dark">
                        <b>Tamaño:</b>{" "}
                        {getVehicleSizeLabel[service.vehicle.size]}
                    </p>
                )}
            </div>

            <RendererOfPriceOfServicePerf service={service} />

            <div className="max-width-50 margin-bottom-50">
                <div>
                    <h3 className="text | medium bolder">Desde:</h3>
                    <p className="text | medium">
                        {service.pickupLocation.locationName}
                    </p>
                </div>

                {service.deliveryLocation ? (
                    <div>
                        <h3 className="text | medium bolder | margin-top-25">
                            Hasta:
                        </h3>
                        <p className="text | medium">
                            {service.deliveryLocation.locationName}
                        </p>
                    </div>
                ) : (
                    <FieldDeleted description="No se establecio el destino final" />
                )}
            </div>

            <MapRealTime
                databaseURL={buildUrlDB(
                    UserServices.Driver,
                    service.location
                        ? service.location
                        : Locations.CochabambaBolivia,
                )}
                serviceId={service.id}
                isCanceled={service.canceled ? service.canceled : false}
                isFinished={service.finished ? service.finished : false}
            />
        </section>
    );
};
// 1aMgTX331lPYqz64Pga
export default DriverServiceView;
