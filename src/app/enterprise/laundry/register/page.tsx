import LaundryRegistration from "@/components/enterprises/laundry/LaundryRegistration";
import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";

const LaundryEnterpriseRegisterPage = () => {
    return (
        <PageServerUserPermission>
            <LaundryRegistration />
        </PageServerUserPermission>
    );
};

export default LaundryEnterpriseRegisterPage;
