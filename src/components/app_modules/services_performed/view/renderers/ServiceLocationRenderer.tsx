import LocationDot from "@/icons/LocationDot";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";

const ServiceLocationRenderer = ({
    service,
}: {
    service: ServiceRequestInterface;
}) => {
    return (
        <div className="margin-top-25 margin-bottom-25 | max-width-60">
            <h2 className="text icon-wrapper | medium-big bold margin-bottom-15">
                <LocationDot /> Ubicación
            </h2>
            <p className="text | medium">
                {service.pickupLocation.locationName}
            </p>
        </div>
    );
};

export default ServiceLocationRenderer;
