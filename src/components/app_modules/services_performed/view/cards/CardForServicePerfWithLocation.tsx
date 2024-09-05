import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import BaseCardForServicePerf from "./BaseCardForServicePerf";
import { ServiceType } from "@/interfaces/Services";

interface Props {
    service: ServiceRequestInterface;
    fakeUserServerId?: string;
    typeOfService: ServiceType;
}

const CardForServicePerfWithLocation: React.FC<Props> = ({
    service,
    fakeUserServerId,
    typeOfService,
}) => {
    return (
        <BaseCardForServicePerf
            service={service}
            typeOfService={typeOfService}
            fakeUserServerId={fakeUserServerId}
        >
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
