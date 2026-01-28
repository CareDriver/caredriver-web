"use client";

import { useMemo } from "react";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { buildUrlDB } from "@/interfaces/RouteNavigationInterface";
import { UserServices, ServiceType } from "@/interfaces/Services";
import { Locations } from "@/interfaces/Locations";
import MapRealTime from "@/components/form/view/field_renderers/MapRealTime";
import ServiceHeaderRenderer from "../../renderers/ServiceHeaderRenderer";
import RendererOfTheUsersInvolvedInTheService from "../../renderers/RendererOfTheUsersInvolvedInTheService";
import ServiceRouteRenderer from "../../renderers/ServiceRouteRenderer";

interface Props {
  service: ServiceRequestInterface;
  type: ServiceType;
}

const SharedServiceView: React.FC<Props> = ({ service }) => {
  const databaseURL = useMemo(() => {
    return buildUrlDB(
      UserServices.Driver,
      service.location ?? Locations.CochabambaBolivia,
    );
  }, [service.location]);

  return (
    <section className="render-data-wrapper | shared-service-view">
      <style>{`
        .shared-service-view {
          max-width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 0;
          background: white;
        }

        .map-section {
          flex: 1;
          min-height: 70vh;
        }

        .info-section {
          max-height: 30vh;
          overflow-y: auto;
          padding: 20px;
          border-top: 1px solid #f0f0f0;
        }
      `}</style>

      <div className="map-section">
        <MapRealTime
          databaseURL={databaseURL}
          serviceId={service.id}
          isCanceled={!!service.canceled}
          isFinished={!!service.finished}
        />
      </div>

      <div className="info-section">
        <ServiceHeaderRenderer service={service} />
        <RendererOfTheUsersInvolvedInTheService service={service} />
        <ServiceRouteRenderer service={service} />
      </div>
    </section>
  );
};

export default SharedServiceView;
