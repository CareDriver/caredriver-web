import Eye from "@/icons/Eye";
import UserIcon from "@/icons/UserIcon";
import { UserInterface } from "@/interfaces/UserInterface";
import { routeToServicesRequestedByUser } from "@/utils/route_builders/for_services/RouteBuilderForServices";
import { routeToNoFound } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";
import Link from "next/link";
import { DRIVER_PLURAL } from "@/models/Business";

const RedirectorRendererForServicesRequestedByUser = ({
    user,
}: {
    user: UserInterface;
}) => {
    return (
        <div className="form-sub-container | margin-top-25 margin-bottom-25 max-width-60">
            <h2 className="icon-wrapper | text medium-big bold">
                <UserIcon />
                Servicios solicitados como usuario normal
            </h2>
            <p className="text | light">
                Puedes monitorear los servicios que este usuario ha requerido
            </p>
            <Link
                className="service-user-wrapper  | with-data touchable"
                href={
                    user.fakeId
                        ? routeToServicesRequestedByUser("driver", user.fakeId)
                        : routeToNoFound()
                }
            >
                <h3 className="text | medium-big bold">
                    Solicitudes de {DRIVER_PLURAL}
                </h3>
                <span className="icon-wrapper text | underline gray-dark gray-icon | margin-top-15">
                    <Eye />
                    Click para ver mas información
                </span>
            </Link>
            <Link
                className="service-user-wrapper  | with-data touchable"
                href={
                    user.fakeId
                        ? routeToServicesRequestedByUser(
                              "mechanical",
                              user.fakeId,
                          )
                        : routeToNoFound()
                }
            >
                <h3 className="text | medium-big bold">
                    Solicitudes de Mecánicos
                </h3>
                <span className="icon-wrapper text | underline gray-dark gray-icon | margin-top-15">
                    <Eye />
                    Click para ver mas información
                </span>
            </Link>
            <Link
                className="service-user-wrapper  | with-data touchable"
                href={
                    user.fakeId
                        ? routeToServicesRequestedByUser("tow", user.fakeId)
                        : routeToNoFound()
                }
            >
                <h3 className="text | medium-big bold">
                    Solicitudes de Operadores de Grúas
                </h3>
                <span className="icon-wrapper text | underline gray-dark gray-icon | margin-top-15">
                    <Eye />
                    Click para ver mas información
                </span>
            </Link>
            <Link
                className="service-user-wrapper  | with-data touchable"
                href={
                    user.fakeId
                        ? routeToServicesRequestedByUser("laundry", user.fakeId)
                        : routeToNoFound()
                }
            >
                <h3 className="text | medium-big bold">
                    Solicitudes de Lavadores
                </h3>
                <span className="icon-wrapper text | underline gray-dark gray-icon | margin-top-15">
                    <Eye />
                    Click para ver mas información
                </span>
            </Link>
        </div>
    );
};

export default RedirectorRendererForServicesRequestedByUser;
