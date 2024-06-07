"use client";

import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { toformatDate } from "@/utils/parser/ForDate";
import UsersOnService from "./UsersOnService";
import Car from "@/icons/Car";
import { vehicleModeRenderV2, vehicleTypeRender } from "@/interfaces/VehicleInterface";
import FieldDeleted from "@/components/requests/data_renderer/form/FieldDeleted";
import PolylineMap from "@/components/requests/data_renderer/map/PolylineMap";
import { toLocation } from "@/utils/parser/ToCoordinates";
import MarkRenderer from "@/components/requests/data_renderer/map/MarkRenderer";

const MechanicServiceView = ({ service }: { service: ServiceRequestInterface }) => {
    const getState = (service: ServiceRequestInterface) => {
        if (service.finished) {
            return <h2 className="text | medium-big bolder green">Finalizado</h2>;
        } else if (service.canceled) {
            return <h2 className="text | medium-big bolder red">Cancelado</h2>;
        } else {
            return <h2 className="text | medium-big bolder yellow">Esta en progreso</h2>;
        }
    };

    return (
        <section className="render-data-wrapper">
            <h1 className="text | bolder big">{service.requestReason}</h1>
            <div className="row-wrapper | text">
                <h2>
                    Servicio{" "}
                    {service.createdAt &&
                        `hecho el ${toformatDate(service.createdAt?.toDate())}`}{" "}
                    -
                </h2>
                {getState(service)}
            </div>

            <UsersOnService service={service} />

            <div className="margin-bottom-50">
                <h2 className="text icon-wrapper | big-medium-v4 bold nb margin-bottom-15">
                    <Car />
                    Vehiculo usado para el servicio mecanico -{" "}
                    {service.vehicle?.type && vehicleTypeRender[service.vehicle.type]}
                </h2>
                <p className="text | medium gray-dark">
                    <b>Nombre:</b> {service.vehicle?.name}
                </p>
                <p className="text | medium gray-dark">
                    <b>Descripcion:</b> {service.vehicle?.description}
                </p>
                {service.vehicle?.transmission && (
                    <p className="text | medium gray-dark">
                        <b>Transmicion:</b>{" "}
                        {vehicleModeRenderV2[service.vehicle?.transmission]}
                    </p>
                )}
            </div>

            <div className="max-width-50 margin-bottom-50">
                <h3 className="text | medium bolder">Ubicacion</h3>
                <p className="text | medium">{service.pickupLocation.locationName}</p>
            </div>

            {service.pickupLocation.coordinates &&
            (false) ? (
                <fieldset className="form-section">
                    <MarkRenderer
                        location={toLocation(service.pickupLocation.coordinates)}
                    />
                </fieldset>
            ) : (
                <div className="max-width-60">
                    <FieldDeleted description={"No se registro el lugar para realizar el servicio de mecanico"} />
                </div>
            )}
        </section>
    );
};

export default MechanicServiceView;
