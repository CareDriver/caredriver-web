"use client";

import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
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
import MapRealTime from "@/components/form/view/field_renderers/MapRealTime";

const LaundryServiceView = ({
    service,
}: {
    service: ServiceRequestInterface;
}) => {
    return (
        <section className="render-data-wrapper">
            <h1 className="text | bolder big">
                {service.requestReason.trim().length > 0
                    ? service.requestReason
                    : "Servicio de lavadero"}
            </h1>
            <div className="row-wrapper">
                <h2>
                    {service.price?.price} {service.price?.currency} -
                </h2>
                <RendererOfServiceStatusPerf service={service} />
            </div>

            <UsersOnService service={service} />

            <div className="margin-bottom-50">
                <h2 className="text icon-wrapper | big-medium-v4 bold nb margin-bottom-15">
                    <Car />
                    Vehículo lavado -{" "}
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
                <h3 className="text | medium bolder">Ubicación</h3>
                <p className="text | medium">
                    {service.pickupLocation.locationName}
                </p>
            </div>

            <MapRealTime
                databaseURL={buildUrlDB(
                    UserServices.Laundry,
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

export default LaundryServiceView;
