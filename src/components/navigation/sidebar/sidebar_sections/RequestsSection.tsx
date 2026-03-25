import AddressCar from "@/icons/AddressCar";
import Building from "@/icons/Building";
import Camera from "@/icons/Camera";
import Car from "@/icons/Car";
import Repeat from "@/icons/Repeat";
import Soap from "@/icons/Soap";
import Taxi from "@/icons/Taxi";
import Truck from "@/icons/Truck";
import Warehouse from "@/icons/Warehouse";
import Wrench from "@/icons/Wrench";
import { DRIVER, DRIVER_PLURAL } from "@/models/Business";
import {
  routeToRequestsToEditEnterpriseAsAdmin,
  routeToEnterpriseRegistrationRequestsAsAdmin,
} from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import { routeToUserRequestsToRenewPhotoAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import {
  routeToRequestsToBeUserServerAsAdmin,
  routeToRequestsToRenewLicenseAsAdmin,
  routeToUserRequestsToChangeEnterpriseAsAdmin,
} from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";
import { toCapitalize } from "@/utils/text_helpers/TextFormatter";
import Link from "next/link";

const RequestsSection = ({ pathname }: { pathname: string }) => {
  return (
    <>
      <span className="text | white medium bold | margin-bottom-15">
        Solicitudes
      </span>
      <li className="sidebar-options | margin-bottom-25">
        <Link
          href={routeToRequestsToBeUserServerAsAdmin("driver")}
          className={`sidebar-option ${
            pathname.includes(routeToRequestsToBeUserServerAsAdmin("driver")) &&
            "selected"
          }`}
        >
          <Car />
          <span>{toCapitalize(DRIVER)}</span>
        </Link>
        <Link
          href={routeToRequestsToBeUserServerAsAdmin("mechanical")}
          className={`sidebar-option ${
            pathname.includes(
              routeToRequestsToBeUserServerAsAdmin("mechanical"),
            ) && "selected"
          }`}
        >
          <Wrench />
          <span>Mecánico</span>
        </Link>
        <Link
          href={routeToRequestsToBeUserServerAsAdmin("tow")}
          className={`sidebar-option lb-icon ${
            pathname.includes(routeToRequestsToBeUserServerAsAdmin("tow")) &&
            "selected"
          }`}
        >
          <Truck />
          <span>Operador de Grúa</span>
        </Link>
        <Link
          href={routeToRequestsToBeUserServerAsAdmin("laundry")}
          className={`sidebar-option ${
            pathname.includes(
              routeToRequestsToBeUserServerAsAdmin("laundry"),
            ) && "selected"
          }`}
        >
          <Soap />
          <span>Lavadero</span>
        </Link>
        <div>
          <i className="separator-horizontal green-opacity"></i>
        </div>

        <Link
          href={routeToRequestsToEditEnterpriseAsAdmin("laundry")}
          className={`sidebar-option ${
            pathname.includes(
              routeToRequestsToEditEnterpriseAsAdmin("laundry"),
            ) && "selected"
          }`}
        >
          <Soap />
          <span>Edicion de Lavaderos</span>
        </Link>
        <Link
          href={routeToRequestsToEditEnterpriseAsAdmin("mechanical")}
          className={`sidebar-option ${
            pathname.includes(
              routeToRequestsToEditEnterpriseAsAdmin("mechanical"),
            ) && "selected"
          }`}
        >
          <Warehouse />
          <span>Edicion de Talleres</span>
        </Link>
        <Link
          href={routeToRequestsToEditEnterpriseAsAdmin("tow")}
          className={`sidebar-option ${
            pathname.includes(routeToRequestsToEditEnterpriseAsAdmin("tow")) &&
            "selected"
          }`}
        >
          <Building />
          <span>Edicion de Emp. de Grúa</span>
        </Link>
        <Link
          href={routeToRequestsToEditEnterpriseAsAdmin("driver")}
          className={`sidebar-option ${
            pathname.includes(
              routeToRequestsToEditEnterpriseAsAdmin("driver"),
            ) && "selected"
          }`}
        >
          <Taxi />
          <span>Edicion de Emp. de {toCapitalize(DRIVER_PLURAL)}</span>
        </Link>

        <div>
          <i className="separator-horizontal green-opacity"></i>
        </div>

        <Link
          href={routeToEnterpriseRegistrationRequestsAsAdmin("laundry")}
          className={`sidebar-option ${
            pathname.includes(
              routeToEnterpriseRegistrationRequestsAsAdmin("laundry"),
            ) && "selected"
          }`}
        >
          <Soap />
          <span>Registro de Lavaderos</span>
        </Link>
        <Link
          href={routeToEnterpriseRegistrationRequestsAsAdmin("mechanical")}
          className={`sidebar-option ${
            pathname.includes(
              routeToEnterpriseRegistrationRequestsAsAdmin("mechanical"),
            ) && "selected"
          }`}
        >
          <Warehouse />
          <span>Registro de Talleres</span>
        </Link>
        <Link
          href={routeToEnterpriseRegistrationRequestsAsAdmin("tow")}
          className={`sidebar-option ${
            pathname.includes(
              routeToEnterpriseRegistrationRequestsAsAdmin("tow"),
            ) && "selected"
          }`}
        >
          <Building />
          <span>Registro Emp. de Grúa</span>
        </Link>
        <Link
          href={routeToEnterpriseRegistrationRequestsAsAdmin("driver")}
          className={`sidebar-option ${
            pathname.includes(
              routeToEnterpriseRegistrationRequestsAsAdmin("driver"),
            ) && "selected"
          }`}
        >
          <Taxi />
          <span>Registro Emp. de {toCapitalize(DRIVER_PLURAL)}</span>
        </Link>

        <div>
          <i className="separator-horizontal green-opacity"></i>
        </div>
        <Link
          href={routeToUserRequestsToRenewPhotoAsAdmin()}
          className={`sidebar-option ${
            pathname.includes(routeToUserRequestsToRenewPhotoAsAdmin()) &&
            "selected"
          }`}
        >
          <Camera />
          <span>Nuevas Fotos de Perfil</span>
        </Link>
        <Link
          href={routeToRequestsToRenewLicenseAsAdmin()}
          className={`sidebar-option ${
            pathname.includes(routeToRequestsToRenewLicenseAsAdmin()) &&
            "selected"
          }`}
        >
          <AddressCar />
          <span>Renovacion de Licencias</span>
        </Link>
        <Link
          href={routeToUserRequestsToChangeEnterpriseAsAdmin()}
          className={`sidebar-option ${
            pathname.includes(routeToUserRequestsToChangeEnterpriseAsAdmin()) &&
            "selected"
          }`}
        >
          <Repeat />
          <span>Cambiar de empresa</span>
        </Link>
      </li>
    </>
  );
};

export default RequestsSection;
