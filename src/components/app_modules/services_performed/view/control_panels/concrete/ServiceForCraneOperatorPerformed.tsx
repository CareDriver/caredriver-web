"use client";

import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import RendererOfTheUsersInvolvedInTheService from "../../renderers/RendererOfTheUsersInvolvedInTheService";
import ServicePriceDetailsRenderer from "../../renderers/ServicePriceDetailsRenderer";
import { buildUrlDB } from "@/interfaces/RouteNavigationInterface";
import { UserServices } from "@/interfaces/Services";
import { Locations } from "@/interfaces/Locations";
import MapRealTime from "@/components/form/view/field_renderers/MapRealTime";
import VehicleDetailRenderer from "../../renderers/VehicleDetailRenderer";
import ServiceHeaderRenderer from "../../renderers/ServiceHeaderRenderer";
import ServiceRouteRenderer from "../../renderers/ServiceRouteRenderer";
import { UserInterface } from "@/interfaces/UserInterface";
import GuardOfModule from "@/components/guards/views/module_guards/GuardOfModule";
import { ROLES_TO_VIEW_USER_SERVICES } from "@/components/guards/models/PermissionsByUserRole";
import ShareServiceByLink from "../../renderers/ShareServiceByLink";
import { checkPermission } from "@/components/guards/validators/RoleValidator";
import { isLessTime } from "@/utils/helpers/DateHelper";

interface Props {
  service: ServiceRequestInterface;
  reviewerUser: UserInterface;
}

const ServiceForCraneOperatorPerformed: React.FC<Props> = ({
  service,
  reviewerUser,
}) => {
  const renderMap = () => (
    <MapRealTime
      databaseURL={buildUrlDB(
        UserServices.Tow,
        service.location ? service.location : Locations.CochabambaBolivia,
      )}
      serviceId={service.id}
      isCanceled={service.canceled ? service.canceled : false}
      isFinished={service.finished ? service.finished : false}
    />
  );
  return (
    <section className="render-data-wrapper">
      <ServiceHeaderRenderer service={service} />
      <ShareServiceByLink reviewerUser={reviewerUser} service={service} />
      <RendererOfTheUsersInvolvedInTheService service={service} />
      <ServicePriceDetailsRenderer service={service} />

      <GuardOfModule user={reviewerUser} roles={ROLES_TO_VIEW_USER_SERVICES}>
        <VehicleDetailRenderer
          titleSection="Detalles del vehículo remolcado"
          vehicle={service.vehicle}
        />
        <ServiceRouteRenderer service={service} />
        {renderMap()}
      </GuardOfModule>

      {!checkPermission(reviewerUser.role, ROLES_TO_VIEW_USER_SERVICES) &&
        isLessTime(service.sharing) &&
        renderMap()}
    </section>
  );
};

export default ServiceForCraneOperatorPerformed;
