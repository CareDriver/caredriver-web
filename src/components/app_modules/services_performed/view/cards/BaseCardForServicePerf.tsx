import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import Link from "next/link";
import { getServicePerfStatus } from "../../model/utils/ServiceStatusGetter";
import { ServiceType } from "@/interfaces/Services";
import { routeToServicePerformed } from "@/utils/route_builders/for_services/RouteBuilderForServices";
import ServiceStatusRenderer from "../renderers/ServiceStatusRenderer";

interface Props {
  service: ServiceRequestInterface;
  typeOfService: ServiceType;
  fakeUserServerId?: string;
  children: undefined | React.ReactNode;
}

const BaseCardForServicePerf: React.FC<Props> = ({
  service,
  typeOfService,
  fakeUserServerId,
  children,
}) => {
  const HAS_FAKED_ID = service.fakedId !== undefined;
  const LINK_TO = service.fakedId
    ? routeToServicePerformed(typeOfService, service.fakedId, fakeUserServerId)
    : undefined;
  let serviceState = getServicePerfStatus(service);

  const renderBodyCard = () => (
    <>
      {service.createdAt && (
        <h3 className="text | wrap medium-big bold">
          {timestampDateInSpanish(service.createdAt)}
        </h3>
      )}
      {service.price && service.price.price && (
        <h3 className="text | bold margin-bottom-25">
          {service.price.price} {service.price.currency}
        </h3>
      )}

      {children && children}
    </>
  );

  if (!HAS_FAKED_ID || !LINK_TO) {
    return (
      <div
        className={`service-item-wrapper | disabled | ${serviceState.borderStyle}`}
        title="El servicio no fue registrado correctamente"
      >
        {renderBodyCard()}
        <ServiceStatusRenderer service={service} size="small" />
        <div className="text | small red wrap">
          El servicio no fue registrado correctamente - No se pueden ver mas
          detalles
        </div>
      </div>
    );
  }

  return (
    <Link
      href={LINK_TO}
      className={`service-item-wrapper | touchable ${serviceState.borderStyle}`}
    >
      {renderBodyCard()}
      <ServiceStatusRenderer service={service} size="small" />
    </Link>
  );
};

export default BaseCardForServicePerf;
