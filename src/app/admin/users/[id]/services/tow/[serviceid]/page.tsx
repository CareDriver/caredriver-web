import SingleServiceDone from "@/components/done_services/SingleServiceDone";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleTowServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="usertowservice" id={params.serviceid}>
                <SingleServiceDone id={params.serviceid} type="tow" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleTowServiceReqByUser;
