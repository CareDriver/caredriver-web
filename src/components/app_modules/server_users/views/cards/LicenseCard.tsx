import { VEHICLE_CATEGORY_TO_SPANISH } from "@/components/app_modules/server_users/models/VehicleFields";
import UserIcon from "@/icons/UserIcon";
import { LicenseUpdateReq } from "@/interfaces/PersonalDocumentsInterface";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import { routeToReviewRequestToRenewLicenseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";
import Link from "next/link";

const LicenseCard = ({ license }: { license: LicenseUpdateReq }) => {
    return (
        <Link
            href={routeToReviewRequestToRenewLicenseAsAdmin(license.id)}
            className="personal-data-req-item | left touchable"
        >
            <h3 className="text | medium bolder capitalize | icon-wrapper">
                <UserIcon />
                {license.userName}
            </h3>
            <div className="separator-horizontal"></div>
            {(license.vehicleType === "car" ||
                license.vehicleType === "motorcycle" ||
                license.vehicleType === "tow") && (
                <h4 className="text">
                    <b className="text bold">Categoria: </b>
                    <i className="text light">
                        {VEHICLE_CATEGORY_TO_SPANISH[license.vehicleType]}
                    </i>
                </h4>
            )}
            <h4 className="text">
                <b className="text bold">Nueva fecha de expiración: </b>
                <i className="text light">
                    {timestampDateInSpanish(license.expiredDateLicense)}
                </i>
            </h4>
        </Link>
    );
};

export default LicenseCard;
