import Eye from "@/icons/Eye";
import UserIcon from "@/icons/UserIcon";
import { UserInterface } from "@/interfaces/UserInterface";
import Link from "next/link";

const ServiceReqsByUser = ({ user }: { user: UserInterface }) => {
    return (
        <div className="form-sub-container | margin-top-25 margin-bottom-25 max-width-60">
            <h2 className="icon-wrapper profile-subtitle">
                <UserIcon />
                Servicios solicitados como usuario normal
            </h2>
            <p className="text | light">
                Puedes monitorear los servicios que este usuario ha requerido
            </p>
            <Link
                className="service-user-wrapper  | with-data touchable"
                href={`/admin/users/${user.id}/servicerequests/driver`}
            >
                <h3 className="text | medium-big bolder">Solicitudes de Choferes</h3>
                <span className="icon-wrapper text | underline gray-dark gray-icon | margin-top-15">
                    <Eye />
                    Click para ver mas informacion
                </span>
            </Link>
            <Link
                className="service-user-wrapper  | with-data touchable"
                href={`/admin/users/${user.id}/servicerequests/mechanic`}
            >
                <h3 className="text | medium-big bolder">Solicitudes de Mecanicos</h3>
                <span className="icon-wrapper text | underline gray-dark gray-icon | margin-top-15">
                    <Eye />
                    Click para ver mas informacion
                </span>
            </Link>
            <Link
                className="service-user-wrapper  | with-data touchable"
                href={`/admin/users/${user.id}/servicerequests/tow`}
            >
                <h3 className="text | medium-big bolder">
                    Solicitudes de Operadores de Gruas
                </h3>
                <span className="icon-wrapper text | underline gray-dark gray-icon | margin-top-15">
                    <Eye />
                    Click para ver mas informacion
                </span>
            </Link>
            <Link
                className="service-user-wrapper  | with-data touchable"
                href={`/admin/users/${user.id}/servicerequests/laundry`}
            >
                <h3 className="text | medium-big bolder">Solicitudes de Lavadores</h3>
                <span className="icon-wrapper text | underline gray-dark gray-icon | margin-top-15">
                    <Eye />
                    Click para ver mas informacion
                </span>
            </Link>
        </div>
    );
};

export default ServiceReqsByUser;
