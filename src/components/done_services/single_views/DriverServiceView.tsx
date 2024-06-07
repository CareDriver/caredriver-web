"use client";

import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { toformatDate } from "@/utils/parser/ForDate";
import UsersOnService from "./UsersOnService";
import Car from "@/icons/Car";
import { vehicleModeRenderV2, vehicleTypeRender } from "@/interfaces/VehicleInterface";
import FieldDeleted from "@/components/requests/data_renderer/form/FieldDeleted";
import PolylineMap from "@/components/requests/data_renderer/map/PolylineMap";

const DriverServiceView = ({ service }: { service: ServiceRequestInterface }) => {
    console.log(service.pickupLocation);
    console.log(service.deliveryLocation);

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
            <h1 className="text | bolder big">
                Servicio{" "}
                {service.createdAt &&
                    `hecho el ${toformatDate(service.createdAt?.toDate())}`}
            </h1>
            <div className="row-wrapper">
                <h2>
                    {service.price?.price} {service.price?.currency} -
                </h2>
                {getState(service)}
            </div>
            <p className="text | light">{service.requestReason}</p>

            <UsersOnService service={service} />

            <div className="margin-bottom-50">
                <h2 className="text icon-wrapper | big-medium-v4 bold nb margin-bottom-15">
                    <Car />
                    Vehiculo de Transporte -{" "}
                    {service.vehicle?.type && vehicleTypeRender[service.vehicle.type]}
                </h2>
                <p className="text | medium gray-dark">
                    <b>Nombre:</b> {service.vehicle?.name}
                </p>
                <p className="text | medium gray-dark">
                    <b>Descripcion:</b> {service.vehicle?.description}
                </p>
                <p className="text | medium gray-dark">
                    <b>Veces usadas:</b> {service.vehicle?.usedTimes}
                </p>
                {service.vehicle?.transmission && (
                    <p className="text | medium gray-dark">
                        <b>Transmicion:</b>{" "}
                        {vehicleModeRenderV2[service.vehicle?.transmission]}
                    </p>
                )}
            </div>

            <div className="max-width-50 margin-bottom-50">
                <div>
                    <h3 className="text | medium bolder">Desde:</h3>
                    <p className="text | medium">{service.pickupLocation.locationName}</p>
                </div>

                {service.deliveryLocation ? (
                    <div>
                        <h3 className="text | medium bolder | margin-top-25">Hasta:</h3>
                        <p className="text | medium">
                            {service.deliveryLocation.locationName}
                        </p>
                    </div>
                ) : (
                    <FieldDeleted description="No se establecio el destino final" />
                )}
            </div>

            {service.pickupLocation.latitude &&
            service.pickupLocation.longitude &&
            service.deliveryLocation &&
            service.deliveryLocation.latitude &&
            service.deliveryLocation.longitude &&
            (false) ? (
                <fieldset className="form-section">
                    <PolylineMap
                        start={{
                            lat: service.pickupLocation.latitude,
                            lng: service.pickupLocation.longitude,
                        }}
                        end={{
                            lat: service.deliveryLocation.latitude,
                            lng: service.deliveryLocation.longitude,
                        }}
                        coordinates={[]}
                    />
                </fieldset>
            ) : (
                <div className="max-width-60">
                    <FieldDeleted description={"No hay registro del la navegacion"} />
                </div>
            )}
        </section>
    );
};

export default DriverServiceView;
