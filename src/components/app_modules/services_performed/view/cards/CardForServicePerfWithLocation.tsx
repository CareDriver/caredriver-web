import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import BaseCardForServicePerf from "./BaseCardForServicePerf";
import { TypeOfServicePerformed } from "../../model/models/TypeOfServicePerformed";
import { ServiceType } from "@/interfaces/Services";

const CardForServicePerfWithLocation = ({
    userId,
    service,
    typeOfService,
    typeOfPerf,
}: {
    userId: string;
    service: ServiceRequestInterface;
    typeOfService: ServiceType;
    typeOfPerf: TypeOfServicePerformed;
}) => {
    return (
        <BaseCardForServicePerf
            userId={userId}
            service={service}
            typeOfService={typeOfService}
            typeOfPerf={typeOfPerf}
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
