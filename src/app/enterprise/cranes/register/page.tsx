import CraneRegistration from "@/components/enterprises/crane/CraneRegistration";
import PageServerUserPermission from "@/components/permission_handlers/views/page/concrets/PageServerUserPermission";

const CraneworkshopRegisterPage = () => {
    return (
        <PageServerUserPermission>
            <CraneRegistration />
        </PageServerUserPermission>
    );
};

export default CraneworkshopRegisterPage;
