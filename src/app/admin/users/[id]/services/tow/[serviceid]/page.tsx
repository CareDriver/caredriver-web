import SingleServiceDone from "@/components/done_services/SingleServiceDone";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleTowServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <SingleServiceDone id={params.serviceid} type="tow" />
        </PageUserInfoPermission>
    );
};

export default SingleTowServiceReqByUser;
