import Eye from "@/icons/Eye";
import UserIcon from "@/icons/UserIcon";
import { UserInterface } from "@/interfaces/UserInterface";
import Link from "next/link";

const ServiceReqsByUser = ({ user }: { user: UserInterface }) => {
    return (
        <div>
            <h2 className="text icon-wrapper | medium-big bold">
                <UserIcon />
                Servicios solicitados como usuario normal
            </h2>
            <p>Puedes monitorear los servicios que este usuario ha requerido</p>
            <Link href={`/admin/users/${user.id}/servicerequests/drive`}>
                <h3>Solicitudes para Choferes</h3>
                <span className="icon-wrapper | gray-icon">
                    <Eye />
                    Click para ver mas informacion
                </span>
            </Link>
            <Link href={`/admin/users/${user.id}/servicerequests/mechanic`}>
                <h3>Solicitudes para Mecanicos</h3>
                <span className="icon-wrapper | gray-icon">
                    <Eye />
                    Click para ver mas informacion
                </span>
            </Link>
            <Link href={`/admin/users/${user.id}/servicerequests/tow`}>
                <h3>Solicitudes para Operadores de Gruas</h3>
                <span className="icon-wrapper | gray-icon">
                    <Eye />
                    Click para ver mas informacion
                </span>
            </Link>
        </div>
    );
};

export default ServiceReqsByUser;
