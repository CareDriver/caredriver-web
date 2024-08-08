import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { TypeOfServicePerformed } from "../models/TypeOfServicePerformed";
import BaseCardForServicePerf from "./BaseCardForServicePerf";

const CardForServicePerfWithLocation = ({
    userId,
    service,
    typeOfService,
    typeOfPerf,
}: {
    userId: string;
    service: ServiceRequestInterface;
    typeOfService: "driver" | "mechanic" | "tow" | "laundry";
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
