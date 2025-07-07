import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import BaseCardForServicePerf from "./BaseCardForServicePerf";
import { ServiceType } from "@/interfaces/Services";

interface Props {
  service: ServiceRequestInterface;
  fakeUserServerId?: string;
  typeOfService: ServiceType;
}

const CardForServicePerfWithReason: React.FC<Props> = ({
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
      <div className="margin-top-25 margin-bottom-15">
        <h4 className="text | bold gray-dark">Ubicación</h4>
        <p className="text | gray-dark">
          {service.pickupLocation.locationName}
        </p>
      </div>
    </BaseCardForServicePerf>
  );
};

export default CardForServicePerfWithReason;
