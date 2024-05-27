import SingleServiceDone from "@/components/done_services/SingleServiceDone";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleMechanicServiceDidByUserPage = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="usermechanicserreq" id={params.serviceid}>
                <SingleServiceDone id={params.serviceid} type="mechanic" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleMechanicServiceDidByUserPage;
