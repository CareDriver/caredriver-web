import FieldDeleted from "@/components/form/view/field_renderers/FieldDeleted";
import RouteIcon from "@/icons/RouteIcon";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";

const ServiceRouteRenderer = ({
    service,
}: {
    service: ServiceRequestInterface;
}) => {
    return (
        <div className="margin-top-25 margin-bottom-25 | max-width-60">
            <h2 className="text icon-wrapper | medium-big bold margin-bottom-15">
                <RouteIcon /> Ruta
            </h2>
            <div>
                <h3 className="text | medium bold">Desde:</h3>
                <p className="text | medium">
                    {service.pickupLocation.locationName}
                </p>
            </div>

            {service.deliveryLocation ? (
                <div>
                    <h3 className="text | medium bold | margin-top-25">
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
    );
};

export default ServiceRouteRenderer;
