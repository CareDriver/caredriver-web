import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { TypeOfServicePerformed } from "../../model/models/TypeOfServicePerformed";
import BaseCardForServicePerf from "./BaseCardForServicePerf";

const CardForServicePerfWithReason = ({
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
            <div className="margin-top-25 margin-bottom-15">
                <h4 className="text | bold gray-dark">Ubicación</h4>
                <p className="text | gray-dark">{service.pickupLocation.locationName}</p>
            </div>
        </BaseCardForServicePerf>
    );
};

export default CardForServicePerfWithReason;
