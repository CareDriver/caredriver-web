import LaundryPanel from "@/components/enterprises/laundry/LaundryPanel";
import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";

const CraneworkshopPage = () => {
    return (
        <PageServerUserPermission>
            <LaundryPanel />
        </PageServerUserPermission>
    );
};

export default CraneworkshopPage;
