import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import ServiceStatusRenderer from "./ServiceStatusRenderer";
import NoteSticky from "@/icons/NoteSticky";

const ServiceHeaderRenderer = ({
  service,
}: {
  service: ServiceRequestInterface;
}) => {
  return (
    <>
      <h1 className="text | bold big">
        Servicio del{" "}
        <i className="text | bold big">
          {service.createdAt && timestampDateInSpanish(service.createdAt)}
        </i>
      </h1>
      <div className="row-wrapper">
        <ServiceStatusRenderer service={service} />
        {service.price?.price && service.price?.currency && (
          <h2 className="text medium-big bold">
            {service.price?.price} {service.price?.currency} -
          </h2>
        )}
      </div>
      {service.requestReason && (
        <p className="text | wrap bold medium icon-wrapper">
          <NoteSticky />
          {service.requestReason}
        </p>
      )}
    </>
  );
};

export default ServiceHeaderRenderer;
