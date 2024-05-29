import SingleServiceDone from "@/components/done_services/SingleServiceDone";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleMechanicServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="usermechanicservice" id={params.serviceid}>
                <SingleServiceDone id={params.serviceid} type="mechanic" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleMechanicServiceReqByUser;
