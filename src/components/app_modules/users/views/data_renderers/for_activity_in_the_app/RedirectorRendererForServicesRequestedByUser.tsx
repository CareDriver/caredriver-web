import Eye from "@/icons/Eye";
import UserIcon from "@/icons/UserIcon";
import { UserInterface } from "@/interfaces/UserInterface";
import { routeToServicesRequestedByUser } from "@/utils/route_builders/as_admin/RouteBuilderForServiceAsAdmin";
import { routeToNoFound } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";
import Link from "next/link";

const RedirectorRendererForServicesRequestedByUser = ({
    user,
}: {
    user: UserInterface;
}) => {
    return (
        <div className="form-sub-container | margin-top-25 margin-bottom-25 max-width-60">
            <h2 className="icon-wrapper | text medium-big bolder">
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
                <h3 className="text | medium-big bolder">
                    Solicitudes de Choferes
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
                <h3 className="text | medium-big bolder">
                    Solicitudes de Mecanicos
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
                <h3 className="text | medium-big bolder">
                    Solicitudes de Operadores de Gruas
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
                <h3 className="text | medium-big bolder">
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
