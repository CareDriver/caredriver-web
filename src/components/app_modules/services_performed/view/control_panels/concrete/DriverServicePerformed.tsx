"use client";

import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import RendererOfTheUsersInvolvedInTheService from "../../renderers/RendererOfTheUsersInvolvedInTheService";
import ServicePriceDetailsRenderer from "../../renderers/ServicePriceDetailsRenderer";
import { buildUrlDB } from "@/interfaces/RouteNavigationInterface";
import { UserServices } from "@/interfaces/Services";
import { Locations } from "@/interfaces/Locations";
import { VEHICLE_CATEGORY_TO_SPANISH } from "@/components/app_modules/server_users/models/VehicleFields";
import MapRealTime from "@/components/form/view/field_renderers/MapRealTime";
import ServiceHeaderRenderer from "../../renderers/ServiceHeaderRenderer";
import VehicleDetailRenderer from "../../renderers/VehicleDetailRenderer";
import ServiceRouteRenderer from "../../renderers/ServiceRouteRenderer";
import { UserInterface } from "@/interfaces/UserInterface";
import GuardOfModule from "@/components/guards/views/module_guards/GuardOfModule";
import { ROLES_TO_VIEW_USER_SERVICES } from "@/components/guards/models/PermissionsByUserRole";

interface Props {
    service: ServiceRequestInterface;
    reviewerUser: UserInterface;
}

const DriverServicePerformed: React.FC<Props> = ({ service, reviewerUser }) => {
    return (
        <section className="render-data-wrapper">
            <ServiceHeaderRenderer service={service} />
            <RendererOfTheUsersInvolvedInTheService service={service} />
            <ServicePriceDetailsRenderer service={service} />

            <GuardOfModule
                user={reviewerUser}
                roles={ROLES_TO_VIEW_USER_SERVICES}
            >
                <VehicleDetailRenderer
                    titleSection={`Detalles del vehículo de Transporte
                    ${
                        service.vehicle?.type &&
                        " - ".concat(
                            VEHICLE_CATEGORY_TO_SPANISH[service.vehicle.type],
                        )
                    }`}
                    vehicle={service.vehicle}
                />
                <ServiceRouteRenderer service={service} />
                <MapRealTime
                    databaseURL={buildUrlDB(
                        UserServices.Driver,
                        service.location
                            ? service.location
                            : Locations.CochabambaBolivia,
                    )}
                    serviceId={service.id}
                    isCanceled={service.canceled ? service.canceled : false}
                    isFinished={service.finished ? service.finished : false}
                />
            </GuardOfModule>
        </section>
    );
};
// 1aMgTX331lPYqz64Pga
export default DriverServicePerformed;
