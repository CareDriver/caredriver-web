import { LicenseUpdateReq } from "@/interfaces/PersonalDocumentsInterface";
import Link from "next/link";

const LicenseUpdateItemReq = ({ license }: { license: LicenseUpdateReq }) => {
    return (
        <Link href={`/admin/requests/userinfo/license/${license.id}`}>
            <h3>{license.userName}</h3>
            <h4>{license.vehicleType}</h4>
            <h4>{license.expiredDateLicense.toDate().toISOString()}</h4>
        </Link>
    );
};

export default LicenseUpdateItemReq;
