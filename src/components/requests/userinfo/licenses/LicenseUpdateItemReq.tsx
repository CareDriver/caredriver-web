import { LicenseUpdateReq } from "@/interfaces/PersonalDocumentsInterface";
import { vehicleTypeRender } from "@/interfaces/VehicleInterface";
import { toformatDate } from "@/utils/parser/ForDate";
import Link from "next/link";

const LicenseUpdateItemReq = ({ license }: { license: LicenseUpdateReq }) => {
    return (
        <Link
            href={`/admin/requests/userinfo/license/${license.id}`}
            className="personal-data-req-item | left touchable"
        >
            <h3 className="personal-data-req-item-name">{license.userName}</h3>
            {(license.vehicleType === "car" ||
                license.vehicleType === "motorcycle" ||
                license.vehicleType === "tow") && (
                <h4 className="text | light">
                    <b>Categoria: </b>
                    {vehicleTypeRender[license.vehicleType]}
                </h4>
            )}
            <h4 className="text | light">
                <b>Nueva fecha de expiracion: </b>
                {toformatDate(license.expiredDateLicense.toDate())}
            </h4>
        </Link>
    );
};

export default LicenseUpdateItemReq;
