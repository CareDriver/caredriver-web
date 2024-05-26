import CraneRegistration from "@/components/enterprises/crane/CraneRegistration";
import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";

const CraneworkshopRegisterPage = () => {
    return (
        <PageServerUserPermission>
            <CraneRegistration />
        </PageServerUserPermission>
    );
};

export default CraneworkshopRegisterPage;
