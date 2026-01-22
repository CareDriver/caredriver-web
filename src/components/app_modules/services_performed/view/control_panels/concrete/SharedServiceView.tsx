"use client";

import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { buildUrlDB } from "@/interfaces/RouteNavigationInterface";
import { UserServices } from "@/interfaces/Services";
import { Locations } from "@/interfaces/Locations";
import MapRealTime from "@/components/form/view/field_renderers/MapRealTime";
import { ServiceType } from "@/interfaces/Services";
import ServiceHeaderRenderer from "../../renderers/ServiceHeaderRenderer";
import RendererOfTheUsersInvolvedInTheService from "../../renderers/RendererOfTheUsersInvolvedInTheService";
import ServiceRouteRenderer from "../../renderers/ServiceRouteRenderer";

interface Props {
  service: ServiceRequestInterface;
  type: ServiceType;
}

const SharedServiceView: React.FC<Props> = ({ service, type }) => {
  const renderMap = () => (
    <MapRealTime
      databaseURL={buildUrlDB(
        UserServices.Driver,
        service.location ? service.location : Locations.CochabambaBolivia,
      )}
      serviceId={service.id}
      isCanceled={service.canceled ? service.canceled : false}
      isFinished={service.finished ? service.finished : false}
    />
  );

  return (
    <section className="render-data-wrapper | shared-service-view">
      <style>{`
        .shared-service-view {
          max-width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 0;
          background: white;
        }

        .shared-service-view .map-section {
          flex: 1;
          width: 100%;
          min-height: 70vh;
        }

        .shared-service-view .info-section {
          flex: 0 0 auto;
          max-height: 30vh;
          overflow-y: auto;
          padding: 20px;
          background: white;
          border-top: 1px solid #f0f0f0;
        }

        .shared-service-view .info-section > * {
          margin-bottom: 15px;
        }

        .shared-service-view .info-section > *:last-child {
          margin-bottom: 0;
        }
      `}</style>

      <div className="map-section">{renderMap()}</div>

      <div className="info-section">
        <ServiceHeaderRenderer service={service} />
        <RendererOfTheUsersInvolvedInTheService service={service} />
        <ServiceRouteRenderer service={service} />
      </div>
    </section>
  );
};

export default SharedServiceView;
