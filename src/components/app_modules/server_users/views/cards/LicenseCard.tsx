import { VEHICLE_CATEGORY_TO_SPANISH } from "@/components/app_modules/server_users/models/VehicleFields";
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
            <h3 className="personal-data-req-item-name">{license.userName}</h3>
            {(license.vehicleType === "car" ||
                license.vehicleType === "motorcycle" ||
                license.vehicleType === "tow") && (
                <h4 className="text | light">
                    <b>Categoria: </b>
                    {VEHICLE_CATEGORY_TO_SPANISH[license.vehicleType]}
                </h4>
            )}
            <h4 className="text | light">
                <b>Nueva fecha de expiración: </b>
                {timestampDateInSpanish(license.expiredDateLicense)}
            </h4>
        </Link>
    );
};

export default LicenseCard;
