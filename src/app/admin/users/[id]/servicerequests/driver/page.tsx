import ServicesRequestedByUser from "@/components/done_services/requested/ServicesRequestedByUser";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const ListOfDriveServiceDoneByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <ServicesRequestedByUser serviceUserId={params.id} type="driver" />
        </PageUserInfoPermission>
    );
};

export default ListOfDriveServiceDoneByUser;
