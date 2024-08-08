import SingleServiceDone from "@/components/services_performed/SingleServiceDone";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleTowServiceDidByUserPage = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="usertowserreq" id={params.serviceid}>
                <SingleServiceDone id={params.serviceid} type="tow" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleTowServiceDidByUserPage;
