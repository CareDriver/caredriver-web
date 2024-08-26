import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import BaseCardForServicePerf from "./BaseCardForServicePerf";
import { ServiceType } from "@/interfaces/Services";

interface Props {
    service: ServiceRequestInterface;
    typeOfService: ServiceType;
}

const CardForServicePerfWithLocation: React.FC<Props> = ({
    service,
    typeOfService,
}) => {
    return (
        <BaseCardForServicePerf service={service} typeOfService={typeOfService}>
            <>
                <div className="margin-bottom-15">
                    <h4 className="text | bold gray-dark">Desde</h4>
                    <p className="text | gray-dark">
                        {service.pickupLocation.locationName}
                    </p>
                </div>

                {service.deliveryLocation && (
                    <div className="margin-bottom-15">
                        <h4 className="text | bold gray-dark">Hasta</h4>
                        <p className="text | gray-dark">
                            {service.deliveryLocation.locationName}
                        </p>
                    </div>
                )}
            </>
        </BaseCardForServicePerf>
    );
};

export default CardForServicePerfWithLocation;
