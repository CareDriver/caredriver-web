import ServicesRequestedByUser from "@/components/done_services/requested/ServicesRequestedByUser";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const ListOfTowServiceDoneByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <ServicesRequestedByUser serviceUserId={params.id} type="tow" />
        </PageUserInfoPermission>
    );
};

export default ListOfTowServiceDoneByUser;
